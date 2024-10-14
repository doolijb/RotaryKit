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
import { adminPermissions, adminPermissionRelations } from "./adminPermissions"
import { adminRoles, adminRoleRelations } from "./adminRoles"
import { adminRolesToPermissions, adminRolesToPermissionRelations } from "./adminRolesToPermissions"
import { usersToAdminRoles, usersToAdminRoleRelations } from "./usersToAdminRoles"

/**
 * Files
 */
import { images, imageRelations } from "./images"

/**
 * Logging
 */
import { emailLogs } from "./emailLogs"

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
    adminPermissions,
    adminRoles,
    adminRolesToPermissions,
    usersToAdminRoles,
    emailLogs,
    images,
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
    adminPermissionRelations,
    adminRoleRelations,
    adminRolesToPermissionRelations,
    usersToAdminRoleRelations,
    imageRelations,
}