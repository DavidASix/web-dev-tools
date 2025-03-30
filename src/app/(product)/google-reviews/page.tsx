"use client";
import {
  Card,
  CardContent,
  CardDescription,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle } from "lucide-react";
import CreateNewApiKey from "@/components/common/api-keys/create-new-api-key";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { z } from "zod";
import Link from "next/link";
import { LoadingSpinner } from "@/components/ui/custom/loading-spinner";

export default function GoogleReviewPage() {
  // Query to check if API key exists
  const apiKeyQuery = useQuery({
    queryKey: ["apiKey"],
    queryFn: async () => {
      const { data } = await axios.get("/api/security/get-latest-active-key");
      const parsed = z.object({ apiKey: z.string() }).parse(data);
      return parsed;
    },
    meta: {
      errorMessage: "Failed to fetch API key",
    },
  });

  const hasApiKey = !apiKeyQuery.isLoading && apiKeyQuery.data?.apiKey;

  return (
    <div className="container mx-auto py-10 space-y-12 max-w-4xl">
      {/* Header Section */}
      <section className="section section-padding">
        <div className="content text-center space-y-4">
          <h1 className="text-4xl font-bold tracking-tight">
            Google Reviews Integration
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Display your Google Reviews directly in your static website without
            client-side API calls
          </p>
        </div>
      </section>

      {/* API Key Card - Now a separate component */}
      <CreateNewApiKey />

      {/* How to Use Section */}
      <section className="section section-padding space-y-6">
        <div className="content">
          <h2 className="text-2xl font-semibold">How to Use This Tool</h2>

          <div className="grid gap-6 md:grid-cols-2">
            {/* Step 1 - Conditionally rendered based on API key existence */}
            <Card>
              <CardContent className="pt-6 space-y-4">
                <div className="bg-primary/10 text-primary rounded-full w-8 h-8 flex items-center justify-center font-semibold">
                  1
                </div>
                <CardTitle className="text-xl">Generate Your API Key</CardTitle>
                {apiKeyQuery.isLoading ? (
                  <div className="flex items-center space-x-2">
                    <LoadingSpinner size={16} />
                    <span>Checking API key status...</span>
                  </div>
                ) : hasApiKey ? (
                  <div className="flex items-center space-x-2 text-green-600">
                    <CheckCircle className="w-5 h-5" />
                    <span>API key generated</span>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <CardDescription className="text-base">
                      You need to create an API key to use this service.
                    </CardDescription>
                    <Button asChild>
                      <Link href="/dashboard">Create API Key in Dashboard</Link>
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Step 2 */}
            <Card>
              <CardContent className="pt-6 space-y-4">
                <div className="bg-primary/10 text-primary rounded-full w-8 h-8 flex items-center justify-center font-semibold">
                  2
                </div>
                <CardTitle className="text-xl">
                  Set Up Your Google Place ID
                </CardTitle>
                <CardDescription className="text-base">
                  Find your Google Place ID in Google Maps or Business Profile
                  and add it to your configuration.
                </CardDescription>
                <div className="relative aspect-video rounded-md overflow-hidden bg-muted flex items-center justify-center">
                  <div className="text-center text-muted-foreground text-sm p-4">
                    [Placeholder image: Screenshot showing how to find Google
                    Place ID]
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Step 3 */}
            <Card>
              <CardContent className="pt-6 space-y-4">
                <div className="bg-primary/10 text-primary rounded-full w-8 h-8 flex items-center justify-center font-semibold">
                  3
                </div>
                <CardTitle className="text-xl">Install the Package</CardTitle>
                <CardDescription className="text-base">
                  Add our package to your project using npm, yarn, or pnpm.
                </CardDescription>
                <div className="bg-black text-white p-3 rounded-md font-mono text-sm">
                  npm install google-reviews-static
                </div>
              </CardContent>
            </Card>

            {/* Step 4 */}
            <Card>
              <CardContent className="pt-6 space-y-4">
                <div className="bg-primary/10 text-primary rounded-full w-8 h-8 flex items-center justify-center font-semibold">
                  4
                </div>
                <CardTitle className="text-xl">
                  Integrate in Your Build
                </CardTitle>
                <CardDescription className="text-base">
                  Add the API call to your build process to fetch reviews during
                  static generation.
                </CardDescription>
                <div className="bg-black text-white p-3 rounded-md font-mono text-sm">
                  {`import { fetchReviews } from 'google-reviews-static';

                  // During build
                  const reviews = await fetchReviews({
                    apiKey: process.env.REVIEWS_API_KEY,
                    placeId: 'YOUR_PLACE_ID'
                  });`}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </div>
  );
}
