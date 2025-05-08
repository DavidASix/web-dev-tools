import { NextResponse } from "next/server";
import { auth } from "~/auth";
import type { NextRequest } from "next/server";
import { User } from "next-auth";

/**
 * Middleware wrapper to ensure that the user is authenticated before proceeding with the request.
 */
export function withAuth(
  handler: (req: NextRequest, user: User) => Promise<Response>
) {
  return async function (req: NextRequest): Promise<Response> {
    // Get the auth session
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    return handler(req, session.user);
  };
}
