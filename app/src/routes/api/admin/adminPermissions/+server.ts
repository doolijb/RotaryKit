import type { RequestEvent } from "@sveltejs/kit"
import { adminApi } from "$server/requests"
import { InternalServerError } from "sveltekit-zero-api/http"
import type { KitEvent } from "sveltekit-zero-api"
import { logger } from "$server/logging"

interface Get {
    query?: GetListQueryParameters
}

/**
 * Admin view for a list of admin permissions
 */
export async function GET (event: KitEvent<Get, RequestEvent>) {
    try {
        // Check if user is authorized to view users
        // TODO

        const columns: {[key:string]: boolean}  = {
            "id":true,
            "name":true,
            "action":true,
            "resource":true,
        }

        const availableRelations: AvailableRelations = {}

        return await adminApi.getListOf<SelectAdminPermission>({
            event,
            tableName: "adminPermissions",
            columns,
            availableRelations,
            defaults: {
                orderBy: "name:asc"
            }
        })

    } catch (err) {
        logger.exception(err, event)
        return InternalServerError()
    }
}