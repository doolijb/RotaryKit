import { pgTable, uuid, timestamp, primaryKey, type PgTableWithColumns } from "drizzle-orm/pg-core"
import { relations } from "drizzle-orm"
import { users } from "./users"
import { adminRoles } from "./adminRoles"

/**
 * User staff roles are a way to grant users permissions.
 */
export const usersToAdminRoles: PgTableWithColumns<any> & { usePermissions?: boolean } = pgTable(
	"users_to_admin_roles",
	{
		userId: uuid("user_id")
			.notNull()
			.references(() => users.id, { onDelete: "cascade" }),
		adminRoleId: uuid("admin_role_id")
			.notNull()
			.references(() => adminRoles.id, { onDelete: "cascade" }),
		createdAt: timestamp("created_at").notNull().defaultNow()
	},
	(t) => ({
		pk: primaryKey({ columns: [t.userId, t.adminRoleId] })
	})
)

usersToAdminRoles.usePermissions = false

export const usersToAdminRoleRelations = relations(usersToAdminRoles, ({ one: One }) => ({
	user: One(users, {
		fields: [usersToAdminRoles.userId],
		references: [users.id]
	}),
	adminRole: One(adminRoles, {
		fields: [usersToAdminRoles.adminRoleId],
		references: [adminRoles.id]
	})
}))
