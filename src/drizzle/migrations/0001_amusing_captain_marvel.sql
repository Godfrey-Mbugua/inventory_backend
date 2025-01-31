CREATE TABLE IF NOT EXISTS "auth" (
	"authid" serial PRIMARY KEY NOT NULL,
	"user_id" integer,
	"password" varchar(255) NOT NULL,
	"role" "role" DEFAULT 'user',
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "auth" ADD CONSTRAINT "auth_user_id_users_userid_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("userid") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
