CREATE TABLE "user_settings" (
	"user_id" text PRIMARY KEY NOT NULL,
	"theme" text DEFAULT 'dark' NOT NULL,
	"titles_in_language" boolean DEFAULT false NOT NULL,
	"private_profile" boolean DEFAULT false NOT NULL,
	"new_episode_alerts" boolean DEFAULT true NOT NULL,
	"premiere_reminders" boolean DEFAULT true NOT NULL,
	"weekly_digest" boolean DEFAULT false NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
