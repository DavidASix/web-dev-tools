import { Button } from "@/components/ui/button";
import Link from "next/link";
import React from "react";
import SiteLayout from "./layout";

export default function Landing({}) {
  return (
    <SiteLayout>
      <section className="section section-padding">
        <div className="content flex flex-col justify-center items-center gap-8">
          <p>
            Do you want to display Google Reviews in your applications easily?
          </p>
          <p>Try our Google Reviews App today!</p>
          <Button asChild>
            <Link href="login">Create an Account</Link>
          </Button>
        </div>
      </section>
    </SiteLayout>
  );
}