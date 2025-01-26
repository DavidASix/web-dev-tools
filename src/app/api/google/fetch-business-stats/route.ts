import { NextResponse } from "next/server";
import { z } from "zod";
import { eq, desc } from "drizzle-orm";

import { db } from "@/schema/db";
import { businessStats } from "@/schema/crud";
import { recordEvent } from "../utils";

const bodySchema = z.object({
  business_id: z.number(),
});

/**
 * Fetch the latest business stats for a given business ID
 * @param { business_id: number } - The database ID of the business to fetch stats for
 * @returns { review_count: number, review_score: number } - The latest stats for the given business
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
    return NextResponse.json(latestStats);
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
