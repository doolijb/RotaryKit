import { relations } from "drizzle-orm/relations"
import {
	users,
	emailLogs,
	emails,
	emailVerifications,
	passphraseResets,
	passphrases,
	userTokens,
	images,
	usersToAdminRoles,
	adminRoles,
	adminRolesToPermissions
} from "./schema"

export const emailLogsRelations = relations(emailLogs, ({ one }) => ({
	user: one(users, {
		fields: [emailLogs.recipientUserId],
		references: [users.id]
	}),
	email: one(emails, {
		fields: [emailLogs.recipientEmailId],
		references: [emails.id]
	})
}))

export const usersRelations = relations(users, ({ many }) => ({
	emailLogs: many(emailLogs),
	emails: many(emails),
	passphraseResets: many(passphraseResets),
	passphrases: many(passphrases),
	userTokens: many(userTokens),
	images_uploadedByUserId: many(images, {
		relationName: "images_uploadedByUserId_users_id"
	}),
	images_profileImageUserId: many(images, {
		relationName: "images_profileImageUserId_users_id"
	}),
	usersToAdminRoles: many(usersToAdminRoles)
}))

export const emailsRelations = relations(emails, ({ one, many }) => ({
	emailLogs: many(emailLogs),
	user: one(users, {
		fields: [emails.userId],
		references: [users.id]
	}),
	emailVerifications: many(emailVerifications)
}))

export const emailVerificationsRelations = relations(emailVerifications, ({ one }) => ({
	email: one(emails, {
		fields: [emailVerifications.emailId],
		references: [emails.id]
	})
}))

export const passphraseResetsRelations = relations(passphraseResets, ({ one }) => ({
	user: one(users, {
		fields: [passphraseResets.userId],
		references: [users.id]
	})
}))

export const passphrasesRelations = relations(passphrases, ({ one }) => ({
	user: one(users, {
		fields: [passphrases.userId],
		references: [users.id]
	})
}))

export const userTokensRelations = relations(userTokens, ({ one }) => ({
	user: one(users, {
		fields: [userTokens.userId],
		references: [users.id]
	})
}))

export const imagesRelations = relations(images, ({ one }) => ({
	user_uploadedByUserId: one(users, {
		fields: [images.uploadedByUserId],
		references: [users.id],
		relationName: "images_uploadedByUserId_users_id"
	}),
	user_profileImageUserId: one(users, {
		fields: [images.profileImageUserId],
		references: [users.id],
		relationName: "images_profileImageUserId_users_id"
	})
}))

export const usersToAdminRolesRelations = relations(usersToAdminRoles, ({ one }) => ({
	user: one(users, {
		fields: [usersToAdminRoles.userId],
		references: [users.id]
	}),
	adminRole: one(adminRoles, {
		fields: [usersToAdminRoles.adminRoleId],
		references: [adminRoles.id]
	})
}))

export const adminRolesRelations = relations(adminRoles, ({ many }) => ({
	usersToAdminRoles: many(usersToAdminRoles),
	adminRolesToPermissions: many(adminRolesToPermissions)
}))

export const adminRolesToPermissionsRelations = relations(adminRolesToPermissions, ({ one }) => ({
	adminRole: one(adminRoles, {
		fields: [adminRolesToPermissions.adminRoleId],
		references: [adminRoles.id]
	})
}))
