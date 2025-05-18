import { NextResponse } from "next/server";

import schema from "./schema";
import { NextRouteContext, RequestHandler } from "@/middleware/types";
import { withAuth } from "@/middleware/withAuth";
import { withBody } from "@/middleware/withBody";

import { updateBusinessStats } from "@/lib/server/google/update";
import { recordEvent } from "@/lib/server/events";

export const POST: RequestHandler<NextRouteContext> = withAuth(
  withBody(schema, async (_, context) => {
    try {
      const { business_id } = context.body;

      const insertedStats = await updateBusinessStats(business_id);
      const response = schema.response.parse(insertedStats);
      await recordEvent("update_stats", context.user_id, {
        business_id: business_id,
      });
      return NextResponse.json(response, { status: 200 });
    } catch (error) {
      console.error("Error processing request:", error);
      return NextResponse.json(
        { error: "Internal Server Error" },
        { status: 500 },
      );
    }
  }),
);
