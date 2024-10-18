ALTER TABLE "images" RENAME COLUMN "mid_webp_path" TO "medium_webp_path";--> statement-breakpoint
ALTER TABLE "images" RENAME COLUMN "mid_jpg_path" TO "medium_jpg_path";--> statement-breakpoint
ALTER TABLE "images" RENAME COLUMN "mid_webp_bytes" TO "medium_webp_bytes";--> statement-breakpoint
ALTER TABLE "images" RENAME COLUMN "mid_jpg_bytes" TO "medium_jpg_bytes";--> statement-breakpoint
ALTER TABLE "images" RENAME COLUMN "thumb_webp_path" TO "small_webp_path";--> statement-breakpoint
ALTER TABLE "images" RENAME COLUMN "thumb_jpg_path" TO "small_jpg_path";--> statement-breakpoint
ALTER TABLE "images" RENAME COLUMN "thumb_webp_bytes" TO "small_webp_bytes";--> statement-breakpoint
ALTER TABLE "images" RENAME COLUMN "thumb_jpg_bytes" TO "small_jpg_bytes";