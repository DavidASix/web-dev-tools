import { NextResponse } from "next/server";

import { auth } from "~/auth";
import { generateApiKey } from "../../utils";

export const GET = auth(async (req) => {
  try {
    // Check for authenticated session
    const user_id = req?.auth?.user?.id;
    if (!user_id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const key = await generateApiKey(user_id);
    return NextResponse.json({ key }, { status: 200 });
  } catch (error) {
    console.error("Error processing request:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
});
