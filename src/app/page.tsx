import React from "react";
import type { Metadata } from "next";

import { auth } from "~/auth";
import Landing from "./(site)/Landing";
import Dashboard from "./(product)/Dashboard";

const productMetadata: Metadata = {
  title: "Admin | Google Reviews for Developers",
};

const siteMetadata: Metadata = {
  title: "Google Reviews for Developers",
};

export async function generateMetadata(): Promise<Metadata> {
  const session = await auth();

  if (!session) {
    return siteMetadata;
  } else {
    return productMetadata;
  }
}

export default async function Home() {
  const session = await auth();
  if (!session) {
    return <Landing />;
  } else {
    return <Dashboard />;
  }
}
