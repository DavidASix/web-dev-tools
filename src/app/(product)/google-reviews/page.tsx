"use client";
import {
  Card,
  CardContent,
  CardDescription,
  CardTitle,
} from "@/components/ui/card";
import CreateNewApiKey from "@/components/api-key/create-new-api-key";

export default function GoogleReviewPage() {
  return (
    <div className="container mx-auto py-10 space-y-12 max-w-4xl">
      {/* Header Section */}
      <section className="text-center space-y-4">
        <h1 className="text-4xl font-bold tracking-tight">
          Google Reviews Integration
        </h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Display your Google Reviews directly in your static website without
          client-side API calls
        </p>
      </section>

      {/* API Key Card - Now a separate component */}
      <CreateNewApiKey />

      {/* How to Use Section */}
      <section className="space-y-6">
        <h2 className="text-2xl font-semibold">How to Use This Tool</h2>

        <div className="grid gap-6 md:grid-cols-2">
          {/* Step 1 */}
          <Card>
            <CardContent className="pt-6 space-y-4">
              <div className="bg-primary/10 text-primary rounded-full w-8 h-8 flex items-center justify-center font-semibold">
                1
              </div>
              <CardTitle className="text-xl">Generate Your API Key</CardTitle>
              <CardDescription className="text-base">
                Create your unique API key above. Keep this secure as it
                provides access to your Google Reviews data.
              </CardDescription>
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
                Find your Google Place ID in Google Maps or Business Profile and
                add it to your configuration.
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
              <CardTitle className="text-xl">Integrate in Your Build</CardTitle>
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
      </section>
    </div>
  );
}
