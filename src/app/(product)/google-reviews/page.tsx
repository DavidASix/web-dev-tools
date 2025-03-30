"use client";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { ClipboardCopyIcon } from "lucide-react";
import axios from "axios";
import { toast } from "sonner";
import { z } from "zod";
import { LoadingSpinner } from "@/components/ui/custom/loading-spinner";

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
    <>
    <section className="grow section flex">
      <div className="grow content text-center flex flex-col justify-center items-center">
      <h1 className="text-4xl font-bold mb-4">Google Reviews</h1>
      <p className="text-lg text-muted-foreground">
        You have some great Google Reviews, so why aren&apos;t you displaying them?
        This application allows you to integrate your Google Reviews as a data
        source in a statically generated website. Your reviews will be fetched
        then baked into your sites HTML, so they are available to search engines
        and users without needing to make a request to the Google API.
      </p>
      </div>
      </section>

    <section className="grow section flex">
    <div className="grow content text-center flex flex-col justify-center items-center">
      <Button
        variant="outline"
        className="flex gap-8 items-center justify-center border rounded-md"
        onClick={copyApiKey}
        disabled={apiKey.isLoading}
      >
        {apiKey.isLoading ? (
          <LoadingSpinner size={16} className="mr-2" />
        ) : (
          <>
            <span>{apiKeyText}</span>
            <ClipboardCopyIcon className="w-4 h-4" />
          </>
        )}
      </Button>
      <Button
        disabled={generateKeyMutation.isPending || apiKey.isLoading}
        onClick={generateApiKey}
        className="flex items-center"
      >
        {generateKeyMutation.isPending ? (
          <>
            <LoadingSpinner size={16} className="mr-2" />
            <span>Generating...</span>
          </>
        ) : (
          "Generate API Key"
        )}
      </Button>
    </div>
    </section>
    </>
  );
}
