import { db } from "@/schema/db";
import { businessStats } from "@/schema/crud";
import { desc, eq } from "drizzle-orm";
import { recordEvent } from "@/lib/server/events";
import { reviews } from "@/schema/crud";

/**
 * Fetch the latest business stats for a given business ID
 * @param { business_id: number } - The database ID of the business to fetch stats for
 * @returns { review_count: number, review_score: number } - The latest stats for the given business
 */
export async function selectBusinessStats(business_id: number): Promise<{
  review_count: number | null;
  review_score: number | null;
}> {
  const latestStats = await db
    .select({
      review_count: businessStats.table.review_count,
      review_score: businessStats.table.review_score,
    })
    .from(businessStats.table)
    .where(eq(businessStats.table.business_id, business_id))
    .orderBy(desc(businessStats.table.created_at))
    .limit(1)
    .then((rows) => rows[0]);

  await recordEvent("fetch_stats", business_id);
  return latestStats;
}

/**
 * Fetch the reviews for a given business
 * @param { business_id: number } - The database ID of the business to fetch reviews for
 * @returns { reviews: Review[] } - The reviews for the given business
 */
export async function selectBusinessReviews(business_id: number): Promise<
  {
    author_name: string | null;
    author_image: string | null;
    datetime: Date | null;
    link: string | null;
    rating: number | null;
    comments: string | null;
  }[]
> {
  const businessReviews = await db
    .select({
      author_name: reviews.table.author_name,
      author_image: reviews.table.author_image,
      datetime: reviews.table.datetime,
      link: reviews.table.link,
      rating: reviews.table.rating,
      comments: reviews.table.comments,
    })
    .from(reviews.table)
    .where(eq(reviews.table.business_id, business_id))
    .orderBy(desc(reviews.table.datetime))
    .limit(30);

  await recordEvent("fetch_reviews", business_id);
  return businessReviews;
}
