import { pgTable, uniqueIndex, varchar, uuid, timestamp, text } from "drizzle-orm/pg-core"
import { users } from "."
import { relations } from "drizzle-orm"
import { sql } from "drizzle-orm"

export const userTokens = pgTable("userTokens", {
    id: uuid("id").primaryKey().default(sql`(gen_random_uuid ())`),
    userId: uuid("user_id").notNull().references(() => users.id),
    token: text("token").notNull(),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    expiresAt: timestamp("expires_at").notNull().defaultNow(),
    browser: varchar("browser", { length: 256 }).notNull(),
    os: varchar("os", { length: 256 }).notNull(),
}, (obj) => {
    return {
        validUserTokenIndex: uniqueIndex("unique_valid_user_tokens").on(obj.userId, obj.token).where(sql`${obj.expiresAt} > now()`),
    }
})

export const usersTokenRelations = relations(userTokens, ({ many, one }) => ({
    user: one(users, {
        fields: [userTokens.userId],
        references: [users.id],
    }),
}))