import { NextResponse } from "next/server";
import { apiKeys } from "@/schema/crud";
import { auth } from "~/auth";
import { db } from "@/schema/db";
import { eq } from "drizzle-orm";
import { generateApiKey } from "@/lib/server/api-keys";

export async function GET(): Promise<NextResponse> {
  try {
    // Get the auth session using the middleware
    const session = await auth();
    const user_id = session?.user?.id;

    if (!user_id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await db
      .update(apiKeys.table)
      .set({ expired: true })
      .where(eq(apiKeys.table.user_id, user_id));

    const key = await generateApiKey(user_id);

    return NextResponse.json({ key }, { status: 200 });
  } catch (error) {
    console.error("Error processing request:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
