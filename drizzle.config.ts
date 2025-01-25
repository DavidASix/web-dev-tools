import { defineConfig } from "drizzle-kit";
import "dotenv/config";

export default defineConfig({
  dialect: "postgresql",

  schema: "./src/schema/schema.ts",
  out: "./src/schema/migrations/",

  dbCredentials: {
    url: process.env.DATABASE_URL ?? "",
  },

  verbose: true,
  strict: true,
});
