import { pgTable, uuid, text, timestamp, primaryKey } from "drizzle-orm/pg-core"
import { relations } from "drizzle-orm"
import { adminPermissions } from "./adminPermissions"
import { adminRoles } from "./adminRoles"

/**
 * Staff role permissions are a way to group permissions together.
 */
export const adminRolesToPermissions = pgTable("admin_roles_to_permissions", {
    adminPermissionId: uuid("admin_permission_id").notNull().references(() => adminPermissions.id, { onDelete: 'cascade' }),
    adminRoleId: uuid("admin_role_id").notNull().references(() => adminRoles.id, { onDelete: 'cascade' }),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at").notNull().defaultNow(),
}, (t) => ({
    pk: primaryKey({columns:[t.adminPermissionId, t.adminRoleId]}),
}))

export const adminRolesToPermissionRelations = relations(adminRolesToPermissions, ({ one: One }) => ({
        adminPermission: One(adminPermissions, {
            fields: [adminRolesToPermissions.adminPermissionId], references: [adminPermissions.id]
        }),
        adminRole: One(adminRoles, {
            fields: [adminRolesToPermissions.adminRoleId], references: [adminRoles.id]
        }),
    })
)