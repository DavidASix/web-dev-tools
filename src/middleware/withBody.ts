import { RequestHandler } from "./types";

type BodyContext = {
  body: string;
};

/**
 * Middleware wrapper to parse & add types to the body of the request.
 *
 * @example
 * ```typescript
 * export const GET: RequestHandler<NextRouteContext> = withBody(
 *   async (_, context) => {
 *     const { body } = context;
 *     console.log({ body });
 *     return NextResponse.json({ message: "Hello World!" });
 *   }
 * );
 * ```
 */
export function withBody<T>(
  handler: RequestHandler<T & BodyContext>
): RequestHandler<T> {
  return async function (req, context: T) {
    const newContext = {
      ...context,
      body: "Hello World!",
    };

    return handler(req, newContext as T & BodyContext);
  };
}
