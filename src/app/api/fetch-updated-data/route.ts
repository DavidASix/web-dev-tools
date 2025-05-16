import { NextResponse } from "next/server";

import schema from "./schema";
import { NextRouteContext, RequestHandler } from "@/middleware/types";
import { withBody } from "@/middleware/withBody";
import { withApiKey } from "@/middleware/withApiKey";

import { getLastEvent } from "@/lib/server/events";

import { updateReviews } from "../google/update-reviews";
import { updateBusinessStats } from "../google/update-business-stats";
import { fetchReviews } from "../google/fetch-reviews";
import { fetchBusinessStats } from "../google/fetch-business-stats";

/**
 * Checks if reviews/stats need updating, updates if needed, then returns latest data. This endpoint is called by 11ty in the clients
 * website to ensure that their google reviews are updated any time the clients site is rebuilt.
 *
 * @param { business_id: number } - The database ID of the business
 * @returns Latest reviews and stats for the business
 */
export const POST: RequestHandler<NextRouteContext> = withApiKey(
  withBody(schema, async (_, context) => {
    try {
      const { business_id } = context.body;

      const oneDayAgo = new Date();
      oneDayAgo.setDate(oneDayAgo.getDate() - 1);

      // Check last update times
      const lastUpdateReviews = await getLastEvent(
        "update_reviews",
        business_id,
      );
      const lastUpdateStats = await getLastEvent("update_stats", business_id);

      // If data is out of date, fetch and update
      if (
        !lastUpdateReviews?.timestamp ||
        lastUpdateReviews.timestamp < oneDayAgo
      ) {
        await updateReviews(business_id);
      }

      if (
        !lastUpdateStats?.timestamp ||
        lastUpdateStats.timestamp < oneDayAgo
      ) {
        await updateBusinessStats(business_id);
      }

      // Get the data
      const [reviews, stats] = await Promise.all([
        fetchReviews(business_id),
        fetchBusinessStats(business_id),
      ]);

      const response = schema.response.parse({
        reviews,
        stats,
      });
      return NextResponse.json(response);
    } catch (error) {
      console.error("Error processing request:", error);
      return NextResponse.json(
        { error: "Internal Server Error" },
        { status: 500 },
      );
    }
  }),
);
