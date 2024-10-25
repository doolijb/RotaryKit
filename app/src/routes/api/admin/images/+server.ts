import type { RequestEvent } from "@sveltejs/kit"
import { adminApi, hasAdminPermission, validateData } from "$server/requests"
import { BadRequest, Created, InternalServerError } from "sveltekit-zero-api/http"
import { logger } from "$server/logging"
import type { KitEvent } from "sveltekit-zero-api"
import { db, schema } from "$server/database"
import { AdminCreateImage as PostForm } from "$shared/validation/forms"
import { images } from "$server/providers"
import type { ImageSizes } from "$shared/constants"

interface GET {
    query?: GetListQueryParameters
}

interface Post {
    body: PostForm['Data']
}

const postForm = PostForm.init()

/**
 * Admin view for a list of images
 */
export async function GET (event: KitEvent<GET, RequestEvent>) {

    try {

        // Check permissions
        hasAdminPermission(event, schema.images)

        const columns: {[key:string]: boolean}  = {
            "id": true,
            "totalBytes": true,
            "createdAt": true,
            "updatedAt": true,
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
 * Admin view for a list of images
 */
export async function POST(event: KitEvent<Post, RequestEvent>) {
    try {
        /**
         * Check permissions
         */
        hasAdminPermission(event, schema.images)

        /**
         * Validate the data
         */
        const { data, errors } = await validateData<PostForm["Data"]>({ form: postForm, event })
        if (Object.entries(errors).length > 0) return BadRequest({body: errors})

        // If errors, throw an error
        if (Object.entries(errors).length > 0) {
            return BadRequest({body: errors})
        }
        
        /**
         * Create Image
         */

        const file = data.image[0] as File

        let result: SelectImage

        await db.transaction(async (tx) => {
			[result] = await await images.create({ 
                tx, 
                file,
                title: data.title,
                maxSize: data.maxSize as typeof ImageSizes.Option,
                status: data.status as typeof ImageStatus.Option,
                uploadedByUserId: event.locals.user.id,
                returning: {id: schema.images.id}
            })
            console.log("result", result)
		})

        // Return the image
        return Created({ body: { result }})

    } catch (err) {
        logger.exception(err, event)
        return InternalServerError()
    }
}