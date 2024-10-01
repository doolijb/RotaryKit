import type { RequestEvent } from "@sveltejs/kit"
import { adminApi, hasAdminPermission } from "$server/requests"
import { InternalServerError } from "sveltekit-zero-api/http"
import { logger } from "$server/logging"
import type { KitEvent } from "sveltekit-zero-api"
import { Check } from "drizzle-orm/mysql-core"
import { schema } from "$server/database"

interface GET {
    query?: GetListQueryParameters
}

// interface Post {
//     body: PostForm['Data']
// }


/**
 * Admin view for a list of email addresses
 */
export async function GET (event: KitEvent<GET, RequestEvent>) {

    try {

        // Check permissions
        hasAdminPermission(event, schema.emails)

        const columns: {[key:string]: boolean}  = {
            "id":true,
            "address":true,
            "createdAt":true,
            "updatedAt":true,
            "verifiedAt":true,
            "isUserPrimary":true,
        }

        const availableRelations: AvailableRelations = {
            "user": {
                tableName: "emails",
                columns: {
                    "id":true,
                    "username": true,
                },
            }
        }

        return await adminApi.getListOf<SelectEmail>({
            event,
            tableName: "emails",
            columns,
            availableRelations
        })

    } catch (err) {
        logger.exception(err, event)
        return InternalServerError()
    }
}