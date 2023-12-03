import type { RequestEvent } from "@sveltejs/kit"
import { getTableName } from "drizzle-orm"
import { getTableConfig, type PgTableWithColumns } from "drizzle-orm/pg-core"
import { utils } from "@database"
import { forbiddenError } from "@requests"

/**
 * Checks if the user has the permission to do the action.
 * Super users have all permissions whether they are explicitly assigned or not.
 * All other users must be staff for the permission to be valid.
 * Throws a forbidden error if the user does not have permission.
 * 
 * @example:
 * export async function POST (event: RequestEvent) {
 *         hasStaffPermission(event, schema.users)
 *         //... continue with request
 * }
 */
export default function hasStaffPermission(
    event: RequestEvent,
    schema: PgTableWithColumns<any>
): true {

    /**
     * Get our user
     * If there is no user, then we don't have permission
     * If the user is a super user, then we have permission
     * Otherwise, we need to check the permissions
     */
    const user = event.locals.user
    if (!user || (!user.isSuperUser && !user.isAdmin)) {
        throw forbiddenError()
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
     * Compile a list of all the permissions the user has witht he same action
     */
    const staffPermissions = []
    user.toStaffRoles.forEach(({staffRole}: SelectUserStaffRole) => {
        staffRole.toPermissions.forEach(({staffPermission}: SelectStaffRolePermission) => {
            staffPermission.action === action && staffPermissions.push(staffPermission)
        })
    })

    /**
     * Loop over requiredPermissions and check if the user has the permission.
     * If not all requiredPermissions are found, then we don't have permission.
     */
    const hasPermissions = requiredPermissions.every((requiredPermission) => {
        return staffPermissions.some((staffPermission) => {
            return (
                staffPermission.action === requiredPermission.action &&
                staffPermission.resource === requiredPermission.resource
            )
        })
    })

    /**
     * If we don't have permission, throw an error
     */
    if (!hasPermissions) {
        throw forbiddenError()
    }

    /**
     * If we made it this far, then we have permission
     */
    return true
}