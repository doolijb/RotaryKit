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
DO $$ BEGIN
 ALTER TABLE "email_logs" ADD CONSTRAINT "email_logs_recipient_user_id_users_id_fk" FOREIGN KEY ("recipient_user_id") REFERENCES "users"("id") ON DELETE set null ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "email_logs" ADD CONSTRAINT "email_logs_recipient_email_id_emails_id_fk" FOREIGN KEY ("recipient_email_id") REFERENCES "emails"("id") ON DELETE set null ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
