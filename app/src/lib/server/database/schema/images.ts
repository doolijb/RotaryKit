import {
	pgTable,
	varchar,
	uuid,
	timestamp,
	bigint
} from "drizzle-orm/pg-core"
import { relations, sql } from "drizzle-orm"
import { users } from "./users"

export const images = pgTable("images", {
	id: uuid("id")
		.primaryKey()
		.default(sql`(gen_random_uuid ())`),
	title: varchar("title", { length: 100 }).notNull(),
	totalBytes: bigint("total_bytes", { mode: "number" }).notNull(), // Consider changing to numeric if applicable
	originalPath: varchar("original_path", { length: 512 }),
	originalBytes: bigint("original_bytes", { mode: "number" }), // Consider changing to numeric if applicable
	webpPath: varchar("webp_path", { length: 512 }),
	webpBytes: bigint("webp_bytes", { mode: "number" }), // Consider changing to numeric if applicable
	jpgPath: varchar("jpg_path", { length: 512 }),
	jpgBytes: bigint("jpg_bytes", { mode: "number" }), // Consider changing to numeric if applicable
	mediumWebpPath: varchar("medium_webp_path", { length: 512 }),
	mediumJpgPath: varchar("medium_jpg_path", { length: 512 }),
	mediumWebpBytes: bigint("medium_webp_bytes", { mode: "number" }), // Consider changing to numeric if applicable
	mediumJpgBytes: bigint("medium_jpg_bytes", { mode: "number" }), // Consider changing to numeric if applicable
	smallWebpPath: varchar("small_webp_path", { length: 512 }),
	smallJpgPath: varchar("small_jpg_path", { length: 512 }),
	smallWebpBytes: bigint("small_webp_bytes", { mode: "number" }), // Consider changing to numeric if applicable
	smallJpgBytes: bigint("small_jpg_bytes", { mode: "number" }), // Consider changing to numeric if applicable
	uploadedByUserId: uuid("uploaded_by_user_id")
		.notNull()
		.references(() => users.id, { onDelete: "set null" }),
	profileImageUserId: uuid("profile_image_user_id").references(() => users.id, {
		onDelete: "cascade"
	}),
	createdAt: timestamp("created_at").notNull().defaultNow(),
	updatedAt: timestamp("updated_at").notNull().defaultNow(),
	status: varchar("status", { length: 50 }).notNull()
})

export const imageRelations = relations(images, ({ one }) => ({
	uploadedByUser: one(users, {
		fields: [images.uploadedByUserId],
		references: [users.id],
		relationName: "uploadedByUser"
	}),

	profileImageUser: one(users, {
		fields: [images.profileImageUserId],
		references: [users.id],
		relationName: "profileImageUser"
	})
}))
