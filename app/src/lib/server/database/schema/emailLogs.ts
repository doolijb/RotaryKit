import { pgTable, varchar, uuid, timestamp, boolean, json, text } from "drizzle-orm/pg-core"
import { sql } from "drizzle-orm"
import { emails } from "./emails"
import { users } from "./users"

export const emailLogs = pgTable("email_logs", {
    id: uuid("id").primaryKey().default(sql`(gen_random_uuid ())`),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at").notNull().defaultNow(),
    success: boolean("success").notNull().default(false),
    type: varchar("type", { length: 256 }).notNull(),
    recipientUserId: uuid("recipient_user_id").references(() => users.id, { onDelete: "set null" }),
    recipientUserName: varchar("recipient_user_name", { length: 256 }),
    recipientEmailId: uuid("recipient_email_id").references(() => emails.id, { onDelete: "set null" }),
    recipientEmailAddress: varchar("recipient_email_address", { length: 256 }).notNull(),
    parameters: json("parameters").notNull(),
    html: text("html").notNull(),
})