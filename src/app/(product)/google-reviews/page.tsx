"use client";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { ClipboardCopyIcon } from "lucide-react";
import axios from "axios";
import { toast } from "sonner";
import { z } from "zod";

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
      await axios.get("/api/security/generate-api-key");
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
    <div className="min-h-screen p-8">
      <h1 className="text-4xl font-bold mb-4">Welcome to your Dashboard</h1>
      <p className="text-lg text-muted-foreground">
        This is where you will manage your Google Reviews integration.
      </p>
      <Button
        variant="outline"
        className="flex gap-8 items-center justify-center border rounded-md"
        onClick={copyApiKey}
      >
        <span>{apiKeyText}</span>
        <ClipboardCopyIcon className="w-4 h-4" />
      </Button>
      <Button onClick={generateApiKey}>Generate API Key</Button>
    </div>
  );
}
