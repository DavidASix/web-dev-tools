import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

import { auth } from "~/auth";
import { updateBusinessStats } from "../update-business-stats";

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
    // Check that the provided business ID exists in the database
    if (!business_id) {
      return NextResponse.json(
        { error: "Business ID is required" },
        { status: 400 },
      );
    }
    const insertedStats = await updateBusinessStats(business_id);
    return NextResponse.json(insertedStats, { status: 200 });
  } catch (error) {
    console.error("Error processing request:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
