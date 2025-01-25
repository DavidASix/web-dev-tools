import { NextResponse } from "next/server";
import { db } from "@/schema/db";
import { reviews, businesses } from "@/schema/crud";
import { eq, desc } from "drizzle-orm";

export async function POST(req: Request) {
  try {
    const { place_id } = businesses.select.parse(req.body);
    const business = db
      .select({ id: businesses.table.id })
      .from(businesses.table)
      .where(eq(businesses.table.place_id, place_id ?? ""))
      .as("business");
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
      .innerJoin(business, eq(reviews.table.business_id, business.id))
      .orderBy(desc(reviews.table.datetime))
      .limit(30);
    console.log(businessReviews);
    return NextResponse.json(businessReviews);
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 400 }
    );
  }
}
