"use client";
import {
  QueryClient,
  QueryClientProvider,
  QueryCache,
} from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { toast } from "sonner";
import Navigation from "@/components/structure/header/navigation";

const queryClient = new QueryClient({
  queryCache: new QueryCache({
    onError: (error, query) => {
      console.error("Query error:", error);
      const message =
        query?.meta?.errorMessage ?? error.message ?? "An error occurred";
      toast.error(`Something went wrong: ${message}`);
    },
  }),
});

export default function ProductLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <QueryClientProvider client={queryClient}>
        <ReactQueryDevtools />
        <Navigation />
        <main>{children}</main>
      </QueryClientProvider>
    </>
  );
}
