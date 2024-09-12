import { pgTable, uniqueIndex, varchar, uuid, timestamp, unique, boolean } from "drizzle-orm/pg-core"
import { relations } from "drizzle-orm"
import { sql } from "drizzle-orm"
import { users } from "./users"

export const emails = pgTable("emails", {
    id: uuid("id").primaryKey().default(sql`(gen_random_uuid ())`),
    address: varchar("email", { length: 256 }).notNull(),
    verifiedAt: timestamp("verified_at"),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at").notNull().defaultNow(),
    userId: uuid("user_id").references(() => users.id, { onDelete: "set null" }),
    isUserPrimary: boolean("is_user_primary").notNull().default(false),
}, (t) => ({
    unqAddress: unique().on(t.address),
    unqUserPrimary: uniqueIndex("unique_user_primary").on(t.userId, t.isUserPrimary).where(sql`${t.isUserPrimary} = true AND ${t.userId} IS NOT NULL`),
}))

export const emailRelations = relations(emails, ({ one: One }) => ({
    user: One(users, {
        fields: [emails.userId],
        references: [users.id],
    }),
}))