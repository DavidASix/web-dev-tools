"use client";

import { Button } from "@/components/ui/button";
import CreateNewApiKey from "@/components/api-key/create-new-api-key";
import { AuroraText } from "@/components/magicui/aurora-text";
import { ShimmerButton } from "@/components/magicui/shimmer-button";
import AvailableTools from "@/components/common/available-tools";
import PricingOptions from "@/components/common/pricing-options";

export default function DashboardPage() {
  return (
    <div className="container mx-auto space-y-20 py-10">
      {/* Hero Section */}
      <section className="text-center space-y-6 py-12">
        <h1 className="text-5xl font-bold tracking-tight md:text-6xl">
          <AuroraText>Web Developer Tools</AuroraText>
        </h1>
        <p className="mx-auto max-w-2xl text-xl text-muted-foreground">
          Powerful tools to supercharge your static site development workflow
        </p>
        <div className="flex justify-center gap-4 flex-wrap">
          <ShimmerButton>Get Started</ShimmerButton>
          <Button variant="outline" className="font-medium">
            Learn More
          </Button>
        </div>
      </section>

      {/* Tools Section - Now a separate component */}
      <AvailableTools />

      {/* API Key Section */}
      <section className="max-w-3xl mx-auto">
        <h2 className="text-3xl font-bold text-center mb-6">Your API Key</h2>
        <CreateNewApiKey />
      </section>

      {/* Pricing Section - Now a separate component */}
      <PricingOptions />
    </div>
  );
}
