import { snakeCase } from "lodash"

/**
 * 
 * @param {SelectAdminPermission[]} args.adminPermissions
 * @param {"GET"|"PUT"|"POST"|"DELETE"} args.action
 * @param {string[]} args.resources
 * @returns 
 */
export function hasAdminPermission({
    adminPermissions,
    action,
    resources,
}:{
    adminPermissions: SelectAdminPermission[],
    action: PermissionAction,
    resources: string[],
}): boolean {

    /**
     * Loop through each resource and check if the user has the required permission
     */
    for (const resource of resources) {
        /**
         * Loop through each permission and check if the user has the required permission
         */
        for (const adminPermission of adminPermissions) {
            /**
             * If the action and resource match, then the user has permission
             */
            if (adminPermission.action === action && adminPermission.resource === snakeCase(resource)) {
                return true
            }
        }
    }

    /**
     * If we get here, then the user doesn't have permission
     */
    return false
}
