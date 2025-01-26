import GoogleReviews from "@/google-reviews";
import { businesses, businessStats } from "@/schema/crud";
import { db } from "@/schema/db";
import { eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { recordEvent } from "../utils";

const bodySchema = z.object({
  business_id: z.number(),
});

/**
 * Add the current business stats to the database for the given business ID, then return the inserted stats.
 *
 * @param { business_id } - The database business ID to update.
 * @returns { business_id: number, review_count: number, review_score: number } - The inserted stats.
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { business_id } = bodySchema.parse(body);
    // Check that the provided business ID exists in the database
    if (!business_id) {
      return NextResponse.json(
        { error: "Business ID is required" },
        { status: 400 }
      );
    }
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
      });

    await recordEvent("update_stats", business_id);
    return NextResponse.json(insertedStats, { status: 200 });
  } catch (error) {
    console.error("Error processing request:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
