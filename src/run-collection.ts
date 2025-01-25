import { eq } from "drizzle-orm";
import GoogleReviews from "./google-reviews";
import { businesses, reviews } from "./schema/crud";
import { db } from "./schema/db";
import { z } from "zod";

/**
 * This function fetches the reviews stats for a business from Google and stores
 * them in the database; creating a record for the business if it doesn't exists.
 *
 * @param googleReviews - An instance of the GoogleReviews class
 * @returns { id: number, newReviewCount: number } - The id of the business record
 *    and the number of new reviews since last fetch
 */
async function storeStats(
  googleReviews: GoogleReviews
): Promise<{ id: number; newReviewCount: number }> {
  try {
    const { businessId } = googleReviews;
    let id: number;

    console.log("Fetching stats for business:", businessId);
    const info = await googleReviews.getStats();

    console.log("Checking if business exists in database...");
    const existingBusiness = await db
      .select({
        id: businesses.table.id,
        review_count: businesses.table.review_count,
      })
      .from(businesses.table)
      .where(eq(businesses.table.place_id, businessId))
      .then((rows) => rows[0]);
    id = existingBusiness?.id;

    if (!id) {
      console.log("Creating new business record...");
      const insertedBusiness = await db
        .insert(businesses.table)
        .values({
          business_name: info.name,
          place_id: businessId,
        })
        .returning({ id: businesses.table.id })
        .then((rows) => rows[0]);
      id = insertedBusiness?.id;
    }
    if (!id) {
      throw new Error("Failed to find or create business record");
    }

    console.log("Setting review count and score");
    await db
      .update(businesses.table)
      .set({
        review_count: info.review_count,
        review_score: info.rating,
      })
      .where(eq(businesses.table.place_id, businessId));

    const newReviewCount =
      info.review_count - (existingBusiness?.review_count ?? 0);

    return { id, newReviewCount };
  } catch (error) {
    console.error(error);
    throw error;
  }
}

/**
 * This function fetches the recent reviews for a business from Google and stores
 * them in the database.
 *
 * @param googleReviews - An instance of the GoogleReviews class
 * @param newReviewCount - The number of new reviews to fetch
 * @param id - The id of the business record in the database
 */
async function storeReviews({
  googleReviews,
  newReviewCount,
  id,
}: {
  googleReviews: GoogleReviews;
  newReviewCount: number;
  id: number;
}): Promise<void> {
  try {
    console.log(`Fetching ${newReviewCount} new reviews...`);
    const fetchedReviews = await googleReviews.getRecent(newReviewCount);
    console.log(`Fetched ${fetchedReviews.length} new reviews`);

    console.log("Storing reviews in database...");
    const insertableReviews: z.infer<typeof reviews.insert>[] =
      fetchedReviews.map(
        (review): z.infer<typeof reviews.insert> => ({
          business_id: id,
          lookup_id: review.review_id,
          author_name: review.author_name,
          author_image: review.author_photo_url,
          datetime: new Date(review.review_datetime_utc),
          link: review.review_link,
          rating: review.rating,
          comments: review.review_text,
        })
      );

    await db.insert(reviews.table).values(insertableReviews);
  } catch (error) {
    console.error(error);
    throw error;
  }
}

async function main() {
  console.log("Fetching Google reviews...");
  const businessId = process.env.BUSINESS_ID ?? "";
  const googleReviews = new GoogleReviews(businessId);
  try {
    const details = await storeStats(googleReviews);
    console.log({ details });
    if (details.newReviewCount > 0) {
      await storeReviews({ googleReviews, ...details });
    }
  } catch (error) {
    console.error(error);
  }
}

main()
  .then(() => process.exit(0))
  .catch(() => process.exit(1));
