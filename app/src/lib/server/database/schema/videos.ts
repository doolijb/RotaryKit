import {
	pgTable,
	varchar,
	uuid,
	timestamp,
	bigint,
} from "drizzle-orm/pg-core"
import { relations, sql } from "drizzle-orm"
import { users } from "./users"
import {creationToGalleryItems} from './creationToGalleryItems';

export const videos = pgTable("videos", {
	id: uuid("id")
		.primaryKey()
		.default(sql`(gen_random_uuid ())`),
	title: varchar("title", { length: 100 }).notNull(),
	originalPath: varchar("original_path", { length: 512 }),
	originalBytes: bigint("original_bytes", { mode: "number" }), // Consider changing to numeric if applicable
	uploadedByUserId: uuid("uploaded_by_user_id")
		.notNull()
		.references(() => users.id, { onDelete: "set null" }),
	createdAt: timestamp("created_at").notNull().defaultNow(),
	updatedAt: timestamp("updated_at").notNull().defaultNow(),
	status: varchar("status", { length: 50 }).notNull()
})

export const videoRelations = relations(videos, ({ one }) => ({
	uploadedByUser: one(users, {
		fields: [videos.uploadedByUserId],
		references: [users.id],
		relationName: "uploadedByUser"
	}),

	toCreation: one(creationToGalleryItems, {
		fields: [videos.id],
		references: [creationToGalleryItems.videoId],
		relationName: "toCreation"
	})
}))
