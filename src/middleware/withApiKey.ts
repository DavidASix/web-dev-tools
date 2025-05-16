import { NextResponse } from "next/server";
import { apiKeyIsValid } from "@/lib/server/api-keys";
import { RequestHandler } from "./types";

type APIAuthContext = {
  user_id: string;
};
/**
 * Middleware wrapper to ensure that the API key is valid before proceeding with the request.
 * This middleware checks for a valid session and adds the user ID to the context.
 *
 * @example
 * ```typescript
 * export const GET: RequestHandler<NextRouteContext> = withApiKey(
 *   async (_, context) => {
 *     const { user_id } = context;
 *     console.log({ user_id });
 *     return NextResponse.json({ message: "Hello World!" });
 *   }
 * );
 * ```
 */
export function withApiKey<T extends object & { user_id?: never }>(
  handler: RequestHandler<T & APIAuthContext>
): RequestHandler<T> {
  return async function (req, context: T) {
    try {
      const key = req.headers.get("authorization")?.split(" ")[1];
      if (!key) {
        throw new Error("API key is missing");
      }
      const user_id = await apiKeyIsValid(key);
      if (!user_id) {
        throw new Error("Invalid API key");
      }

      const newContext = { ...context, user_id };
      return handler(req, newContext as T & APIAuthContext);
    } catch (error) {
      console.error("Error in withApiKey middleware:", error);
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
  };
}
