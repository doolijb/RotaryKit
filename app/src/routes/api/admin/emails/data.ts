import type { RequestEvent } from "@sveltejs/kit"
import { adminApi } from "@requests"

/**
 * Admin view for a list of users
 */
async function GET (event: RequestEvent): Promise<PaginatedResponse<SelectEmail>> {

    const columns: {[key:string]: boolean}  = {
        "id":true,
        "address":true,
        "createdAt":true,
        "updatedAt":true,
        "verifiedAt":true,
        "isUserPrimary":true,
    }

    const availableRelations: AvailableRelations<SelectEmail>  = {
        "user": {
            tableName: "emails",
            columns: {
                "id":true,
                "username": true,
            },
        }
    }

    return adminApi.getListOf<SelectEmail>({
        event,
        tableName: "emails",
        columns,
        availableRelations
    })
}

export default {
    GET
}