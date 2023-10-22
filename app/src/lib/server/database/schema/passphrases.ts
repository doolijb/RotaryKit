import { pgTable, uniqueIndex, varchar, uuid, timestamp, numeric, text } from "drizzle-orm/pg-core"
import { users } from "."
import { relations } from "drizzle-orm"
import { sql } from "drizzle-orm"

export const passphrases = pgTable("passphrases", {
    id: uuid("id").primaryKey().default(sql`(gen_random_uuid ())`),
    userId: uuid("user_id").notNull().references(() => users.id),
    hash: text("hash").notNull(),
    salt: varchar("salt", { length: 512 }).notNull(),
    iterations: numeric("iterations").notNull(),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    invalidatedAt: timestamp("updated_at"),
}, (obj) => {
    return {
        onePerUser: uniqueIndex("unique_user_passphrases").on(obj.userId),
    }
})

// export const passphrasesRelations = relations(users, ({ one }) => ({
//     user: one(users, {
//         fields: [passphrases.userId],
//         references: [users.id],
//     }),
// }))
