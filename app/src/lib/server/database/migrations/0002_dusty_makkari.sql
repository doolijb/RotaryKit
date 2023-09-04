ALTER TABLE "images" ADD COLUMN "mid_webp_path" varchar(512);--> statement-breakpoint
ALTER TABLE "images" ADD COLUMN "mid_jpg_path" varchar(512);--> statement-breakpoint
ALTER TABLE "images" ADD COLUMN "mid_webp_bytes" bigint;--> statement-breakpoint
ALTER TABLE "images" ADD COLUMN "mid_jpg_bytes" bigint;--> statement-breakpoint
ALTER TABLE "images" ADD COLUMN "thumb_webp_bytes" bigint;--> statement-breakpoint
ALTER TABLE "images" ADD COLUMN "thumb_jpg_bytes" bigint;