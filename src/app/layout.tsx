import "tailwindcss/tailwind.css";
import "./globals.css";
import { SessionProvider } from "next-auth/react";
import HolyLoader from "holy-loader";

import { Toaster } from "@/components/ui/sonner";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <SessionProvider>
        <body>
          <HolyLoader />
          {children}
          <Toaster />
        </body>
      </SessionProvider>
    </html>
  );
}
