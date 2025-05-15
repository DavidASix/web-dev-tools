import { NextResponse } from "next/server";
import { z } from "zod";

import { withAuth } from "@/middleware/withAuth";
import { fetchBusinessStats } from "../fetch-business-stats";

const bodySchema = z.object({
  business_id: z.number(),
});

export const POST = withAuth(async (req) => {
  try {
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
