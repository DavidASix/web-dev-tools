import { NextResponse } from "next/server";
import { auth } from "~/auth";
import type { NextRequest } from "next/server";

/**
 * Middleware wrapper to ensure that the user is authenticated before proceeding with the request.
 */
export function withAuth<T extends unknown[]>(
  handler: (req: NextRequest, user_id: string, ...args: T) => Promise<Response>
) {
  return async function (req: NextRequest, ...args: T): Promise<Response> {
    // Get the auth session
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    return handler(req, session.user.id, ...args);
  };
}
