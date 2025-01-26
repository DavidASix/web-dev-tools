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
