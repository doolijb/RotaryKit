import { pgTable, boolean, primaryKey, uuid, uniqueIndex } from 'drizzle-orm/pg-core'
import { relations, eq } from 'drizzle-orm'
import { emails, users } from '.'

export const userEmails = pgTable('user_emails', {
    userId: uuid('user_id').notNull().references(() => users.id),
    emailId: uuid('email_id').notNull().references(() => emails.id),
    isPrimary: boolean('is_primary').default(false).notNull(),
}, (t) => ({
    pk: primaryKey(t.userId, t.emailId),
    // User can have many emails, but each email can only belong to one user
    oneUserPerEmailIndex: uniqueIndex('one_user_per_email').on(t.emailId),
    onePrimaryPerUserIndex: uniqueIndex('one_primary_per_user').on(t.userId).where(eq(t.isPrimary, true))
}),
)

export const userEmailsRelations = relations(userEmails, ({ one }) => ({
    user: one(users, {
        fields: [userEmails.userId], references: [users.id]
    }),
    email: one(emails, {
        fields: [userEmails.emailId], references: [emails.id]
    }),
}))