import { pgTable, uuid, text, timestamp, primaryKey } from "drizzle-orm/pg-core"
import { relations } from "drizzle-orm"
import { staffPermissions } from "./staffPermissions"
import { staffRoles } from "./staffRoles"

/**
 * Staff role permissions are a way to group permissions together.
 */
export const staffRolesToPermissions = pgTable("staff_roles_to_permissions", {
    name: text("name").notNull(),
    staffPermissionId: uuid("user_permission_id").notNull().references(() => staffPermissions.id, { onDelete: 'cascade' }),
    staffRoleId: uuid("staff_role_id").notNull().references(() => staffRoles.id, { onDelete: 'cascade' }),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at").notNull().defaultNow(),
}, (t) => ({
    pk: primaryKey(t.staffPermissionId, t.staffRoleId),
}))

export const staffRolesToPermissionRelations = relations(staffRolesToPermissions, ({ one: One }) => ({
        staffPermission: One(staffPermissions, {
            fields: [staffRolesToPermissions.staffPermissionId], references: [staffPermissions.id]
        }),
        staffRole: One(staffRoles, {
            fields: [staffRolesToPermissions.staffRoleId], references: [staffRoles.id]
        }),
    })
)