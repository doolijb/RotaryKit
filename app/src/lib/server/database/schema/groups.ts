// import { uuid, varchar, timestamp, pgTable, uniqueIndex } from 'drizzle-orm/pg-core'
// import { relations } from 'drizzle-orm'
// import { userGroups, groupPermissions } from '.'

// export const groups = pgTable('groups', {
//     id: uuid('id').primaryKey(),
//     name: varchar('name', { length: 256 }).notNull(),
//     createdAt: timestamp('created_at').notNull().defaultNow(),
//     updatedAt: timestamp('updated_at').notNull().defaultNow(),
// }, (t) => {
//     return {
//         nameIndex: uniqueIndex('unique_names').on(t.name),
//     }
// })

// export const groupsRelations = relations(groups, ({ many }) => ({
//     userGroups: many(userGroups),
//     groupPermissions: many(groupPermissions),
// }))