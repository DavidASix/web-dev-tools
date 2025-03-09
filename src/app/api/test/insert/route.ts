import { NextRequest, NextResponse } from "next/server";
import { db } from "@/schema/db";
import { businesses } from "@/schema/crud";

export async function POST(req: NextRequest) {
  try {
    // Simple insert - no auth, just insert whatever comes in
    const body = await req.json();

    // Insert a new business with minimal data
    const [newBusiness] = await db
      .insert(businesses.table)
      .values({
        business_name: body.business_name || "Test Business",
        place_id: body.place_id || null,
      })
      .returning();

    return NextResponse.json({ inserted: newBusiness }, { status: 201 });
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 },
    );
  }
}
