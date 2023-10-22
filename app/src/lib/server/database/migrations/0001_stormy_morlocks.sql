CREATE TABLE IF NOT EXISTS "userTokens" (
	"id" uuid PRIMARY KEY DEFAULT (gen_random_uuid ()) NOT NULL,
	"user_id" uuid NOT NULL,
	"token" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"expires_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "unique_valid_user_tokens" ON "userTokens" ("user_id","token");