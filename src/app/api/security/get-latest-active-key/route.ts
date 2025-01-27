import { NextResponse } from "next/server";
import { apiKeys } from "@/schema/crud";
import { auth } from "~/auth";
import { db } from "@/schema/db";
import { and, eq, desc } from "drizzle-orm";

export async function GET(): Promise<NextResponse> {
  try {
    // Get the auth session using the middleware
    const session = await auth();
    const user_id = session?.user?.id;
    if (!user_id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const apiKey = await db
      .select()
      .from(apiKeys.table)
      .where(
        and(
          eq(apiKeys.table.user_id, user_id),
          eq(apiKeys.table.expired, false),
        ),
      )
      .orderBy(desc(apiKeys.table.created_at))
      .then((rows) => rows[0]);

    return NextResponse.json({ apiKey: apiKey.key }, { status: 200 });
  } catch (error) {
    console.error("Error processing request:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
