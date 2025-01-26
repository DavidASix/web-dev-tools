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
} from "drizzle-orm/pg-core";
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
  })
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
  })
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
  })
);

/**
 * BUSINESS LOGIC TABLES
 */

export const businesses = pgTable("businesses", {
  id: serial("id").primaryKey(),
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

export const events = pgTable("events", {
  id: serial("id").primaryKey(),
  event: dbEvents("event"),
  business_id: integer("business_id")
    .references(() => businesses.id, { onDelete: "cascade" })
    .notNull(),
  timestamp: timestamp("timestamp", { withTimezone: true }).defaultNow(),
});
