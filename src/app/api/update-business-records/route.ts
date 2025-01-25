import GoogleReviews from "@/google-reviews";
import { businesses } from "@/schema/crud";
import { db } from "@/schema/db";
import { eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

const bodySchema = z.object({
  business_id: z.number(),
});

/**
 * Update the business record in the database with the provided business ID.
 * @param { business_id } - The database business ID to update.
 * @returns A JSON response indicating the success or failure of the operation.
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Check that the provided business ID exists in the database
    const { business_id } = bodySchema.parse(body);
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

    return NextResponse.json({ message: "Success" }, { status: 200 });
  } catch (error) {
    console.error("Error processing request:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
