import { db } from "@/schema/db";
import { businessStats, businesses } from "@/schema/crud";
import { eq } from "drizzle-orm";
import { recordEvent } from "../utils";
import GoogleReviews from "@/google-reviews";

/**
 * Add the current business stats to the database for the given business ID, then return the inserted stats.
 *
 * @param { business_id } - The database business ID to update.
 * @returns { business_id: number, review_count: number, review_score: number } - The inserted stats.
 */
export async function updateBusinessStats(business_id: number): Promise<{
  business_id: number;
  review_count: number | null;
  review_score: number | null;
}> {
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
  const newStats = await googleReviews.getStats();

  // Store the updated stats
  const insertedStats = await db
    .insert(businessStats.table)
    .values({
      business_id: business_id,
      review_count: newStats.review_count,
      review_score: newStats.rating,
    })
    .returning({
      business_id: businessStats.table.business_id,
      review_count: businessStats.table.review_count,
      review_score: businessStats.table.review_score,
    })
    .then((rows) => rows[0]);

  await recordEvent("update_stats", business_id);
  return insertedStats;
}
