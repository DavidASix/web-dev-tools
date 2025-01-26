import { createInsertSchema } from "drizzle-zod";
import {
  businesses as businessesTable,
  reviews as reviewsTable,
  business_stats as businessStatsTable,
} from "./schema";
import { z } from "zod";

export const businesses = {
  table: businessesTable,
  select: z.object({
    business_id: z.number().optional(),
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

export const businessStats = {
  table: businessStatsTable,
};
