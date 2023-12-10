ALTER TABLE "users_to_admin_roles" RENAME COLUMN "role_id" TO "admin_role_id";--> statement-breakpoint
ALTER TABLE "users_to_admin_roles" DROP CONSTRAINT "users_to_admin_roles_user_id_role_id_pk";--> statement-breakpoint
ALTER TABLE "users_to_admin_roles" DROP CONSTRAINT "users_to_admin_roles_role_id_admin_roles_id_fk";
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "users_to_admin_roles" ADD CONSTRAINT "users_to_admin_roles_admin_role_id_admin_roles_id_fk" FOREIGN KEY ("admin_role_id") REFERENCES "admin_roles"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
ALTER TABLE "users_to_admin_roles" ADD CONSTRAINT "users_to_admin_roles_user_id_admin_role_id_pk" PRIMARY KEY("user_id","admin_role_id");