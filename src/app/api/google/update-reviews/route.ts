import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { updateReviews } from "../update-reviews";

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

    await updateReviews(business_id);
    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error("Error processing request:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
