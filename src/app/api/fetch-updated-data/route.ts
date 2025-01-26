import { NextResponse } from "next/server";
import { z } from "zod";
import { getLastEvent } from "../utils";
import { updateReviews } from "../google/update-reviews";
import { updateBusinessStats } from "../google/update-business-stats";
import { fetchReviews } from "../google/fetch-reviews";
import { fetchBusinessStats } from "../google/fetch-business-stats";

const bodySchema = z.object({
  business_id: z.number(),
});

/**
 * Checks if reviews/stats need updating, updates if needed, then returns latest data
 *
 * @param { business_id: number } - The database ID of the business
 * @returns Latest reviews and stats for the business
 */
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { business_id } = bodySchema.parse(body);

    if (!business_id) {
      return NextResponse.json(
        { error: "Business ID is required" },
        { status: 400 }
      );
    }

    const oneDayAgo = new Date();
    oneDayAgo.setDate(oneDayAgo.getDate() - 1);

    // Check last update times
    const lastUpdateReviews = await getLastEvent("update_reviews", business_id);
    const lastUpdateStats = await getLastEvent("update_stats", business_id);

    // If data is out of date, fetch and update
    if (
      !lastUpdateReviews?.timestamp ||
      lastUpdateReviews.timestamp < oneDayAgo
    ) {
      await updateReviews(business_id);
    }

    if (!lastUpdateStats?.timestamp || lastUpdateStats.timestamp < oneDayAgo) {
      await updateBusinessStats(business_id);
    }

    // Get the data
    const [reviews, stats] = await Promise.all([
      fetchReviews(business_id),
      fetchBusinessStats(business_id),
    ]);

    return NextResponse.json({
      reviews,
      stats,
    });
  } catch (error) {
    console.error("Error processing request:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
