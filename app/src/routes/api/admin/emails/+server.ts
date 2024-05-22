import type { RequestEvent } from "@sveltejs/kit"
import { adminApi } from "$server/requests"
import { InternalServerError } from "sveltekit-zero-api/http"

/**
 * Admin view for a list of users
 */
export async function GET (event: RequestEvent) {

    try {

        // TODO CHECK PERMISSIONS

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