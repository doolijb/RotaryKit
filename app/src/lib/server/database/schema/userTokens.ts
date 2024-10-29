import { pgTable, uniqueIndex, varchar, uuid, timestamp, text, type PgTableWithColumns } from "drizzle-orm/pg-core"
import { relations } from "drizzle-orm"
import { sql } from "drizzle-orm"
import { users } from "./users"


export const userTokens: PgTableWithColumns<any> & {usePermissions?: boolean} = pgTable("user_tokens", {
    id: uuid("id").primaryKey().default(sql`(gen_random_uuid ())`),
    userId: uuid("user_id").references(() => users.id, { onDelete: 'set null' }),
    token: text("token").notNull(),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    expiresAt: timestamp("expires_at").notNull(),
    browser: varchar("browser", { length: 256 }).notNull(),
    os: varchar("os", { length: 256 }).notNull(),
})

userTokens.usePermissions = false

export const usersTokenRelations = relations(userTokens, ({ many, one }) => ({
    user: one(users, {
        fields: [userTokens.userId],
        references: [users.id],
    }),
}))