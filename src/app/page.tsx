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
  try {
    const session = await auth();
    if (session) {
      return productMetadata;
    } else {
      return siteMetadata;
    }
  } catch {
    return siteMetadata;
  }
}

export default async function Home() {
  try {
    const session = await auth();
    if (session) {
      return <Dashboard />;
    } else {
      return <Landing />;
    }
  } catch {
    return <Landing />;
  }
}
