"use client";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { ClipboardCopyIcon, Info } from "lucide-react";
import axios from "axios";
import { toast } from "sonner";
import { z } from "zod";
import { LoadingSpinner } from "@/components/ui/custom/loading-spinner";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function GoogleReviewPage() {
  const apiKey = useQuery({
    queryKey: ["apiKey"],
    queryFn: async () => {
      const { data } = await axios.get("/api/security/get-latest-active-key");
      const parsed = z.object({ apiKey: z.string() }).parse(data);
      if (!parsed) {
        throw new Error("No API key found");
      }
      return parsed;
    },
    meta: {
      errorMessage: "Failed to fetch API key",
    },
  });

  const generateKeyMutation = useMutation({
    mutationFn: async () => {
      await axios.get("/api/security/create-api-key");
    },
    onSuccess: () => {
      toast.success("API key generated successfully");
      apiKey.refetch();
    },
    onError: (error) => {
      console.log("Error generating API key:", error);
      toast.error("Error generating API key");
    },
  });

  const generateApiKey = () => {
    generateKeyMutation.mutate();
  };

  const copyApiKey = () => {
    navigator.clipboard.writeText(apiKey.data?.apiKey ?? "");
    toast.success("API key copied to clipboard");
  };

  const apiKeyText = apiKey.isLoading
    ? "Fetching..."
    : apiKey.data
      ? `${apiKey.data.apiKey.slice(0, 8)}************************`
      : "Generate a key below";

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

      {/* API Key Card */}
      <Card>
        <CardHeader>
          <CardTitle>Your API Key</CardTitle>
          <CardDescription>
            This key allows your website to securely fetch reviews from our
            service.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center space-x-4">
            <div className="flex-1 bg-muted p-3 rounded-md font-mono text-sm overflow-hidden">
              {apiKey.isLoading ? (
                <Skeleton className="h-6 w-full" />
              ) : (
                <span>{apiKeyText}</span>
              )}
            </div>
            <Button
              variant="outline"
              size="icon"
              onClick={copyApiKey}
              disabled={apiKey.isLoading || !apiKey.data}
              title="Copy API key"
            >
              <ClipboardCopyIcon className="w-4 h-4" />
            </Button>
          </div>

          <Button
            className="w-full"
            disabled={generateKeyMutation.isPending || apiKey.isLoading}
            onClick={generateApiKey}
          >
            {generateKeyMutation.isPending ? (
              <div className="flex items-center">
                <LoadingSpinner size={16} className="mr-2" />
                <span>Generating new key...</span>
              </div>
            ) : (
              "Generate New API Key"
            )}
          </Button>
        </CardContent>
        <CardFooter>
          <div className="flex items-start text-sm text-muted-foreground bg-muted/50 p-3 rounded-md w-full">
            <Info className="w-4 h-4 mr-2 mt-0.5 flex-shrink-0" />
            <p>
              Generating a new key will invalidate any existing keys. Only use
              this if your current key has been compromised.
            </p>
          </div>
        </CardFooter>
      </Card>

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
