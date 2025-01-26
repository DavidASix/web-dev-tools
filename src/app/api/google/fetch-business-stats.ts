import { db } from "@/schema/db";
import { businessStats } from "@/schema/crud";
import { desc, eq } from "drizzle-orm";
import { recordEvent } from "../utils";

/**
 * Fetch the latest business stats for a given business ID
 * @param { business_id: number } - The database ID of the business to fetch stats for
 * @returns { review_count: number, review_score: number } - The latest stats for the given business
 */
export async function fetchBusinessStats(business_id: number): Promise<{
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
