import type { RequestEvent } from "@sveltejs/kit"
import { adminApi } from "$requests"
import { Ok } from "sveltekit-zero-api/http"

/**
 * Admin view for a list of users
 */
export async function GET (event: RequestEvent) {

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

    const body = await adminApi.getListOf<SelectEmail>({
        event,
        tableName: "emails",
        columns,
        availableRelations
    })

    return Ok({body})
}