import { adminApi, error, validateData } from "$requests"
import type { PgTableWithColumns } from "drizzle-orm/pg-core"
import { db, schema } from "$database"
import { emails, users } from "$providers"
import { Ok } from "sveltekit-zero-api/http"
import { AdminCreateUser as PostForm, AdminCreateUserWithPermissions as PostFormWithPermissions } from "$validation/forms"
import type { RequestEvent } from "@sveltejs/kit"
import type { KitEvent } from "sveltekit-zero-api"

const postForm = new PostForm()
const postFormWithPermissions = new PostFormWithPermissions()

interface Post {
    body: PostFormWithPermissions['Data'] | PostForm['Data']
}

/**
 * Admin view for a list of users
 */
export async function GET (event: RequestEvent) {
    // Check if user is authorized to view users
    // TODO

    const columns: {[key:string]: boolean}  = {
        "id":true,
        "username":true,
        "createdAt":true,
        "updatedAt":true,
        "verifiedAt":true,
        "isAdmin":true,
        "isSuperUser":true,
    }

    const availableRelations: AvailableRelations<SelectUser>  = {
        "emails": {
            tableName: "emails",
            columns: {
                "id":true,
                "address":true,
                "isUserPrimary":true
            },
            where: (e: PgTableWithColumns<any>, {eq}) => eq(e["isUserPrimary"], true)
        }
    }

    const body = await adminApi.getListOf<SelectUser>({
        event,
        tableName: "users",
        columns,
        availableRelations
    })

    return Ok({body})
}

/**
 * @param event 
 */
export async function POST(event: KitEvent<Post, RequestEvent>) {
    // Check if user is authorized to create a user
    // TODO

    /**
	 * Validate the data
	 */
    let useForm: PostForm | PostFormWithPermissions = postForm
    // Check if user is superuser
    if(event.locals.user.isSuperUser) {
        useForm = postFormWithPermissions
    }
	const data = await event.request.json()
	await validateData({
		form: useForm,
		data, 
	})

    ////
    // DATABASE VALIDATION
    ////

    const errors = {}

    // Check if username is already taken
    if (await users.exists({username: data.username})) {
        errors["username"] = {"Taken": "This username is already in use"}
    }

    // If email, check if email is already taken
    if (data.email) {
        if (await emails.exists({address: data.email})) {
            errors["email"] = {"Taken": "This email is already in use"}
        }
    }

    // If errors, throw an error
    if (Object.entries(errors).length > 0) {
        throw error(400, {
			errors
		})
    }
    
    ////
    // CREATE USER
    ////

    let userId: SelectUser["id"]
    let result: SelectUser

    await db.transaction(async (tx) => {

        // Create the user
        [{userId}] = await users.create({
            tx,
            username: data.username,
            isVerified: data.isVerified,
            isAdmin: data["isAdmin"] || false,
            isSuperUser: data["isSuperUser"] || false,
            returning: {userId: schema.users.id}
        })

        // If passphrase, create the passphrase
        if (data.passphrase) {
            await users.passphrase.set({
                tx,
                userId,
                passphrase: data.passphrase,
                createOnly: true
            })
        }

        // If email, create the email
        if (data.email) {
            await emails.create({
                tx,
                userId,
                address: data.email,
                isUserPrimary: true,
                isVerified: data.isVerified,
            })
        }
    }).then(async () => {
        result = await db.query.users.findFirst({
            where: (u, {eq}) => eq(u.id, userId),
            with: {
                emails: true
            }
        })
    })

    // Return the user
    return Ok({
        body:{ success: true, result }
    })
}