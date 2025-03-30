import React from "react";
import type { Metadata } from "next";
import { redirect } from "next/navigation";

import { auth } from "~/auth";
import Home from "./(site)/home";

const siteMetadata: Metadata = {
  title: "Google Reviews for Developers",
};

export async function generateMetadata(): Promise<Metadata> {
  return siteMetadata;
}

export default async function App() {
  const session = await auth();
  console.log("Session:", session);

  if (session) {
    console.log("Session exists, redirecting to dashboard");
    redirect("/dashboard");
  }

  return <Home />;
}
