import { and, eq, desc } from "drizzle-orm";

import { db } from "@/schema/db";
import type { EventMetadata, DBEvent } from "@/schema/schema";
import { events } from "@/schema/schema";

/**
 * Records an event in the database.
 *
 * @param event - The event type to record, this is a PG Enum
 * @param user_id - The ID of the user associated with the event.
 * @param metadata - Additional metadata related to the event.
 * @example
 * ```typescript
 * import { recordEvent } from "@/lib/server/events";
 * await recordEvent("update_stats", "user123", { business_id: "business456" });
 * ```
 */
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

/**
 * Retrieves the last recorded event for a specific user.
 *
 * @param event - The event type to retrieve, this is a PG Enum
 * @param user_id - The ID of the user whose last event is being retrieved.
 * @returns The last event recorded for the user, or undefined if no events exist.
 * @example
 * ```typescript
 * import { getLastEvent } from "@/lib/server/events";
 * const lastEvent = await getLastEvent("update_stats", "user123");
 * console.log(lastEvent);
 * ```
 */
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
