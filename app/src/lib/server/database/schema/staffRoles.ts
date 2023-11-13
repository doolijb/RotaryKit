import { pgTable, uuid, text, timestamp } from "drizzle-orm/pg-core"
import { relations,  sql, } from "drizzle-orm"
import { staffRolesToPermissions } from "./staffRolesToPermissions"

/**
 * The staff roles table.
 * Staff roles are a way to group permissions together.
 * Users can be assigned to one or more roles.
 */
export const staffRoles = pgTable("staff_roles", {
        id: uuid("id").primaryKey().default(sql`(gen_random_uuid ())`),
        name: text("name").notNull(),
        createdAt: timestamp("created_at").notNull().defaultNow(),
        updatedAt: timestamp("updated_at").notNull().defaultNow(),
    }
)

export const staffRoleRelations = relations(staffRoles, ({ one: One, many: Many }) => ({
        toStaffPermissions: Many(staffRolesToPermissions),
        toUsers: Many(staffRolesToPermissions),
    })
)