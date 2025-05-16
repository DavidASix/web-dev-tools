import { NextRequest, NextResponse } from "next/server";

import { withAuth } from "@/middleware/withAuth";
import { fetchReviews } from "../fetch-reviews";
import schema from "./schema";

export const POST = withAuth(async (req: NextRequest) => {
  try {
    const body = await req.json();
    const { business_id } = schema.request.parse(body);

    if (!business_id) {
      return NextResponse.json(
        { error: "Business ID is required" },
        { status: 400 }
      );
    }

    const businessReviews = await fetchReviews(business_id);
    const response = schema.response.parse(businessReviews);
    return NextResponse.json(response);
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 400 }
    );
  }
});
