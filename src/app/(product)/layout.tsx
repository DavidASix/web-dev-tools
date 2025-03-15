import Navigation from "@/components/structure/navigation";

export default function ProductLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <Navigation />
      <main>{children}</main>
    </>
  );
}
