import { createInsertSchema } from "drizzle-zod";
import {
  businesses as businessesTable,
  reviews as reviewsTable,
} from "./schema";
import { z } from "zod";

export const businesses = {
  table: businessesTable,
  select: z.object({
    id: z.number().optional(),
    business_name: z.string().optional(),
    place_id: z.string().optional(),
  }),
  insert: createInsertSchema(businessesTable),
};

export const reviews = {
  table: reviewsTable,
  select: z.object({
    id: z.number().optional(),
    business_id: z.number().optional(),
  }),
  insert: createInsertSchema(reviewsTable).omit({ id: true }),
};
