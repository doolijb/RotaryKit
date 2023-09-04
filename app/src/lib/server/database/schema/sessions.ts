import { uuid, varchar, timestamp, pgTable, uniqueIndex } from 'drizzle-orm/pg-core'
import { relations } from 'drizzle-orm'
import { users } from '.'

export const sessions = pgTable('sessions', {
    id: uuid('id').primaryKey(),
    userId: uuid('user_id').notNull().references(() => users.id),
    token: varchar('token', { length: 256 }).notNull(),
    createdAt: timestamp('created_at').notNull().defaultNow(),
    expiresAt: timestamp('expires_at').notNull(),
    invalidatedAt: timestamp('updated_at'),
}, (obj) => {
    return {
        tokenIndex: uniqueIndex('unique_tokens').on(obj.token),
    }
})

export const sessionsRelations = relations(sessions, ({ one }) => ({
    user: one(users),
}))