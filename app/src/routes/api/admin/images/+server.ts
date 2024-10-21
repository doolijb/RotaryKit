import type { RequestEvent } from "@sveltejs/kit"
import { adminApi, hasAdminPermission, validateData } from "$server/requests"
import { BadRequest, Created, InternalServerError } from "sveltekit-zero-api/http"
import { logger } from "$server/logging"
import type { KitEvent } from "sveltekit-zero-api"
import { db, schema } from "$server/database"
import { AdminCreateEmail as PostForm } from "$shared/validation/forms"
import { emails } from "$server/providers"

interface GET {
    query?: GetListQueryParameters
}

interface Post {
    body: PostForm['Data']
}

const postForm = PostForm.init()

/**
 * Admin view for a list of email addresses
 */
export async function GET (event: KitEvent<GET, RequestEvent>) {

    try {

        // Check permissions
        hasAdminPermission(event, schema.images)

        const columns: {[key:string]: boolean}  = {
            "id": true,
            "totalBytes": true,
            "createdAt": true,
            "status": true,
        }

        const availableRelations: AvailableRelations = {
            "uploadedByUser": {
                tableName: "users",
                columns: {
                    "id":true,
                    "username": true,
                },
            },
            "profileImageUser": {
                tableName: "users",
                columns: {
                    "id":true,
                    "username": true,
                },
            }
        }

        return await adminApi.getListOf<SelectImage>({
            event,
            tableName: "images",
            columns,
            availableRelations
        })

    } catch (err) {
        logger.exception(err, event)
        return InternalServerError()
    }
}


/**
 * Admin view for a list of email addresses
 */
export async function POST(event: KitEvent<Post, RequestEvent>) {
    try {
        /**
         * Check permissions
         */
        hasAdminPermission(event, schema.emails)

        /**
         * Validate the data
         */
        const { data, errors } = await validateData<PostForm["Data"]>({ form: postForm, event })
        if (Object.entries(errors).length > 0) return BadRequest({body: errors})

        ////
        // DATABASE VALIDATION
        ////

        // Check if role name is already taken
        if (await db.query.emails.findFirst({where: (e, {eq}) => eq(e.address, data.address)})) {
            errors["address"] = {"Taken": "This email address is already in use"}
        }

        // If errors, throw an error
        if (Object.entries(errors).length > 0) {
            return BadRequest({body: errors})
        }
        
        ////
        // CREATE EMAIL ADDRESS
        ////

        let result: SelectEmail

        await db.transaction(async (tx) => {
            // Create the role
            await emails.create({...data, tx})
        }).then(async () => {
            result = await db.query.emails.findFirst({where: (r, {eq}) => eq(r.address, data.address)})
        })

        // Return the email
        return Created({ body: { success: true, result }})
    } catch (err) {
        logger.exception(err, event)
        return InternalServerError()
    }
}