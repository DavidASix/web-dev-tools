import ProductLayout from "./layout";

export default function Dashboard() {
  return (
    <ProductLayout>
      <div className="min-h-screen p-8">
        <h1 className="text-4xl font-bold mb-4">Welcome to your Dashboard</h1>
        <p className="text-lg text-muted-foreground">
          This is where you'll manage your Google Reviews integration.
        </p>
      </div>
    </ProductLayout>
  );
}
