import type { RequestEvent } from "@sveltejs/kit"
import { adminApi, error, validateForm, } from "@requests"
import type { PgTableWithColumns } from "drizzle-orm/pg-core"
import { db, schema } from "@database"
import { utils, forms } from "@validation"
import { emails, users } from "@providers"

/**
 * Admin view for a list of admin permissions
 */
async function GET (event: RequestEvent): Promise<PaginatedResponse<SelectAdminPermission>> {
    // Check if user is authorized to view users
    // TODO

    const columns: {[key:string]: boolean}  = {
        "id":true,
        "name":true,
        "action":true,
        "resource":true,
    }

    const availableRelations: AvailableRelations<SelectAdminPermission>  = {
    }

    return adminApi.getListOf<SelectAdminPermission>({
        event,
        tableName: "adminPermissions",
        columns,
        availableRelations,
        defaultOrderByString: "name:asc"
    })
}



export default {
    GET
}