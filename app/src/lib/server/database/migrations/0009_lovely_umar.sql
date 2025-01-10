ALTER TABLE "images" ALTER COLUMN "title" SET DATA TYPE varchar(100);--> statement-breakpoint
ALTER TABLE "images" ALTER COLUMN "status" SET DATA TYPE varchar(50);--> statement-breakpoint
ALTER TABLE "users" ALTER COLUMN "username" SET DATA TYPE varchar(15);--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "display_name" varchar(15);