import type { RequestEvent } from "@sveltejs/kit"
import { adminApi, hasAdminPermission } from "$server/requests"
import { InternalServerError } from "sveltekit-zero-api/http"
import type { KitEvent } from "sveltekit-zero-api"
import { logger } from "$server/logging"
import { schema } from "$server/database"

interface Get {
	query?: GetListQueryParameters
}

/**
 * Admin view for a list of admin permissions
 */
export async function GET(event: KitEvent<Get, RequestEvent>) {
	try {
		// Check permissions
		hasAdminPermission(event, schema.adminRoles)

		const columns: { [key: string]: boolean } = {
			id: true,
			name: true,
			action: true,
			resource: true
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
