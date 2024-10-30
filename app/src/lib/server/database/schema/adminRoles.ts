import { pgTable, uuid, text, timestamp, type PgTableWithColumns } from "drizzle-orm/pg-core"
import { relations, sql } from "drizzle-orm"
import { adminRolesToPermissions } from "./adminRolesToPermissions"
import { usersToAdminRoles } from "./usersToAdminRoles"

/**
 * The staff roles table.
 * Staff roles are a way to group permissions together.
 * Users can be assigned to one or more roles.
 */
export const adminRoles: PgTableWithColumns<any> & { usePermissions?: boolean } = pgTable(
	"admin_roles",
	{
		id: uuid("id")
			.primaryKey()
			.default(sql`(gen_random_uuid ())`),
		name: text("name").notNull(),
		createdAt: timestamp("created_at").notNull().defaultNow(),
		updatedAt: timestamp("updated_at").notNull().defaultNow()
	}
)

adminRoles.usePermissions = true

export const adminRoleRelations = relations(adminRoles, ({ one: One, many: Many }) => ({
	toAdminPermissions: Many(adminRolesToPermissions),
	toUsers: Many(usersToAdminRoles)
}))
