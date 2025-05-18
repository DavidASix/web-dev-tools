import "server-only"; // Ensure this file is only run on the server
import { db } from "@/schema/db";
import { and, ColumnBaseConfig, eq } from "drizzle-orm";
import { PgColumn, PgTable } from "drizzle-orm/pg-core";

interface SerialColumn extends ColumnBaseConfig<"number", "PgSerial"> {
  dataType: "number";
  columnType: "PgSerial";
}

interface TextColumn extends ColumnBaseConfig<"string", "PgText"> {
  dataType: "string";
  columnType: "PgText";
}

export type OwnedTable = PgTable & {
  id: PgColumn<SerialColumn>;
  user_id: PgColumn<TextColumn>;
};

export async function userHasOwnership(
  userId: string,
  itemId: number,
  table: OwnedTable,
): Promise<boolean> {
  try {
    const ownership = await db
      .select()
      .from(table)
      .where(and(eq(table.user_id, userId), eq(table.id, itemId)))
      .limit(1);

    return ownership.length > 0;
  } catch (error) {
    console.error("Error checking user ownership:", error);
    return false;
  }
}
