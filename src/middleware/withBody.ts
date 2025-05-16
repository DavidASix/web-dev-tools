import { APISchema } from "@/schema/types";
import { RequestHandler } from "./types";
import { z, type ZodTypeAny } from "zod";
import { NextResponse } from "next/server";

type BodyContext<Schema> = {
  body: Schema;
};

/**
 * Middleware wrapper to parse & add types to the body of the request.
 *
 * @param apiSchema An APISchema object that defines the request schema, usually found in `/endpoint/schema.ts`
 * @param handler The request handler function that will receive the parsed body in the context.
 *
 * @example
 * ```typescript
 * export const GET: RequestHandler<NextRouteContext> = withBody(
 *   routesApiSchema,
 *   async (_, context) => {
 *     const { body } = context;
 *     console.log({ body });
 *     return NextResponse.json({ message: "Hello World!" });
 *   }
 * );
 * ```
 */
export function withBody<
  TReqSchema extends ZodTypeAny,
  TRespSchema extends ZodTypeAny,
  T extends object & { body?: never },
>(
  apiSchema: APISchema<TReqSchema, TRespSchema>,
  handler: RequestHandler<T & BodyContext<z.infer<TReqSchema>>>,
): RequestHandler<T> {
  return async function (req, context: T) {
    const body = await req.json();
    try {
      // Validate the body against the request schema
      const parsed = apiSchema.request.parse(body);

      const newContext = {
        ...context,
        body: parsed,
      };

      return handler(req, newContext as T & BodyContext<z.infer<TReqSchema>>);
    } catch (error) {
      console.error("Error parsing request body:", error);
      return NextResponse.json(
        { error: "Invalid request body" },
        { status: 400 },
      );
    }
  };
}
