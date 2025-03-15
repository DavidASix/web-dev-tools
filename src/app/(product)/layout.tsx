import Navigation from "@/components/structure/header/navigation";

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
