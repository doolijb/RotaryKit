ALTER TABLE "images" DROP CONSTRAINT "images_profile_image_user_id_users_id_fk";
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "images" ADD CONSTRAINT "images_profile_image_user_id_users_id_fk" FOREIGN KEY ("profile_image_user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
