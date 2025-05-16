import { NextResponse } from "next/server";
import { auth } from "~/auth";
import { RequestHandler } from "./types";

type AuthContext = {
  user_id: string;
};
/**
 * Middleware wrapper to ensure that the user is authenticated before proceeding with the request.
 * This middleware checks for a valid session and adds the user ID to the context.
 * @example
 * ```typescript
 * export const GET: RequestHandler<NextRouteContext> = withAuth(
 *   async (_, context) => {
 *     const { user_id } = context;
 *     console.log({ user_id });
 *     return NextResponse.json({ message: "Hello World!" });
 *   }
 * );
 * ```
 */
export function withAuth<T extends object & { user_id?: never }>(
  handler: RequestHandler<T & AuthContext>
): RequestHandler<T> {
  return async function (req, context: T) {
    // Get the auth session
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const newContext = {
      ...context,
      user_id: session.user.id,
    };

    return handler(req, newContext as T & AuthContext);
  };
}
