import { z } from "zod";
import type { APISchema } from "@/schema/types";

const schema = {
  url: "/api/google/update-reviews",
  request: z.object({
    business_id: z.number(),
  }),
  response: z.object({}),
} satisfies APISchema;

export default schema;
