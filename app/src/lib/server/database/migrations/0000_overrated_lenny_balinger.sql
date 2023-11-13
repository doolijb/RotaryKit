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
CREATE TABLE IF NOT EXISTS "staff_permissions" (
	"id" uuid PRIMARY KEY DEFAULT (gen_random_uuid ()) NOT NULL,
	"method" text NOT NULL,
	"resource" text NOT NULL,
	"name" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "staff_roles" (
	"id" uuid PRIMARY KEY DEFAULT (gen_random_uuid ()) NOT NULL,
	"name" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "staff_roles_to_permissions" (
	"name" text NOT NULL,
	"user_permission_id" uuid NOT NULL,
	"staff_role_id" uuid NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT staff_roles_to_permissions_user_permission_id_staff_role_id PRIMARY KEY("user_permission_id","staff_role_id")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "users" (
	"id" uuid PRIMARY KEY DEFAULT (gen_random_uuid ()) NOT NULL,
	"username" varchar(256) NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"verified_at" timestamp,
	"is_staff" boolean DEFAULT false NOT NULL,
	"is_super_user" boolean DEFAULT false NOT NULL,
	"is_active" boolean DEFAULT true NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "users_to_staff_roles" (
	"user_id" uuid NOT NULL,
	"role_id" uuid NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT users_to_staff_roles_user_id_role_id PRIMARY KEY("user_id","role_id")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "user_tokens" (
	"id" uuid PRIMARY KEY DEFAULT (gen_random_uuid ()) NOT NULL,
	"user_id" uuid,
	"token" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"expires_at" timestamp DEFAULT now() NOT NULL,
	"browser" varchar(256) NOT NULL,
	"os" varchar(256) NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "unique_user_primary" ON "emails" ("user_id","is_user_primary");--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "unique_user_passphrases" ON "passphrases" ("user_id");--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "unique_usernames" ON "users" ("username");--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "unique_valid_user_tokens" ON "user_tokens" ("user_id","token");--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "emails" ADD CONSTRAINT "emails_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE set null ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "email_verifications" ADD CONSTRAINT "email_verifications_email_id_emails_id_fk" FOREIGN KEY ("email_id") REFERENCES "emails"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "passphrase_resets" ADD CONSTRAINT "passphrase_resets_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "passphrases" ADD CONSTRAINT "passphrases_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "staff_roles_to_permissions" ADD CONSTRAINT "staff_roles_to_permissions_user_permission_id_staff_permissions_id_fk" FOREIGN KEY ("user_permission_id") REFERENCES "staff_permissions"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "staff_roles_to_permissions" ADD CONSTRAINT "staff_roles_to_permissions_staff_role_id_staff_roles_id_fk" FOREIGN KEY ("staff_role_id") REFERENCES "staff_roles"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "users_to_staff_roles" ADD CONSTRAINT "users_to_staff_roles_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "users_to_staff_roles" ADD CONSTRAINT "users_to_staff_roles_role_id_staff_roles_id_fk" FOREIGN KEY ("role_id") REFERENCES "staff_roles"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "user_tokens" ADD CONSTRAINT "user_tokens_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE set null ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
