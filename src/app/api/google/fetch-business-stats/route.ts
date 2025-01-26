import { NextResponse } from "next/server";
import { z } from "zod";

import { fetchBusinessStats } from "../fetch-business-stats";

const bodySchema = z.object({
  business_id: z.number(),
});

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

    const latestStats = await fetchBusinessStats(business_id);
    return NextResponse.json(latestStats);
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
