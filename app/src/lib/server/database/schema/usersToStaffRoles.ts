import { pgTable, uuid, timestamp, primaryKey } from "drizzle-orm/pg-core"
import { relations } from "drizzle-orm"
import { users } from "./users"
import { staffRoles } from "./staffRoles"
import { staffPermissions } from "./staffPermissions"

/**
 * User staff roles are a way to grant users permissions.
 */
export const usersToStaffRoles = pgTable("users_to_staff_roles", {
    userId: uuid("user_id").notNull().references(() => users.id, { onDelete: 'cascade' }),
    roleId: uuid("role_id").notNull().references(() => staffRoles.id, { onDelete: 'cascade' }),
    createdAt: timestamp("created_at").notNull().defaultNow(),
}, (t) => ({
    pk: primaryKey(t.userId, t.roleId),
}))

export const usersToStaffRoleRelations = relations(usersToStaffRoles, ({ one: One }) => ({
    user: One(users, {
        fields: [usersToStaffRoles.userId], references: [users.id]
    }),
    staffRole: One(staffRoles, {
        fields: [usersToStaffRoles.roleId], references: [staffRoles.id]
    }),
}))

