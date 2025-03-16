import NextAuth from "next-auth";
import { DrizzleAdapter } from "@auth/drizzle-adapter";
import Resend from "next-auth/providers/resend";
import EmailProvider from "next-auth/providers/email";
import { db } from "@/schema/db";

let provider = [];
const development = process.env.NODE_ENV === "development";
if (development) {
  provider = [
    /**
     * EmailProvider is a custom provider that simulates sending a magic link, but instead
     * logs the link to the console. This is used for development environments to make auth
     * easier to work with.
     */
    EmailProvider({
      from: process.env.MAILER_ADDRESS,
      server: "someServer",
      sendVerificationRequest: async ({ url }) => {
        console.log("Simulating Email Send");
        console.log("✨✨ Email Auth Magic Link ✨✨\n\n", url, "\n\n");
      },
    }),
  ];
} else {
  /**
   * List any actual providers being used here.
   */
  provider = [
    Resend({
      from: process.env.MAILER_ADDRESS,
    }),
  ];
}

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: DrizzleAdapter(db),
  providers: provider,
  trustHost: true,
  events: {
    async createUser(message) {
      const { user } = message;
      console.log("User Created:", user);
    },
  },
});
