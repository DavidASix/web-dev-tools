import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

import { auth } from "~/auth";
import { fetchReviews } from "../fetch-reviews";

const bodySchema = z.object({
  business_id: z.number(),
});

export async function POST(req: NextRequest): Promise<NextResponse> {
  try {
    // Get the auth session using the middleware
    const session = await auth();
    const user_id = session?.user?.id;

    if (!user_id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { business_id } = bodySchema.parse(body);

    if (!business_id) {
      return NextResponse.json(
        { error: "Business ID is required" },
        { status: 400 },
      );
    }

    const businessReviews = await fetchReviews(business_id);
    return NextResponse.json(businessReviews);
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 400 },
    );
  }
}
