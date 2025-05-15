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
    try {
      const key = request.headers.get("authorization")?.split(" ")[1];
      if (!key) {
        throw new Error("API key is missing");
      }
      const isValid = await apiKeyIsValid(key);
      if (!isValid) {
        throw new Error("Invalid API key");
      }
    } catch (error) {
      console.error("Error in withApiKey middleware:", error);
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    return handler(request, ...args);
  };
}
