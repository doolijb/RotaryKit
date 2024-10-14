import { pgTable, uniqueIndex, uuid, text, timestamp, varchar, boolean, foreignKey, json, unique, numeric, primaryKey } from "drizzle-orm/pg-core"
  import { sql } from "drizzle-orm"




export const adminPermissions = pgTable("admin_permissions", {
	id: uuid("id").defaultRandom().primaryKey().notNull(),
	method: text("method").notNull(),
	resource: text("resource").notNull(),
	name: text("name").notNull(),
},
(table) => {
	return {
		uniqueActionResource: uniqueIndex("unique_action_resource").using("btree", table.method.asc().nullsLast(), table.resource.asc().nullsLast()),
	}
});

export const adminRoles = pgTable("admin_roles", {
	id: uuid("id").defaultRandom().primaryKey().notNull(),
	name: text("name").notNull(),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow().notNull(),
	updatedAt: timestamp("updated_at", { mode: 'string' }).defaultNow().notNull(),
});

export const users = pgTable("users", {
	id: uuid("id").defaultRandom().primaryKey().notNull(),
	username: varchar("username", { length: 256 }).notNull(),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow().notNull(),
	updatedAt: timestamp("updated_at", { mode: 'string' }).defaultNow().notNull(),
	verifiedAt: timestamp("verified_at", { mode: 'string' }),
	isAdmin: boolean("is_admin").default(false).notNull(),
	isSuperUser: boolean("is_super_user").default(false).notNull(),
	isActive: boolean("is_active").default(true).notNull(),
},
(table) => {
	return {
		uniqueUsernames: uniqueIndex("unique_usernames").using("btree", table.username.asc().nullsLast()),
	}
});

export const emailLogs = pgTable("email_logs", {
	id: uuid("id").defaultRandom().primaryKey().notNull(),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow().notNull(),
	updatedAt: timestamp("updated_at", { mode: 'string' }).defaultNow().notNull(),
	success: boolean("success").default(false).notNull(),
	type: varchar("type", { length: 256 }).notNull(),
	recipientUserId: uuid("recipient_user_id"),
	recipientUserName: varchar("recipient_user_name", { length: 256 }),
	recipientEmailId: uuid("recipient_email_id"),
	recipientEmailAddress: varchar("recipient_email_address", { length: 256 }).notNull(),
	parameters: json("parameters").notNull(),
	html: text("html").notNull(),
},
(table) => {
	return {
		emailLogsRecipientUserIdUsersIdFk: foreignKey({
			columns: [table.recipientUserId],
			foreignColumns: [users.id],
			name: "email_logs_recipient_user_id_users_id_fk"
		}).onDelete("set null"),
		emailLogsRecipientEmailIdEmailsIdFk: foreignKey({
			columns: [table.recipientEmailId],
			foreignColumns: [emails.id],
			name: "email_logs_recipient_email_id_emails_id_fk"
		}).onDelete("set null"),
	}
});

export const emails = pgTable("emails", {
	id: uuid("id").defaultRandom().primaryKey().notNull(),
	email: varchar("email", { length: 256 }).notNull(),
	verifiedAt: timestamp("verified_at", { mode: 'string' }),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow().notNull(),
	updatedAt: timestamp("updated_at", { mode: 'string' }).defaultNow().notNull(),
	userId: uuid("user_id"),
	isUserPrimary: boolean("is_user_primary").default(false).notNull(),
},
(table) => {
	return {
		uniqueUserPrimary: uniqueIndex("unique_user_primary").using("btree", table.userId.asc().nullsLast(), table.isUserPrimary.asc().nullsLast()).where(sql`((is_user_primary = true) AND (user_id IS NOT NULL))`),
		emailsUserIdUsersIdFk: foreignKey({
			columns: [table.userId],
			foreignColumns: [users.id],
			name: "emails_user_id_users_id_fk"
		}).onDelete("set null"),
		emailsEmailUnique: unique("emails_email_unique").on(table.email),
	}
});

export const emailVerifications = pgTable("email_verifications", {
	id: uuid("id").defaultRandom().primaryKey().notNull(),
	emailId: uuid("email_id").notNull(),
	expiresAt: timestamp("expires_at", { mode: 'string' }),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow().notNull(),
	verifiedAt: timestamp("verified_at", { mode: 'string' }),
},
(table) => {
	return {
		emailVerificationsEmailIdEmailsIdFk: foreignKey({
			columns: [table.emailId],
			foreignColumns: [emails.id],
			name: "email_verifications_email_id_emails_id_fk"
		}).onDelete("cascade"),
	}
});

export const passphraseResets = pgTable("passphrase_resets", {
	id: uuid("id").defaultRandom().primaryKey().notNull(),
	userId: uuid("user_id").notNull(),
	expiresAt: timestamp("expires_at", { mode: 'string' }).notNull(),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow().notNull(),
	consumedAt: timestamp("consumed_at", { mode: 'string' }),
},
(table) => {
	return {
		passphraseResetsUserIdUsersIdFk: foreignKey({
			columns: [table.userId],
			foreignColumns: [users.id],
			name: "passphrase_resets_user_id_users_id_fk"
		}).onDelete("cascade"),
	}
});

export const passphrases = pgTable("passphrases", {
	id: uuid("id").defaultRandom().primaryKey().notNull(),
	userId: uuid("user_id").notNull(),
	hash: text("hash").notNull(),
	salt: varchar("salt", { length: 512 }).notNull(),
	iterations: numeric("iterations").notNull(),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow().notNull(),
	updatedAt: timestamp("updated_at", { mode: 'string' }),
},
(table) => {
	return {
		uniqueUserPassphrases: uniqueIndex("unique_user_passphrases").using("btree", table.userId.asc().nullsLast()),
		passphrasesUserIdUsersIdFk: foreignKey({
			columns: [table.userId],
			foreignColumns: [users.id],
			name: "passphrases_user_id_users_id_fk"
		}).onDelete("cascade"),
	}
});

export const userTokens = pgTable("user_tokens", {
	id: uuid("id").defaultRandom().primaryKey().notNull(),
	userId: uuid("user_id"),
	token: text("token").notNull(),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow().notNull(),
	expiresAt: timestamp("expires_at", { mode: 'string' }).notNull(),
	browser: varchar("browser", { length: 256 }).notNull(),
	os: varchar("os", { length: 256 }).notNull(),
},
(table) => {
	return {
		userTokensUserIdUsersIdFk: foreignKey({
			columns: [table.userId],
			foreignColumns: [users.id],
			name: "user_tokens_user_id_users_id_fk"
		}).onDelete("set null"),
	}
});

export const images = pgTable("images", {
	id: uuid("id").defaultRandom().primaryKey().notNull(),
	originalPath: varchar("original_path", { length: 512 }),
	originalBytes: varchar("original_bytes", { length: 256 }),
	webpPath: varchar("webp_path", { length: 512 }),
	webpBytes: varchar("webp_bytes", { length: 256 }),
	jpgPath: varchar("jpg_path", { length: 512 }),
	jpgBytes: varchar("jpg_bytes", { length: 256 }),
	uploadedByUserId: uuid("uploaded_by_user_id").notNull(),
	profileImageUserId: uuid("profile_image_user_id"),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow().notNull(),
	updatedAt: timestamp("updated_at", { mode: 'string' }).defaultNow().notNull(),
	status: varchar("status", { length: 256 }).default('active').notNull(),
},
(table) => {
	return {
		imagesUploadedByUserIdUsersIdFk: foreignKey({
			columns: [table.uploadedByUserId],
			foreignColumns: [users.id],
			name: "images_uploaded_by_user_id_users_id_fk"
		}).onDelete("set null"),
		imagesProfileImageUserIdUsersIdFk: foreignKey({
			columns: [table.profileImageUserId],
			foreignColumns: [users.id],
			name: "images_profile_image_user_id_users_id_fk"
		}).onDelete("set null"),
	}
});

export const usersToAdminRoles = pgTable("users_to_admin_roles", {
	userId: uuid("user_id").notNull(),
	adminRoleId: uuid("admin_role_id").notNull(),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow().notNull(),
},
(table) => {
	return {
		usersToAdminRolesUserIdUsersIdFk: foreignKey({
			columns: [table.userId],
			foreignColumns: [users.id],
			name: "users_to_admin_roles_user_id_users_id_fk"
		}).onDelete("cascade"),
		usersToAdminRolesAdminRoleIdAdminRolesIdFk: foreignKey({
			columns: [table.adminRoleId],
			foreignColumns: [adminRoles.id],
			name: "users_to_admin_roles_admin_role_id_admin_roles_id_fk"
		}).onDelete("cascade"),
		usersToAdminRolesUserIdAdminRoleIdPk: primaryKey({ columns: [table.userId, table.adminRoleId], name: "users_to_admin_roles_user_id_admin_role_id_pk"}),
	}
});

export const adminRolesToPermissions = pgTable("admin_roles_to_permissions", {
	adminPermissionId: uuid("admin_permission_id").notNull(),
	adminRoleId: uuid("admin_role_id").notNull(),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow().notNull(),
	updatedAt: timestamp("updated_at", { mode: 'string' }).defaultNow().notNull(),
},
(table) => {
	return {
		adminRolesToPermissionsAdminRoleIdAdminRolesIdFk: foreignKey({
			columns: [table.adminRoleId],
			foreignColumns: [adminRoles.id],
			name: "admin_roles_to_permissions_admin_role_id_admin_roles_id_fk"
		}).onDelete("cascade"),
		adminRolesToPermissionsAdminPermissionIdAdminRoleIdPk: primaryKey({ columns: [table.adminPermissionId, table.adminRoleId], name: "admin_roles_to_permissions_admin_permission_id_admin_role_id_pk"}),
	}
});