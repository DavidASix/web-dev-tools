CREATE TABLE
	"business_stats" (
		"id" serial PRIMARY KEY NOT NULL,
		"business_id" integer NOT NULL,
		"review_count" integer,
		"review_score" real,
		"created_at" timestamp
		with
			time zone DEFAULT now ()
	);

--> statement-breakpoint
ALTER TABLE "business_stats" ADD CONSTRAINT "business_stats_business_id_businesses_id_fk" FOREIGN KEY ("business_id") REFERENCES "public"."businesses" ("id") ON DELETE cascade ON UPDATE no action;

--> statement-breakpoint
INSERT INTO
	"business_stats" ("business_id", "review_count", "review_score")
SELECT
	"id",
	"review_count",
	"review_score"
FROM
	"businesses";

ALTER TABLE "businesses"
DROP COLUMN "review_count";

--> statement-breakpoint
ALTER TABLE "businesses"
DROP COLUMN "review_score";