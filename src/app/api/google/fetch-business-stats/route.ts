import { NextResponse } from "next/server";

import { withAuth } from "@/middleware/withAuth";
import { fetchBusinessStats } from "../fetch-business-stats";
import schema from "./schema";

export const POST = withAuth(async (req) => {
  try {
    const body = await req.json();
    const { business_id } = schema.request.parse(body);

    if (!business_id) {
      return NextResponse.json(
        { error: "Business ID is required" },
        { status: 400 }
      );
    }

    const latestStats = await fetchBusinessStats(business_id);
    const response = schema.response.parse(latestStats);
    return NextResponse.json(response);
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
});
