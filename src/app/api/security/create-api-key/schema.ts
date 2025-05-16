import { z } from "zod";
import type { APISchema } from "@/schema/types";

const schema = {
  url: "/api/security/create-api-key",
  request: z.undefined(),
  response: z.object({
    key: z.string(),
  }),
} satisfies APISchema;

export default schema;
