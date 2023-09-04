import { pgTable, uniqueIndex, varchar, uuid, timestamp } from 'drizzle-orm/pg-core'
import { relations } from 'drizzle-orm'
import { userEmails } from '.'

export const emails = pgTable('emails', {
    id: uuid('id').primaryKey().defaultRandom(),
    address: varchar('email', { length: 256 }).notNull(),
    verifiedAt: timestamp('verified_at'),
    createdAt: timestamp('created_at').notNull().defaultNow(),
    updatedAt: timestamp('updated_at').notNull().defaultNow(),
}, (obj) => {
    return {
        uniqueEmailIndex: uniqueIndex('unique_address').on(obj.address),

    }
})

export const emailAddressesRelations = relations(emails, ({ one: One }) => ({
    userEmail: One(userEmails),
}))