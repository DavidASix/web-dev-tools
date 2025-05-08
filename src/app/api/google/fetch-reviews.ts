import { db } from "@/schema/db";
import { reviews } from "@/schema/crud";
import { desc, eq } from "drizzle-orm";
import { recordEvent } from "@/lib/server/events";

/**
 * Fetch the reviews for a given business
 * @param { business_id: number } - The database ID of the business to fetch reviews for
 * @returns { reviews: Review[] } - The reviews for the given business
 */
export async function fetchReviews(business_id: number): Promise<
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
