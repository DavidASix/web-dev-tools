import { NextRequest, NextResponse } from "next/server";
import { and, eq, desc } from "drizzle-orm";

import { db } from "@/schema/db";
import { type DBEvent } from "@/schema/schema";
import { events, apiKeys } from "@/schema/crud";

export async function recordEvent(event: DBEvent, business_id: number) {
  const eventData = {
    event: event,
    business_id: business_id,
  };

  await db.insert(events.table).values(eventData);
}

export async function getLastEvent(event: DBEvent, business_id: number) {
  const lastEvent = await db
    .select()
    .from(events.table)
    .where(
      and(
        eq(events.table.business_id, business_id),
        eq(events.table.event, event)
      )
    )
    .orderBy(desc(events.table.timestamp))
    .limit(1)
    .then((rows) => rows[0]);

  return lastEvent;
}

/**
 * API KEYS
 */

async function hashApiKey(key: string) {
  // Hash the API key using SHA-256
  const encoder = new TextEncoder();
  const data = encoder.encode(key);
  const hashBuffer = await crypto.subtle.digest("SHA-256", data);

  // Convert hash to hex
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
  return hashHex;
}

export async function generateApiKey(user_id: string) {
  const key = Array.from(crypto.getRandomValues(new Uint8Array(32)))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
  const hashedKey = await hashApiKey(key);
  await db.insert(apiKeys.table).values({ key: hashedKey, user_id });
  return key;
}

export async function apiKeyIsValid(key: string) {
  const hashedKey = await hashApiKey(key);
  console.log(hashedKey);
  const apiKey = await db
    .select()
    .from(apiKeys.table)
    .where(
      and(eq(apiKeys.table.key, hashedKey), eq(apiKeys.table.expired, false))
    )
    .then((rows) => rows[0]);
  return apiKey !== undefined;
}

export async function invalidateApiKey(key: string) {
  const hashedKey = await hashApiKey(key);
  await db
    .update(apiKeys.table)
    .set({ expired: true })
    .where(eq(apiKeys.table.key, hashedKey));
}

export async function checkApiKey(request: NextRequest): Promise<{
  isValid: boolean;
  error: NextResponse | null;
}> {
  const key = request.headers.get("authorization")?.split(" ")[1];
  console.log(key);
  const isValid = key ? await apiKeyIsValid(key) : false;
  const response = {
    isValid: isValid,
    error: isValid ? null : NextResponse.json(
      { error: "Invalid API key" },
      { status: 401 }
    ),
  };
  return response;
}
