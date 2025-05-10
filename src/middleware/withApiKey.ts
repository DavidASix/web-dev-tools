import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { apiKeyIsValid } from "@/lib/server/api-keys";

/**
 * Middleware wrapper to ensure that the request has a valid API key before proceeding with the request.
 */
export function withApiKey<T extends unknown[]>(
  handler: (request: NextRequest, ...args: T) => Promise<Response>
) {
  return async function (request: NextRequest, ...args: T): Promise<Response> {
    const key = request.headers.get("authorization")?.split(" ")[1];
    const isValid = key ? await apiKeyIsValid(key) : false;
    if (!isValid) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    return handler(request, ...args);
  };
}
