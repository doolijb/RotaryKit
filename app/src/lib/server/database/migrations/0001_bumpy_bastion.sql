ALTER TABLE "admin_roles_to_permissions" RENAME COLUMN "user_permission_id" TO "admin_permission_id";--> statement-breakpoint
ALTER TABLE "admin_roles_to_permissions" RENAME COLUMN "staff_role_id" TO "admin_role_id";--> statement-breakpoint
ALTER TABLE "admin_roles_to_permissions" DROP CONSTRAINT "admin_roles_to_permissions_user_permission_id_staff_role_id_pk";--> statement-breakpoint
ALTER TABLE "admin_roles_to_permissions" DROP CONSTRAINT "admin_roles_to_permissions_user_permission_id_admin_permissions_id_fk";
--> statement-breakpoint
ALTER TABLE "admin_roles_to_permissions" DROP CONSTRAINT "admin_roles_to_permissions_staff_role_id_admin_roles_id_fk";
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "admin_roles_to_permissions" ADD CONSTRAINT "admin_roles_to_permissions_admin_permission_id_admin_permissions_id_fk" FOREIGN KEY ("admin_permission_id") REFERENCES "admin_permissions"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "admin_roles_to_permissions" ADD CONSTRAINT "admin_roles_to_permissions_admin_role_id_admin_roles_id_fk" FOREIGN KEY ("admin_role_id") REFERENCES "admin_roles"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
ALTER TABLE "admin_roles_to_permissions" DROP COLUMN IF EXISTS "name";--> statement-breakpoint
ALTER TABLE "admin_roles_to_permissions" ADD CONSTRAINT "admin_roles_to_permissions_admin_permission_id_admin_role_id_pk" PRIMARY KEY("admin_permission_id","admin_role_id");