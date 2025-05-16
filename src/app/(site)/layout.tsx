import Navigation from "@/components/structure/header/navigation";
import Footer from "@/components/structure/footer";

export default function SiteLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <Navigation noAuth />
      <main className="grow flex flex-col">{children}</main>
      <Footer />
    </>
  );
}
