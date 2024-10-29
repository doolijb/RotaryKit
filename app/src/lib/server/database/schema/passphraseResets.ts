import { pgTable, uuid, timestamp, type PgTableWithColumns } from "drizzle-orm/pg-core"
import { relations } from "drizzle-orm"
import { sql } from "drizzle-orm"
import { users } from "./users"

export const passphraseResets: PgTableWithColumns<any> & {usePermissions?: boolean} = pgTable("passphrase_resets", {
    id: uuid("id").primaryKey().default(sql`(gen_random_uuid ())`),
    userId: uuid("user_id").notNull().references(() => users.id, { onDelete: 'cascade' }),
    expiresAt: timestamp("expires_at").notNull(),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    consumedAt: timestamp("consumed_at"),
})

passphraseResets.usePermissions = false

export const passphraseResetRelations = relations(passphraseResets, ({ one }) => ({
    user: one(users, {
        fields: [passphraseResets.userId], references: [users.id]
    }),
}))