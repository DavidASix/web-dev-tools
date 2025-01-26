import { reviews, businesses } from "@/schema/crud";
import { db } from "@/schema/db";
import { eq, inArray } from "drizzle-orm";
import { recordEvent } from "../utils";
import GoogleReviews from "@/google-reviews";
import { z } from "zod";

export async function updateReviews(business_id: number) {
  const business = await db
    .select()
    .from(businesses.table)
    .where(eq(businesses.table.id, business_id))
    .then((rows) => rows[0]);

  if (!business) throw new Error("Business not found");

  const placeId = business.place_id;
  if (!placeId) throw new Error("Place ID not found");

  // Get the google business class
  const googleReviews = new GoogleReviews(placeId);
  const recentReviews = await googleReviews.getRecent();

  // Get the existing reviews for the business which appear in the recentReviews array
  const existingReviews = await db
    .select()
    .from(reviews.table)
    .where(
      inArray(
        reviews.table.lookup_id,
        recentReviews.map((r) => r.review_id)
      )
    );

  // Format table and remove any existing reviews from the insertable rows1
  const insertableReviews: z.infer<typeof reviews.insert>[] = recentReviews
    .map(
      (review): z.infer<typeof reviews.insert> => ({
        business_id: business_id,
        lookup_id: review.review_id,
        author_name: review.author_name,
        author_image: review.author_photo_url,
        datetime: new Date(review.review_datetime_utc),
        link: review.review_link,
        rating: review.rating,
        comments: review.review_text,
      })
    )
    .filter(
      (review) => !existingReviews.some((r) => r.lookup_id === review.lookup_id)
    );

  console.log(`Inserting ${insertableReviews.length} new reviews`);
  if (insertableReviews.length > 0) {
    await db.insert(reviews.table).values(insertableReviews);
  }

  await recordEvent("update_reviews", business_id);
}
