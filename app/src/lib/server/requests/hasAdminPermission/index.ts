import type { RequestEvent } from "@sveltejs/kit"
import { getTableName } from "drizzle-orm"
import { getTableConfig, type PgTableWithColumns } from "drizzle-orm/pg-core"
import { utils } from "$server/database"

/**
 * Checks if the user has the permission to do the action.
 * Super users have all permissions whether they are explicitly assigned or not.
 * All other users must be staff for the permission to be valid.
 *
 * @example:
 * export async function POST (event: RequestEvent) {
 *         if (!hasAdminPermission(event, schema.users)) { return Forbidden() }
 *         //... continue with request
 * }
 */
export function hasAdminPermission(event: RequestEvent, schema: PgTableWithColumns<any>): boolean {
	/**
	 * Get our user
	 * If there is no user, then we don't have permission
	 * If the user is a super user, then we have permission
	 * Otherwise, we need to check the permissions
	 */
	const user = event.locals.user

	if (!user || (!user.isSuperUser && !user.isAdmin)) {
		return false
	}
	if (user.isSuperUser) {
		return true
	}

	/**
	 * Check if the schema is a pivot table.
	 * If so, then we are going to check user has permissions for both sides.
	 * If not, then we only check permission for the current schema.
	 */
	const tableConfig = getTableConfig(schema)
	const requiredPermissions = []
	const action = event.request.method as PermissionAction

	/**
	 * If pivot, get the tableConfig for each foreignKey, and define
	 * permissions for each of them.
	 * Or
	 * Get the tableConfig for the current schema, and define
	 */
	if (utils.getIsPivotTable(tableConfig)) {
		tableConfig.foreignKeys.forEach((foreignKey) => {
			requiredPermissions.push({
				action,
				resource: getTableName(foreignKey.table)
			})
		})
	} else {
		requiredPermissions.push({
			action,
			resource: tableConfig.name
		})
	}

	/**
	 * As a failsafe, throw an error if requiredPermissions is empty
	 */
	if (!requiredPermissions.length) {
		throw new Error("requiredPermissions is empty")
	}

	/**
	 * Loop over requiredPermissions and check if the user has the permission.
	 * If not all requiredPermissions are found, then we don't have permission.
	 */
	const hasPermissions = requiredPermissions.every((requiredPermission) => {
		return event.locals.adminPermissions.some((adminPermission) => {
			return (
				adminPermission.action === requiredPermission.action &&
				adminPermission.resource === requiredPermission.resource
			)
		})
	})

	/**
	 * If we don't have permission, throw an error
	 */
	if (!hasPermissions) {
		return false
	}

	/**
	 * If we made it this far, then we have permission
	 */
	return true
}
