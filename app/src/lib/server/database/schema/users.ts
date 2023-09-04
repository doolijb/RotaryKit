import { pgTable, uniqueIndex, varchar, uuid, timestamp } from 'drizzle-orm/pg-core'
import { userEmails, passphrases } from '.'
import { relations } from 'drizzle-orm'

export const users = pgTable('users', {
    id: uuid('id').primaryKey().defaultRandom(),
    username: varchar('username', { length: 256 }).notNull(),
    createdAt: timestamp('created_at').notNull().defaultNow(),
    updatedAt: timestamp('updated_at').notNull().defaultNow(),
}, (obj) => {
    return {
        usernameIndex: uniqueIndex('unique_usernames').on(obj.username),
    }
})

export const usersRelations = relations(users, ({ many, one }) => ({
    userEmails: many(userEmails),
    passphrase: one(passphrases)
}))