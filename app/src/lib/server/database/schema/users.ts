import { pgTable, uniqueIndex, varchar, uuid, timestamp } from "drizzle-orm/pg-core"
import { userEmails, passphrases, userTokens } from "."
import { relations } from "drizzle-orm"
import { sql } from "drizzle-orm"

export const users = pgTable("users", {
    id: uuid("id").primaryKey().default(sql`(gen_random_uuid ())`),
    username: varchar("username", { length: 256 }).notNull(),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at").notNull().defaultNow(),
}, (obj) => {
    return {
        usernameIndex: uniqueIndex("unique_usernames").on(obj.username),
    }
})

export const userRelations = relations(users, ({ many, one }) => ({
    userEmails: many(userEmails),
    passphrase: one(passphrases,{
        fields: [users.id],
        references: [passphrases.userId],
    }),
    tokens: many(userTokens),
}))