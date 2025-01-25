CREATE TABLE "businesses" (
	"id" serial PRIMARY KEY NOT NULL,
	"business_name" text,
	"review_count" integer,
	"review_score" real,
	"place_id" varchar(256)
);
--> statement-breakpoint
CREATE TABLE "reviews" (
	"id" serial PRIMARY KEY NOT NULL,
	"business_id" integer NOT NULL,
	"lookup_id" text,
	"author_name" text,
	"author_image" text,
	"datetime" timestamp,
	"link" text,
	"rating" integer,
	"comments" text,
	"created_at" timestamp with time zone DEFAULT now()
);
--> statement-breakpoint
ALTER TABLE "reviews" ADD CONSTRAINT "reviews_business_id_businesses_id_fk" FOREIGN KEY ("business_id") REFERENCES "public"."businesses"("id") ON DELETE cascade ON UPDATE no action;