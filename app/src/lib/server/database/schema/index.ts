/**
 * Users
 */
import { users, userRelations} from "./users"
import { emails, emailRelations} from "./emails"

/**
 * Authentication
 */
import { userTokens, usersTokenRelations } from "./userTokens"
import { emailVerifications, emailVerificationRelations } from "./emailVerifications"
import { passphrases } from "./passphrases"
import { passphraseResets, passphraseResetRelations } from "./passphraseResets"

/**
 * Staff permissions
 */
import { staffPermissions, staffPermissionRelations } from "./staffPermissions"
import { staffRoles, staffRoleRelations } from "./staffRoles"
import { staffRolesToPermissions, staffRolesToPermissionRelations } from "./staffRolesToPermissions"
import { usersToStaffRoles, usersToStaffRoleRelations } from "./usersToStaffRoles"

/**
 * Tables only
 */
export const schema = {
    users,
    emails,
    userTokens,
    emailVerifications,
    passphrases,
    passphraseResets,
    staffPermissions,
    staffRoles,
    staffRolesToPermissions,
    usersToStaffRoles,
}

/**
 * Relations only
 */
export const relations = {
    userRelations,
    emailRelations,
    usersTokenRelations,
    emailVerificationRelations,
    passphraseResetRelations,
    staffPermissionRelations,
    staffRoleRelations,
    staffRolesToPermissionRelations,
    usersToStaffRoleRelations,
}