import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";

import { apiKeys } from "@/schema/crud";
import { db } from "@/schema/db";
import { generateApiKey } from "@/lib/server/api-keys";
import { withAuth } from "@/middleware/withAuth";

export const GET = withAuth(async (req, user_id) => {
  try {
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
      { status: 500 }
    );
  }
});
