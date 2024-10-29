import { pgTable, uuid, text, uniqueIndex, type PgTableWithColumns } from "drizzle-orm/pg-core"
import { relations, sql } from "drizzle-orm"
import { adminRolesToPermissions } from "./adminRolesToPermissions"

export const adminPermissions: PgTableWithColumns<any> & {usePermissions?: boolean} = pgTable("admin_permissions", {
        id: uuid("id").primaryKey().default(sql`(gen_random_uuid ())`),
        action: text("method").notNull(),
        resource: text("resource").notNull(),
        name: text("name").notNull(),
    }, (t) => ({
        unqActionResource: uniqueIndex("unique_action_resource").on(t.action, t.resource),
    })
)

adminPermissions.usePermissions = false

export const adminPermissionRelations = relations(adminPermissions, ({ one: One, many: Many }) => ({
        toAdminRoles: Many(adminRolesToPermissions),
    })
)