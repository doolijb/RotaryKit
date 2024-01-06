import type { RequestEvent } from "@sveltejs/kit"
import { adminApi } from "$requests"
import { Ok } from "sveltekit-zero-api/http"

/**
 * Admin view for a list of admin permissions
 */
export async function GET (event: RequestEvent) {
    // Check if user is authorized to view users
    // TODO

    const columns: {[key:string]: boolean}  = {
        "id":true,
        "name":true,
        "action":true,
        "resource":true,
    }

    const availableRelations: AvailableRelations<SelectAdminPermission>  = {}

    const body = await adminApi.getListOf<SelectAdminPermission>({
        event,
        tableName: "adminPermissions",
        columns,
        availableRelations,
        defaultOrderByString: "name:asc"
    })

    return Ok({body})
}