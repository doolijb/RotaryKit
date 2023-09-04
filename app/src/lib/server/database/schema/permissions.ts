import { uuid, varchar, timestamp, pgTable, uniqueIndex } from 'drizzle-orm/pg-core'
import { relations } from 'drizzle-orm'

export const permissions = pgTable('permissions', {
    id: uuid('id').primaryKey(),
    name: varchar('name', { length: 256 }).notNull(),
    code: varchar('code', { length: 256 }).notNull(),
})

export const permissionsRelations = relations(permissions, ({ many }) => ({
    // groupPermissions
}))