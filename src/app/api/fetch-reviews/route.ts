import { NextResponse } from "next/server";
import { db } from "@/schema/db";
import { reviews, businesses } from "@/schema/crud";
import { eq, desc } from "drizzle-orm";
import { z } from "zod";
import { recordEvent } from "../utils";

const bodySchema = z.object({
  business_id: z.number(),
});

/**
 * Fetch the reviews for a given business
 * @param { business_id: number } - The database ID of the business to fetch reviews for
 * @returns { reviews: Review[] } - The reviews for the given business
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
    return NextResponse.json(businessReviews);
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 400 }
    );
  }
}
