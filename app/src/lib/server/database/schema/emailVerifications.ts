import { pgTable, uuid, timestamp } from "drizzle-orm/pg-core"
import { relations } from "drizzle-orm"
import { sql } from "drizzle-orm"
import { emails } from "./emails"

export const emailVerifications = pgTable("email_verifications", {
    id: uuid("id").primaryKey().default(sql`(gen_random_uuid ())`),
    emailId: uuid("email_id").notNull().references(() => emails.id, { onDelete: 'cascade' }),
    expiresAt: timestamp("expires_at"),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    verifiedAt: timestamp("verified_at"),
})

export const emailVerificationRelations = relations(emailVerifications, ({ one }) => ({
    email: one(emails, {
        fields: [emailVerifications.emailId], references: [emails.id]
    }),
}))