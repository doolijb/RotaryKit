import { uuid, timestamp, pgTable, uniqueIndex } from 'drizzle-orm/pg-core'
import { relations } from 'drizzle-orm'
import { users, groups } from '.'

export const userGroups = pgTable('user_groups', {
    id: uuid('id').primaryKey().defaultRandom(),
    userId: uuid('user_id').notNull(),
    groupId: uuid('group_id').notNull(),
    createdAt: timestamp('created_at').notNull().defaultNow(),
}, (t) => ({
    uniqueGroupsForUser: uniqueIndex('unique_groups_for_user').on(t.userId, t.groupId),
}))


export const userGroupsRelations = relations(userGroups, ({ one }) => ({
    user: one(users),
    group: one(groups),
}))