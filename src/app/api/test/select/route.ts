import { NextResponse } from "next/server";
import { db } from "@/schema/db";
import { businesses } from "@/schema/schema";

export async function GET() {
  try {
    // Simple select - no auth, just grab all businesses
    const allBusinesses = await db.select().from(businesses);

    return NextResponse.json({ businesses: allBusinesses }, { status: 200 });
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 },
    );
  }
}
