import { pgTable, uniqueIndex, varchar, uuid, timestamp, numeric } from 'drizzle-orm/pg-core'
import { users } from '.'
import { relations } from 'drizzle-orm'

export const passphrases = pgTable('passphrases', {
    id: uuid('id').primaryKey().defaultRandom(),
    userId: uuid('user_id').notNull().references(() => users.id),
    hash: varchar('username', { length: 256 }).notNull(),
    salt: varchar('salt', { length: 256 }).notNull(),
    iterations: numeric('iterations').notNull(),
    createdAt: timestamp('created_at').notNull().defaultNow(),
    invalidatedAt: timestamp('updated_at'),
}, (obj) => {
    return {
        onePerUser: uniqueIndex('unique_user_passphrases').on(obj.userId),
    }
})

export const passphrasesRelations = relations(users, ({ one }) => ({
    user: one(users),
}))