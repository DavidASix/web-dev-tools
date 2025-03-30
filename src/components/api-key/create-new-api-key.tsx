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

export default function CreateNewApiKey() {
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
  );
}
