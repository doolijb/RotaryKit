// // group permissions schema
// import { uuid, varchar, timestamp, pgTable, uniqueIndex } from 'drizzle-orm/pg-core'
// import { relations } from 'drizzle-orm'
// import { groups, permissions } from '.'


// export const groupPermissions = pgTable('group_permissions', {
//     id: uuid('id').primaryKey().defaultRandom(),
//     groupId: uuid('group_id').notNull(),
//     permissionId: uuid('permission_id').notNull(),
//     createdAt: timestamp('created_at').notNull().defaultNow(),
// }, (t) => ({
//     uniquePermissionsForGroup: uniqueIndex('unique_permissions_for_group').on(t.groupId, t.permissionId),
// }))


// export const groupPermissionsRelations = relations(groupPermissions, ({ one }) => ({
//     group: one(groups),
//     permission: one(permissions),
// }))