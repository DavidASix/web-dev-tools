import { z } from "zod";
import type { APISchema } from "@/schema/types";

const schema = {
  url: "/api/fetch-updated-data",
  request: z.object({
    business_id: z.number(),
  }),
  response: z.object({
    reviews: z
      .object({
        author_name: z.string().nullable(),
        author_image: z.string().nullable(),
        datetime: z.string().nullable(),
        link: z.string().nullable(),
        rating: z.number().nullable(),
        comments: z.string().nullable(),
      })
      .array(),
    stats: z.object({
      review_count: z.number().nullable(),
      review_score: z.number().nullable(),
    }),
  }),
} satisfies APISchema;

export default schema;
