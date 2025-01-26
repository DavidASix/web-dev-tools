import { NextResponse } from "next/server";
import { z } from "zod";

import { auth } from "~/auth";
import { fetchBusinessStats } from "../fetch-business-stats";

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

    if (!business_id) {
      return NextResponse.json(
        { error: "Business ID is required" },
        { status: 400 }
      );
    }

    const latestStats = await fetchBusinessStats(business_id);
    return NextResponse.json(latestStats);
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
});
