import {
	pgTable,
	uniqueIndex,
	varchar,
	uuid,
	timestamp,
	boolean
} from "drizzle-orm/pg-core"
import { relations } from "drizzle-orm"
import { sql } from "drizzle-orm"
import { userTokens } from "./userTokens"
import { usersToAdminRoles } from "./usersToAdminRoles"
import { passphrases } from "./passphrases"
import { emails } from "./emails"
import { images } from "./images"

export const users = pgTable(
	"users",
	{
		id: uuid("id")
			.primaryKey()
			.default(sql`(gen_random_uuid ())`),
		username: varchar("username", { length: 15 }).notNull(),
		displayName: varchar("display_name", { length: 15 }),
		createdAt: timestamp("created_at").notNull().defaultNow(),
		updatedAt: timestamp("updated_at").notNull().defaultNow(),
		verifiedAt: timestamp("verified_at"),
		isAdmin: boolean("is_admin").notNull().default(false),
		isSuperUser: boolean("is_super_user").notNull().default(false),
		isActive: boolean("is_active").notNull().default(true),
	},
	(obj) => {
		return {
			usernameIndex: uniqueIndex("unique_usernames").on(obj.username)
		}
	}
)

export const userRelations = relations(users, ({ many, one }) => ({
	// One
	passphrase: one(passphrases, {
		fields: [users.id],
		references: [passphrases.userId]
	}),

	// Many
	emails: many(emails),

	toAdminRoles: many(usersToAdminRoles),

	userTokens: many(userTokens),

	uploadedImages: many(images, {
		relationName: "uploadedImageUser"
	}),

	profileImages: many(images, {
		relationName: "profileImageUser"
	})
}))
