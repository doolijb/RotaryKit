CREATE TABLE IF NOT EXISTS "emails" (
	"id" uuid PRIMARY KEY NOT NULL,
	"email" varchar(256) NOT NULL,
	"verified_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "users" (
	"id" uuid PRIMARY KEY NOT NULL,
	"username" varchar(256) NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "user_emails" (
	"user_id" uuid NOT NULL,
	"email_id" uuid NOT NULL,
	"is_primary" boolean DEFAULT false NOT NULL
);
--> statement-breakpoint
ALTER TABLE "user_emails" ADD CONSTRAINT "user_emails_user_id_email_id" PRIMARY KEY("user_id","email_id");
--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "unique_address" ON "emails" ("email");--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "unique_usernames" ON "users" ("username");--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "one_user_per_email" ON "user_emails" ("email_id");--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "one_primary_per_user" ON "user_emails" ("user_id");--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "user_emails" ADD CONSTRAINT "user_emails_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "user_emails" ADD CONSTRAINT "user_emails_email_id_emails_id_fk" FOREIGN KEY ("email_id") REFERENCES "emails"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
