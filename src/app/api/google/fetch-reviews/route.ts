import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

import { withAuth } from "@/middleware/withAuth";
import { fetchReviews } from "../fetch-reviews";

const bodySchema = z.object({
  business_id: z.number(),
});

export const POST = withAuth(async (req: NextRequest) => {
  try {
    const body = await req.json();
    const { business_id } = bodySchema.parse(body);

    if (!business_id) {
      return NextResponse.json(
        { error: "Business ID is required" },
        { status: 400 }
      );
    }

    const businessReviews = await fetchReviews(business_id);
    return NextResponse.json(businessReviews);
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 400 }
    );
  }
});
