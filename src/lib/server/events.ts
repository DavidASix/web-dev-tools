import { and, eq, desc } from "drizzle-orm";

import { db } from "@/schema/db";
import { type DBEvent } from "@/schema/schema";
import { events } from "@/schema/crud";

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
