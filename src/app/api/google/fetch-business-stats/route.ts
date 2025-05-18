import { NextResponse } from "next/server";

import schema from "./schema";
import { NextRouteContext, RequestHandler } from "@/middleware/types";
import { withAuth } from "@/middleware/withAuth";
import { withBody } from "@/middleware/withBody";

import { selectBusinessStats } from "@/lib/server/google/select";
import { recordEvent } from "@/lib/server/events";

export const POST: RequestHandler<NextRouteContext> = withAuth(
  withBody(schema, async (_, context) => {
    try {
      const { business_id } = context.body;

      const latestStats = await selectBusinessStats(business_id);
      const response = schema.response.parse(latestStats);
      await recordEvent("fetch_stats", context.user_id, {
        business_id: business_id,
      });
      return NextResponse.json(response);
    } catch (error) {
      console.log(error);
      return NextResponse.json(
        { error: "Internal server error" },
        { status: 500 },
      );
    }
  }),
);
