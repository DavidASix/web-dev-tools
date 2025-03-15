import type { Metadata } from "next";
import Navigation from "@/components/structure/header/navigation";
import Footer from "@/components/structure/footer";

export const metadata: Metadata = {
  title: "Google Reviews for Devs",
};

export default function SiteLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <Navigation noAuth />
      <main>{children}</main>
      <Footer />
    </>
  );
}
