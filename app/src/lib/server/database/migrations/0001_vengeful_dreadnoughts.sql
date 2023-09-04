CREATE TABLE IF NOT EXISTS "passphrases" (
	"id" uuid PRIMARY KEY NOT NULL,
	"username" varchar(256) NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "user_passphrases" (
	"user_id" uuid NOT NULL,
	"email_id" uuid NOT NULL,
	"is_primary" boolean DEFAULT false NOT NULL
);
--> statement-breakpoint
ALTER TABLE "user_passphrases" ADD CONSTRAINT "user_passphrases_user_id_email_id" PRIMARY KEY("user_id","email_id");
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "user_passphrases" ADD CONSTRAINT "user_passphrases_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "user_passphrases" ADD CONSTRAINT "user_passphrases_email_id_passphrases_id_fk" FOREIGN KEY ("email_id") REFERENCES "passphrases"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
