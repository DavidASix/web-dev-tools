import GoogleReviews from "@/google-reviews";
import { businesses, businessStats, reviews } from "@/schema/crud";
import { db } from "@/schema/db";
import { eq, inArray, notInArray } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { recordEvent } from "../utils";

const bodySchema = z.object({
  business_id: z.number(),
});

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
    const recentReviews = await googleReviews.getRecent();

    // Get the existing reviews for the business which appear in the recentReviews array
    const existingReviews = await db
      .select()
      .from(reviews.table)
      .where(
        inArray(
          reviews.table.lookup_id,
          recentReviews.map((r) => r.review_id)
        )
      );

    // Format table and remove any existing reviews from the insertable rows1
    const insertableReviews: z.infer<typeof reviews.insert>[] = recentReviews
      .map(
        (review): z.infer<typeof reviews.insert> => ({
          business_id: business_id,
          lookup_id: review.review_id,
          author_name: review.author_name,
          author_image: review.author_photo_url,
          datetime: new Date(review.review_datetime_utc),
          link: review.review_link,
          rating: review.rating,
          comments: review.review_text,
        })
      )
      .filter(
        (review) =>
          !existingReviews.some((r) => r.lookup_id === review.lookup_id)
      );

    console.log(`Inserting ${insertableReviews.length} new reviews`);
    await db.insert(reviews.table).values(insertableReviews);

    await recordEvent("update_reviews", business_id);
    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error("Error processing request:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
