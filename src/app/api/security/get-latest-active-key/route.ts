import { NextResponse } from "next/server";
import { and, eq, desc } from "drizzle-orm";
import { apiKeys } from "@/schema/crud";
import { db } from "@/schema/db";
import { decrypt } from "@/lib/encryption";
import { withAuth } from "@/middleware/withAuth";
import schema from "./schema";

export const GET = withAuth(async (_, user_id) => {
  try {
    const apiKey = await db
      .select()
      .from(apiKeys.table)
      .where(
        and(
          eq(apiKeys.table.user_id, user_id),
          eq(apiKeys.table.expired, false)
        )
      )
      .orderBy(desc(apiKeys.table.created_at))
      .then((rows) => rows[0]);
    const decryptedKey = await decrypt(apiKey?.key || "");
    const response = schema.response.parse({
      apiKey: decryptedKey,
    });
    return NextResponse.json(response, { status: 200 });
  } catch (error) {
    console.error("Error processing request:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
});
