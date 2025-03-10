import NextAuth from "next-auth";
import { DrizzleAdapter } from "@auth/drizzle-adapter";
import Resend from "next-auth/providers/resend";
import { db } from "@/schema/db";

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: DrizzleAdapter(db),
  providers: [
    Resend({
      from: process.env.MAILER_ADDRESS,
    }),
  ],
  trustHost: true,
  events: {
    async createUser(message) {
      const { user } = message;
      console.log("User Created:", user);
    },
  },
});
