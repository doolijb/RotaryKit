import { pgTable, uniqueIndex, varchar, uuid, timestamp, numeric, text } from "drizzle-orm/pg-core"
import { sql } from "drizzle-orm"
import { users } from "./users"

export const passphrases = pgTable("passphrases", {
    id: uuid("id").primaryKey().default(sql`(gen_random_uuid ())`),
    userId: uuid("user_id").notNull().references(() => users.id, { onDelete: 'cascade' }),
    hash: text("hash").notNull(),
    salt: varchar("salt", { length: 512 }).notNull(),
    iterations: numeric("iterations").notNull(),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    invalidatedAt: timestamp("updated_at"),
}, (t) => {
    return {
        onePerUser: uniqueIndex("unique_user_passphrases").on(t.userId),
    }
})
