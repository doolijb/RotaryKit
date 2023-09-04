CREATE TABLE IF NOT EXISTS "admin_permissions" (
	"id" uuid PRIMARY KEY DEFAULT (gen_random_uuid ()) NOT NULL,
	"method" text NOT NULL,
	"resource" text NOT NULL,
	"name" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "admin_roles" (
	"id" uuid PRIMARY KEY DEFAULT (gen_random_uuid ()) NOT NULL,
	"name" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "admin_roles_to_permissions" (
	"admin_permission_id" uuid NOT NULL,
	"admin_role_id" uuid NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "admin_roles_to_permissions_admin_permission_id_admin_role_id_pk" PRIMARY KEY("admin_permission_id","admin_role_id")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "email_logs" (
	"id" uuid PRIMARY KEY DEFAULT (gen_random_uuid ()) NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"success" boolean DEFAULT false NOT NULL,
	"type" varchar(256) NOT NULL,
	"recipient_user_id" uuid,
	"recipient_user_name" varchar(256),
	"recipient_email_id" uuid,
	"recipient_email_address" varchar(256) NOT NULL,
	"parameters" json NOT NULL,
	"html" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "emails" (
	"id" uuid PRIMARY KEY DEFAULT (gen_random_uuid ()) NOT NULL,
	"email" varchar(256) NOT NULL,
	"verified_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"user_id" uuid,
	"is_user_primary" boolean DEFAULT false NOT NULL,
	CONSTRAINT "emails_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "email_verifications" (
	"id" uuid PRIMARY KEY DEFAULT (gen_random_uuid ()) NOT NULL,
	"email_id" uuid NOT NULL,
	"expires_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"verified_at" timestamp
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "images" (
	"id" uuid PRIMARY KEY DEFAULT (gen_random_uuid ()) NOT NULL,
	"title" varchar(256) NOT NULL,
	"original_path" varchar(512),
	"original_bytes" bigint,
	"webp_path" varchar(512),
	"webp_bytes" bigint,
	"jpg_path" varchar(512),
	"jpg_bytes" bigint,
	"uploaded_by_user_id" uuid NOT NULL,
	"profile_image_user_id" uuid,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"status" varchar(256) DEFAULT 'active' NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "passphrase_resets" (
	"id" uuid PRIMARY KEY DEFAULT (gen_random_uuid ()) NOT NULL,
	"user_id" uuid NOT NULL,
	"expires_at" timestamp NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"consumed_at" timestamp
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "passphrases" (
	"id" uuid PRIMARY KEY DEFAULT (gen_random_uuid ()) NOT NULL,
	"user_id" uuid NOT NULL,
	"hash" text NOT NULL,
	"salt" varchar(512) NOT NULL,
	"iterations" numeric NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "users" (
	"id" uuid PRIMARY KEY DEFAULT (gen_random_uuid ()) NOT NULL,
	"username" varchar(256) NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"verified_at" timestamp,
	"is_admin" boolean DEFAULT false NOT NULL,
	"is_super_user" boolean DEFAULT false NOT NULL,
	"is_active" boolean DEFAULT true NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "users_to_admin_roles" (
	"user_id" uuid NOT NULL,
	"admin_role_id" uuid NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "users_to_admin_roles_user_id_admin_role_id_pk" PRIMARY KEY("user_id","admin_role_id")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "user_tokens" (
	"id" uuid PRIMARY KEY DEFAULT (gen_random_uuid ()) NOT NULL,
	"user_id" uuid,
	"token" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"expires_at" timestamp NOT NULL,
	"browser" varchar(256) NOT NULL,
	"os" varchar(256) NOT NULL
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "admin_roles_to_permissions" ADD CONSTRAINT "admin_roles_to_permissions_admin_permission_id_admin_permissions_id_fk" FOREIGN KEY ("admin_permission_id") REFERENCES "public"."admin_permissions"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "admin_roles_to_permissions" ADD CONSTRAINT "admin_roles_to_permissions_admin_role_id_admin_roles_id_fk" FOREIGN KEY ("admin_role_id") REFERENCES "public"."admin_roles"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "email_logs" ADD CONSTRAINT "email_logs_recipient_user_id_users_id_fk" FOREIGN KEY ("recipient_user_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "email_logs" ADD CONSTRAINT "email_logs_recipient_email_id_emails_id_fk" FOREIGN KEY ("recipient_email_id") REFERENCES "public"."emails"("id") ON DELETE set null ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "emails" ADD CONSTRAINT "emails_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "email_verifications" ADD CONSTRAINT "email_verifications_email_id_emails_id_fk" FOREIGN KEY ("email_id") REFERENCES "public"."emails"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "images" ADD CONSTRAINT "images_uploaded_by_user_id_users_id_fk" FOREIGN KEY ("uploaded_by_user_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "images" ADD CONSTRAINT "images_profile_image_user_id_users_id_fk" FOREIGN KEY ("profile_image_user_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "passphrase_resets" ADD CONSTRAINT "passphrase_resets_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "passphrases" ADD CONSTRAINT "passphrases_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "users_to_admin_roles" ADD CONSTRAINT "users_to_admin_roles_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "users_to_admin_roles" ADD CONSTRAINT "users_to_admin_roles_admin_role_id_admin_roles_id_fk" FOREIGN KEY ("admin_role_id") REFERENCES "public"."admin_roles"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "user_tokens" ADD CONSTRAINT "user_tokens_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "unique_action_resource" ON "admin_permissions" USING btree ("method","resource");--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "unique_user_primary" ON "emails" USING btree ("user_id","is_user_primary") WHERE "emails"."is_user_primary" = true AND "emails"."user_id" IS NOT NULL;--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "unique_user_passphrases" ON "passphrases" USING btree ("user_id");--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "unique_usernames" ON "users" USING btree ("username");