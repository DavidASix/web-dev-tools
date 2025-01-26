import Navigation from "@/components/structure/Navigation";
import Footer from "@/components/structure/Footer";

export default function ProductLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <Navigation />
      <main>{children}</main>
      <Footer />
    </>
  );
}
