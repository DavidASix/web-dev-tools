"use client";

import { Button } from "@/components/ui/button";
import ProductLayout from "./layout";
import { useState, useEffect } from "react";
import { ClipboardCopyIcon } from "lucide-react";
import axios from "axios";
import { toast } from "sonner";

export default function Dashboard() {
  const [apiKey, setApiKey] = useState<string | null>(null);
  const [loadingKey, setLoadingKey] = useState<boolean>(true);

  useEffect(() => {
    const fetchLatestActiveKey = async () => {
      try {
        const { data } = await axios.get("/api/security/get-latest-active-key");
        console.log(data);
        if (data.apiKey) {
          setApiKey(data.apiKey);
        }
      } catch (error) {
        console.error("Error fetching active API key count:", error);
        toast.error("Error fetching active API key count");
      } finally {
        setLoadingKey(false);
      }
    };
    fetchLatestActiveKey();
  }, []);

  const generateApiKey = async () => {
    try {
      setLoadingKey(true);
      const { data } = await axios.get("/api/security/generate-api-key");
      setApiKey(data.key);
      toast.success("API key generated successfully");
      setTimeout(() => {
        copyApiKey();
      }, 500);
    } catch (error) {
      console.error("Error generating API key:", error);
      toast.error("Error generating API key");
    } finally {
      setLoadingKey(false);
    }
  };

  const copyApiKey = () => {
    navigator.clipboard.writeText(apiKey ?? "");
    toast.success("API key copied to clipboard");
  };

  const apiKeyText = loadingKey
    ? "Fetching..."
    : apiKey
      ? `${apiKey.slice(0, 8)}************************`
      : "Generate a key below";

  return (
    <ProductLayout>
      <div className="min-h-screen p-8">
        <h1 className="text-4xl font-bold mb-4">Welcome to your Dashboard</h1>
        <p className="text-lg text-muted-foreground">
          This is where you'll manage your Google Reviews integration.
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
    </ProductLayout>
  );
}
