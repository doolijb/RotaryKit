import type { RequestEvent } from "@sveltejs/kit"
import { adminApi, error, validateForm, } from "@requests"
import type { PgTableWithColumns } from "drizzle-orm/pg-core"
import { db, schema } from "@database"
import { utils, forms } from "@validation"
import { emails, users } from "@providers"

/**
 * Admin view for a list of users
 */
async function GET (event: RequestEvent): Promise<PaginatedResponse<SelectUser>> {
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

    return adminApi.getListOf<SelectUser>({
        event,
        tableName: "users",
        columns,
        availableRelations
    })
}

/**
 * @param event 
 */
async function POST(event: RequestEvent): Promise<SelectUser> {
    // Check if user is authorized to create a user
    // TODO

    ////
    // FORM VALIDATION
    ////

    const definitions = forms.adminCreateUser

    // Check if user is superuser
    if(!event.locals.user.isSuperUser) {
        // If not, remove isSuperUser from the definitions
        delete definitions["isSuperUser"]
        delete definitions["isAdmin"]
    }

    // Create the form
    const form = utils.formValidator({definitions})

    // Validate the data, this will automatically throw an error if the data is invalid
    await validateForm({ form, data: event.locals.data})

    ////
    // DATABASE VALIDATION
    ////

    const errors = {}

    // Check if username is already taken
    if (await users.exists({username: event.locals.data.username})) {
        errors["username"] = {"Taken": "This username is already in use"}
    }

    // If email, check if email is already taken
    if (!!event.locals.data.email) {
        if (await emails.exists({address: event.locals.data.email})) {
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
            username: event.locals.data.username,
            isVerified: event.locals.data.isVerified,
            isAdmin: event.locals.data.isAdmin,
            isSuperUser: event.locals.data.isSuperUser,
            returning: {userId: schema.users.id}
        })

        // If passphrase, create the passphrase
        if (!!event.locals.data.passphrase) {
            await users.passphrase.set({
                tx,
                userId,
                passphrase: event.locals.data.passphrase,
                createOnly: true
            })
        }

        // If email, create the email
        if (!!event.locals.data.email) {
            await emails.create({
                tx,
                userId,
                address: event.locals.data.email,
                isUserPrimary: true,
                isVerified: event.locals.data.isVerified,
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
    return {
        success: true,
        result,
    }
}

export default {
    GET,
    POST
}