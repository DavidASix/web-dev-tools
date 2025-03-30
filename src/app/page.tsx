import React from "react";
import type { Metadata } from "next";
import { redirect } from "next/navigation";

import { auth } from "~/auth";
import Landing from "./(site)/Landing";

const siteMetadata: Metadata = {
  title: "Google Reviews for Developers",
};

export async function generateMetadata(): Promise<Metadata> {
  return siteMetadata;
}

export default async function Home() {
  const session = await auth();
  console.log("Session:", session);
  
  if (session) {
    console.log('Session exists, redirecting to dashboard');
    redirect("/dashboard");
  }

  return <Landing />;
}