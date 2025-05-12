DROP INDEX "unique_action_resource";--> statement-breakpoint
DROP INDEX "unique_usernames";--> statement-breakpoint
ALTER TABLE "admin_permissions" ADD CONSTRAINT "unique_action_resource" UNIQUE("method","resource");--> statement-breakpoint
ALTER TABLE "users" ADD CONSTRAINT "users_id_username_unique" UNIQUE("id","username");