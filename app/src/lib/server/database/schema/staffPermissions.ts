import { pgTable, uuid, text, uniqueIndex } from "drizzle-orm/pg-core"
import { relations, sql } from "drizzle-orm"
import { staffRolesToPermissions } from "./staffRolesToPermissions"

export const staffPermissions = pgTable("staff_permissions", {
        id: uuid("id").primaryKey().default(sql`(gen_random_uuid ())`),
        action: text("method").notNull(),
        resource: text("resource").notNull(),
        name: text("name").notNull(),
    }, (t) => ({
        unqActionResource: uniqueIndex("unique_action_resource").on(t.action, t.resource),
    })
)

export const staffPermissionRelations = relations(staffPermissions, ({ one: One, many: Many }) => ({
        toStaffRoles: Many(staffRolesToPermissions),
    })
)