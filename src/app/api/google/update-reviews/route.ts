import { NextResponse } from "next/server";
import { z } from "zod";

import { auth } from "~/auth";
import { updateReviews } from "../update-reviews";

const bodySchema = z.object({
  business_id: z.number(),
});

export const POST = auth(async (req) => {
  try {
    // Check for authenticated session
    const user_id = req?.auth?.user?.id;
    if (!user_id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
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
});
