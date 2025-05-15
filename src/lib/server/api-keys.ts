import { NextRequest, NextResponse } from "next/server";
import { and, eq } from "drizzle-orm";

import { db } from "@/schema/db";
import { apiKeys } from "@/schema/crud";
import { encryptDeterministic } from "@/lib/encryption";

export async function generateApiKey(user_id: string) {
  const key = Array.from(crypto.getRandomValues(new Uint8Array(32)))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
  const encryptedKey = await encryptDeterministic(key);
  await db.insert(apiKeys.table).values({ key: encryptedKey, user_id });
  return key;
}

export async function apiKeyIsValid(key: string) {
  const encryptedKey = await encryptDeterministic(key);
  const apiKey = await db
    .select()
    .from(apiKeys.table)
    .where(
      and(eq(apiKeys.table.key, encryptedKey), eq(apiKeys.table.expired, false))
    )
    .then((rows) => rows[0]);
  return apiKey !== undefined;
}

export async function invalidateApiKey(key: string) {
  const encryptedKey = await encryptDeterministic(key);
  await db
    .update(apiKeys.table)
    .set({ expired: true })
    .where(eq(apiKeys.table.key, encryptedKey));
}

export async function checkApiKey(request: NextRequest): Promise<{
  isValid: boolean;
  error: NextResponse | null;
}> {
  const key = request.headers.get("authorization")?.split(" ")[1];
  const encryptedKey = await encryptDeterministic(key || "");
  const isValid = await apiKeyIsValid(encryptedKey);

  const response = {
    isValid: isValid,
    error: isValid
      ? null
      : NextResponse.json({ error: "Invalid API key" }, { status: 401 }),
  };
  return response;
}
