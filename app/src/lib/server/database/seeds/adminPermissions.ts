import { db, schema } from "$server/database"
import { logger } from "$server/logging"
import { getTableConfig, type AnyPgColumn } from "drizzle-orm/pg-core"
import {usesPermissions} from '../schema/index';

interface InsertAdminPermission {
	action: string
	resource: string
	name: string
}

const actionsMap = {
	GET: "View",
	POST: "Create",
	PUT: "Edit",
	DELETE: "Delete"
}

function getIsPivotTable(tableConfig: { columns: Record<string, AnyPgColumn> }): boolean {
	return !Object.values(tableConfig.columns).some((c: AnyPgColumn) => c.primary)
}

/**
 * Seeds the admin_permissions table with the default permissions for admin users.
 * Only inserts missing or new permissions.
 * Permissions are automatically generated for database schema containing an "id" column.
 * Pivot tables should be ignored.
 */
export default async function adminPermissions(tx = db): Promise<void> {
	const existingPermissions = await tx.query.adminPermissions.findMany()
	const insertPermissions: InsertAdminPermission[] = []

	for (const [key, value] of Object.entries(schema).filter(
		([key, value]) => usesPermissions[key]
	)) {
		try {
			const tableConfig = getTableConfig(value)

			if (getIsPivotTable(tableConfig)) {
				continue
			}

			const baseName = tableConfig.name.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase())

			for (const [action, actionName] of Object.entries(actionsMap)) {
				const name = `${actionName} ${baseName}`

				if (
					!existingPermissions.find((p) => p.action === action && p.resource === tableConfig.name)
				) {
					insertPermissions.push({
						action: action,
						resource: tableConfig.name,
						name
					})
				}
			}
		} catch (e) {
			console.log(`• ${key} - ${e}`)
		}
	}

	if (insertPermissions.length) {
		try {
			await tx.insert(schema.adminPermissions).values(insertPermissions)
		} catch (e) {
			logger.error({ message: e.message, stack: e.stack })
		}
	}
}
