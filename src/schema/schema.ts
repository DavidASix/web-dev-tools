import {
  primaryKey,
  boolean,
  pgTable,
  serial,
  text,
  varchar,
  integer,
  timestamp,
  real,
  pgEnum,
  jsonb,
} from "drizzle-orm/pg-core";
import { z } from "zod";
import type { AdapterAccountType } from "next-auth/adapters";

/**
 * NEXT AUTH TABLES
 */

export const users = pgTable("user", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  name: text("name"),
  email: text("email").unique(),
  emailVerified: timestamp("emailVerified", { mode: "date" }),
  image: text("image"),
});

export const accounts = pgTable(
  "account",
  {
    userId: text("userId")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    type: text("type").$type<AdapterAccountType>().notNull(),
    provider: text("provider").notNull(),
    providerAccountId: text("providerAccountId").notNull(),
    refresh_token: text("refresh_token"),
    access_token: text("access_token"),
    expires_at: integer("expires_at"),
    token_type: text("token_type"),
    scope: text("scope"),
    id_token: text("id_token"),
    session_state: text("session_state"),
  },
  (account) => ({
    compoundKey: primaryKey({
      columns: [account.provider, account.providerAccountId],
    }),
  }),
);

export const sessions = pgTable("session", {
  sessionToken: text("sessionToken").primaryKey(),
  userId: text("userId")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  expires: timestamp("expires", { mode: "date" }).notNull(),
});

export const verificationTokens = pgTable(
  "verificationToken",
  {
    identifier: text("identifier").notNull(),
    token: text("token").notNull(),
    expires: timestamp("expires", { mode: "date" }).notNull(),
  },
  (verificationToken) => ({
    compositePk: primaryKey({
      columns: [verificationToken.identifier, verificationToken.token],
    }),
  }),
);

export const authenticators = pgTable(
  "authenticator",
  {
    credentialID: text("credentialID").notNull().unique(),
    userId: text("userId")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    providerAccountId: text("providerAccountId").notNull(),
    credentialPublicKey: text("credentialPublicKey").notNull(),
    counter: integer("counter").notNull(),
    credentialDeviceType: text("credentialDeviceType").notNull(),
    credentialBackedUp: boolean("credentialBackedUp").notNull(),
    transports: text("transports"),
  },
  (authenticator) => ({
    compositePK: primaryKey({
      columns: [authenticator.userId, authenticator.credentialID],
    }),
  }),
);

/**
 * BUSINESS LOGIC TABLES
 */

export const businesses = pgTable("businesses", {
  id: serial("id").primaryKey(),
  user_id: text("user_id")
    .references(() => users.id, { onDelete: "cascade" })
    .notNull(),
  business_name: text("business_name"),
  place_id: varchar("place_id", { length: 256 }),
});

export const reviews = pgTable("reviews", {
  id: serial("id").primaryKey(),
  business_id: integer("business_id")
    .references(() => businesses.id, { onDelete: "cascade" })
    .notNull(),
  lookup_id: text("lookup_id"), // ID on the review platform
  author_name: text("author_name"),
  author_image: text("author_image"),
  datetime: timestamp("datetime"),
  link: text("link"),
  rating: integer("rating"),
  comments: text("comments"),
  created_at: timestamp("created_at", { withTimezone: true }).defaultNow(),
});

export const business_stats = pgTable("business_stats", {
  id: serial("id").primaryKey(),
  business_id: integer("business_id")
    .references(() => businesses.id, { onDelete: "cascade" })
    .notNull(),
  review_count: integer("review_count"),
  review_score: real("review_score"),
  created_at: timestamp("created_at", { withTimezone: true }).defaultNow(),
});

export const dbEvents = pgEnum("event_types", [
  "fetch_reviews",
  "update_reviews",
  "fetch_stats",
  "update_stats",
]);

export type DBEvent = (typeof dbEvents.enumValues)[number];

export const eventMetadataSchema = z.object({
  business_id: z.number().optional(),
});

export type EventMetadata = z.infer<typeof eventMetadataSchema>;

export const events = pgTable("events", {
  id: serial("id").primaryKey(),
  event: dbEvents("event"),
  user_id: text("user_id")
    .references(() => users.id, { onDelete: "cascade" })
    .notNull(),
  metadata: jsonb("metadata").$type<EventMetadata>(),
  timestamp: timestamp("timestamp", { withTimezone: true }).defaultNow(),
});

export const payments = pgTable("payments", {
  id: serial("id").primaryKey(),
  user_id: text("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  stripe_customer_id: text("stripe_customer_id"),
  stripe_payment_intent_id: text("stripe_payment_intent_id"), // Nullable by default
  stripe_checkout_session_id: text("stripe_checkout_session_id").unique(),
  status: text("status"),
  amount_total: integer("amount_total"),
  currency: text("currency"),
  payment_status: text("payment_status"),
  line_items: jsonb("line_items"),
  metadata: jsonb("metadata"), // Nullable by default
  created_at: timestamp("created_at", { withTimezone: true }).defaultNow(),
});

/**
 * API KEYS
 */

export const api_keys = pgTable("api_keys", {
  id: serial("id").primaryKey(),
  key: text("key").notNull(),
  user_id: text("user_id")
    .references(() => users.id, { onDelete: "cascade" })
    .notNull(),
  created_at: timestamp("created_at", { withTimezone: true }).defaultNow(),
  expired: boolean("expired").default(false),
});
