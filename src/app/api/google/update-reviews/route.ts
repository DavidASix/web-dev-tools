import { NextRequest, NextResponse } from "next/server";

import { withAuth } from "@/middleware/withAuth";
import { updateReviews } from "../update-reviews";
import schema from "./schema";

export const POST = withAuth(async (req: NextRequest) => {
  try {
    const body = await req.json();
    const { business_id } = schema.request.parse(body);
    // Check that the provided business ID exists in the database
    if (!business_id) {
      return NextResponse.json(
        { error: "Business ID is required" },
        { status: 400 }
      );
    }

    await updateReviews(business_id);
    const response = schema.response.parse({});
    return NextResponse.json(response, { status: 200 });
  } catch (error) {
    console.error("Error processing request:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
});
