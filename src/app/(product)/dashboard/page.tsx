"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import CreateNewApiKey from "@/components/api-key/create-new-api-key";
import { AuroraText } from "@/components/magicui/aurora-text";
import { applications } from "@/components/structure/header/applications";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import Link from "next/link";

export default function DashboardPage() {
  return (
    <div className="container mx-auto space-y-20 py-10">
      {/* Hero Section */}
      <section className="section text-center space-y-6 py-12">
        <h1 className="text-5xl font-bold tracking-tight md:text-6xl">
          <AuroraText>Web Developer Tools</AuroraText>
        </h1>
        <p className="mx-auto max-w-2xl text-xl text-muted-foreground">
          Powerful tools to supercharge your static site development workflow
        </p>
      </section>

      {/* Tools Section */}
      <section className="space-y-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold mb-3">Available Tools</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Each tool is designed to solve specific challenges for static site
            developers
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {applications
            .filter((app) => app.id !== "dashboard")
            .map((tool) => (
              <Card key={tool.id} className="flex flex-col h-full">
                <CardHeader className="pb-4">
                  <div className="mb-2">
                    <tool.icon className="w-6 h-6" />
                  </div>
                  <CardTitle>{tool.name}</CardTitle>
                  <CardDescription>
                    {getToolDescription(tool.id)}
                  </CardDescription>
                </CardHeader>
                <CardContent className="flex-grow">
                  <ul className="space-y-2">
                    {getToolFeatures(tool.id).map((feature, index) => (
                      <li key={index} className="flex items-start">
                        <CheckCircle2 className="w-5 h-5 text-primary mr-2 flex-shrink-0" />
                        <span className="text-sm">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
                <CardFooter>
                  <Button asChild className="w-full mt-auto">
                    <Link href={tool.url}>
                      <span>Explore {tool.name}</span>
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                </CardFooter>
              </Card>
            ))}
        </div>
      </section>

      {/* API Key Section */}
      <section className="max-w-3xl mx-auto">
        <h2 className="text-3xl font-bold text-center mb-6">Your API Key</h2>
        <CreateNewApiKey />
      </section>

      {/* Pricing Section */}
      <section className="space-y-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold mb-3">Flexible Pricing Options</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Choose what works best for your needs and budget
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {/* Individual Tool Pricing */}
          <Card>
            <CardHeader>
              <CardTitle>Individual Tools</CardTitle>
              <CardDescription>Pay for only what you need</CardDescription>
              <div className="mt-4">
                <span className="text-3xl font-bold">$9.99</span>
                <span className="text-muted-foreground ml-2">
                  per tool/month
                </span>
              </div>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                <li className="flex items-center">
                  <CheckCircle2 className="w-5 h-5 text-primary mr-2" />
                  <span>Full access to single tool</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle2 className="w-5 h-5 text-primary mr-2" />
                  <span>Unlimited API requests</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle2 className="w-5 h-5 text-primary mr-2" />
                  <span>Email support</span>
                </li>
              </ul>
            </CardContent>
            <CardFooter>
              <Button variant="outline" className="w-full">
                Choose a Tool
              </Button>
            </CardFooter>
          </Card>

          {/* Pro Subscription */}
          <Card className="border-primary relative">
            <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground px-4 py-1 rounded-full text-sm font-medium">
              Most Popular
            </div>
            <CardHeader>
              <CardTitle>Pro Subscription</CardTitle>
              <CardDescription>
                Access to all tools at a discount
              </CardDescription>
              <div className="mt-4">
                <span className="text-3xl font-bold">$24.99</span>
                <span className="text-muted-foreground ml-2">per month</span>
              </div>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                <li className="flex items-center">
                  <CheckCircle2 className="w-5 h-5 text-primary mr-2" />
                  <span>Access to all tools</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle2 className="w-5 h-5 text-primary mr-2" />
                  <span>Unlimited API requests</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle2 className="w-5 h-5 text-primary mr-2" />
                  <span>Priority support</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle2 className="w-5 h-5 text-primary mr-2" />
                  <span>Early access to new features</span>
                </li>
              </ul>
            </CardContent>
            <CardFooter>
              <Button className="w-full">Subscribe Now</Button>
            </CardFooter>
          </Card>

          {/* Enterprise */}
          <Card>
            <CardHeader>
              <CardTitle>Enterprise</CardTitle>
              <CardDescription>
                Custom solutions for larger teams
              </CardDescription>
              <div className="mt-4">
                <span className="text-3xl font-bold">Custom</span>
                <span className="text-muted-foreground ml-2">pricing</span>
              </div>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                <li className="flex items-center">
                  <CheckCircle2 className="w-5 h-5 text-primary mr-2" />
                  <span>All Pro features</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle2 className="w-5 h-5 text-primary mr-2" />
                  <span>Dedicated support manager</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle2 className="w-5 h-5 text-primary mr-2" />
                  <span>Custom integrations</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle2 className="w-5 h-5 text-primary mr-2" />
                  <span>Service level agreement</span>
                </li>
              </ul>
            </CardContent>
            <CardFooter>
              <Button variant="outline" className="w-full">
                Contact Sales
              </Button>
            </CardFooter>
          </Card>
        </div>
      </section>
    </div>
  );
}

// Helper functions for tool metadata
function getToolDescription(toolId: string): string {
  const descriptions: Record<string, string> = {
    "google-reviews":
      "Integrate Google Reviews seamlessly into your static site without client-side API calls.",
    "blog-generator":
      "Generate SEO-optimized blog content with AI to keep your site fresh and engaging.",
  };

  return (
    descriptions[toolId] || "Enhance your static site with powerful features."
  );
}

function getToolFeatures(toolId: string): string[] {
  const features: Record<string, string[]> = {
    "google-reviews": [
      "Display real customer reviews",
      "Star ratings and review text",
      "Fully static generation - no API calls",
      "Customizable styling options",
    ],
    "blog-generator": [
      "AI-powered content creation",
      "SEO optimization built-in",
      "Various topic suggestions",
      "Export in Markdown or HTML",
    ],
  };

  return features[toolId] || ["Feature coming soon"];
}
