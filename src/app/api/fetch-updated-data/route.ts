import { NextResponse } from "next/server";
import { z } from "zod";
import { eq, desc, and } from "drizzle-orm";
import { db } from "@/schema/db";
import { events } from "@/schema/crud";
import axios from "axios";

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
    const lastUpdateReviews = await db
      .select()
      .from(events.table)
      .where(
        and(
          eq(events.table.business_id, business_id),
          eq(events.table.event, "update_reviews")
        )
      )
      .orderBy(desc(events.table.timestamp))
      .limit(1)
      .then((rows) => rows[0]);

    const lastUpdateStats = await db
      .select()
      .from(events.table)
      .where(
        and(
          eq(events.table.business_id, business_id),
          eq(events.table.event, "update_stats")
        )
      )
      .orderBy(desc(events.table.timestamp))
      .limit(1)
      .then((rows) => rows[0]);

    // If data is out of date, fetch and update
    if (
      !lastUpdateReviews?.timestamp ||
      lastUpdateReviews.timestamp < oneDayAgo
    ) {
      await axios.post("/api/update-reviews", { business_id });
    }

    if (!lastUpdateStats?.timestamp || lastUpdateStats.timestamp < oneDayAgo) {
      await axios.post("/api/update-business-stats", { business_id });
    }

    // Get the data
    const [reviews, stats] = await Promise.all([
      axios.post("/api/fetch-reviews", { business_id }).then((r) => r.data),
      axios
        .post("/api/fetch-business-stats", { business_id })
        .then((r) => r.data),
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
