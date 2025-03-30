import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle2 } from "lucide-react";

export default function PricingOptions() {
  return (
    <section className="space-y-8">
      <div className="text-center">
        <h2 className="text-3xl font-bold mb-3">Flexible Pricing Options</h2>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Choose what works best for your needs and budget
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {/* Individual Tool Pricing */}
        <Card>
          <CardHeader>
            <CardTitle>Individual Tools</CardTitle>
            <CardDescription>Pay for only what you need</CardDescription>
            <div className="mt-4">
              <span className="text-3xl font-bold">$9.99</span>
              <span className="text-muted-foreground ml-2">per tool/month</span>
            </div>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              <li className="flex items-center">
                <CheckCircle2 className="w-5 h-5 text-primary mr-2" />
                <span>Full access to single tool</span>
              </li>
              <li className="flex items-center">
                <CheckCircle2 className="w-5 h-5 text-primary mr-2" />
                <span>Unlimited API requests</span>
              </li>
              <li className="flex items-center">
                <CheckCircle2 className="w-5 h-5 text-primary mr-2" />
                <span>Email support</span>
              </li>
            </ul>
          </CardContent>
          <CardFooter>
            <Button variant="outline" className="w-full">
              Choose a Tool
            </Button>
          </CardFooter>
        </Card>

        {/* Pro Subscription */}
        <Card className="border-primary relative">
          <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground px-4 py-1 rounded-full text-sm font-medium">
            Most Popular
          </div>
          <CardHeader>
            <CardTitle>Pro Subscription</CardTitle>
            <CardDescription>Access to all tools at a discount</CardDescription>
            <div className="mt-4">
              <span className="text-3xl font-bold">$24.99</span>
              <span className="text-muted-foreground ml-2">per month</span>
            </div>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              <li className="flex items-center">
                <CheckCircle2 className="w-5 h-5 text-primary mr-2" />
                <span>Access to all tools</span>
              </li>
              <li className="flex items-center">
                <CheckCircle2 className="w-5 h-5 text-primary mr-2" />
                <span>Unlimited API requests</span>
              </li>
              <li className="flex items-center">
                <CheckCircle2 className="w-5 h-5 text-primary mr-2" />
                <span>Priority support</span>
              </li>
              <li className="flex items-center">
                <CheckCircle2 className="w-5 h-5 text-primary mr-2" />
                <span>Early access to new features</span>
              </li>
            </ul>
          </CardContent>
          <CardFooter>
            <Button className="w-full">Subscribe Now</Button>
          </CardFooter>
        </Card>

        {/* Enterprise */}
        <Card>
          <CardHeader>
            <CardTitle>Enterprise</CardTitle>
            <CardDescription>Custom solutions for larger teams</CardDescription>
            <div className="mt-4">
              <span className="text-3xl font-bold">Custom</span>
              <span className="text-muted-foreground ml-2">pricing</span>
            </div>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              <li className="flex items-center">
                <CheckCircle2 className="w-5 h-5 text-primary mr-2" />
                <span>All Pro features</span>
              </li>
              <li className="flex items-center">
                <CheckCircle2 className="w-5 h-5 text-primary mr-2" />
                <span>Dedicated support manager</span>
              </li>
              <li className="flex items-center">
                <CheckCircle2 className="w-5 h-5 text-primary mr-2" />
                <span>Custom integrations</span>
              </li>
              <li className="flex items-center">
                <CheckCircle2 className="w-5 h-5 text-primary mr-2" />
                <span>Service level agreement</span>
              </li>
            </ul>
          </CardContent>
          <CardFooter>
            <Button variant="outline" className="w-full">
              Contact Sales
            </Button>
          </CardFooter>
        </Card>
      </div>
    </section>
  );
}
