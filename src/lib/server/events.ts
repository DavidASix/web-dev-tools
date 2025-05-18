import { and, eq, desc } from "drizzle-orm";

import { db } from "@/schema/db";
import type { EventMetadata, DBEvent } from "@/schema/schema";
import { events } from "@/schema/schema";

export async function recordEvent(
  event: DBEvent,
  user_id: string,
  metadata: EventMetadata,
) {
  await db.insert(events).values({
    user_id,
    event: event,
    metadata,
  });
}

export async function getLastEvent(event: DBEvent, user_id: string) {
  const lastEvent = await db
    .select()
    .from(events)
    .where(and(eq(events.user_id, user_id), eq(events.event, event)))
    .orderBy(desc(events.timestamp))
    .limit(1)
    .then((rows) => rows[0]);

  return lastEvent;
}
