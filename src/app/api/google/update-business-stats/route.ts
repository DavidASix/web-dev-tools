import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { updateBusinessStats } from "../update-business-stats";

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
    const insertedStats = await updateBusinessStats(business_id);
    return NextResponse.json(insertedStats, { status: 200 });
  } catch (error) {
    console.error("Error processing request:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
