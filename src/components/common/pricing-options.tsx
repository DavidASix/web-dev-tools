import Link from "next/link";
import Stripe from "stripe";
import { loadStripe } from "@stripe/stripe-js";
import { toast } from "sonner";
import { CheckCircle2 } from "lucide-react";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import requests from "@/lib/requests";
import checkoutContextSchema from "@/app/api/purchases/initialize-checkout/schema";

export default function PricingOptions() {
  const onClickCheckout = async () => {
    try {
      const checkout = await requests.post(checkoutContextSchema, {
        product: "all_access",
      });
      const session = checkout.session satisfies Stripe.Checkout.Session;
      const stripe = await loadStripe(
        process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!,
      );
      if (!session.id || !stripe) {
        throw new Error("Error initializing checkout session or Stripe");
      }
      await stripe.redirectToCheckout({ sessionId: session.id });
    } catch (error) {
      console.error("Checkout error:", error);
      toast.error("Failed to initiate checkout. Please try again later.");
    }
  };

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h2 className="text-3xl font-bold mb-3">(fantastic) Pricing</h2>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Statically generated review integrations for one low price
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-2">
        {/* Individual Tool Pricing */}
        {/* Pro Subscription */}
        <Card className="border-primary relative">
          <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground px-4 py-1 rounded-full text-sm font-medium">
            Most Popular
          </div>
          <CardHeader>
            <CardTitle>All Access</CardTitle>
            <CardDescription>Access to all tools</CardDescription>
            <div className="mt-4">
              <span className="text-3xl font-bold">$8.99</span>
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
                <span>30,000 API requests</span>
              </li>
              <li className="flex items-center">
                <CheckCircle2 className="w-5 h-5 text-primary mr-2" />
                <span>50 AI Credits per month</span>
              </li>
              <li className="flex items-center">
                <CheckCircle2 className="w-5 h-5 text-primary mr-2" />
                <span>Email support</span>
              </li>
              <li className="flex items-center">
                <CheckCircle2 className="w-5 h-5 text-primary mr-2" />
                <span>Instant access to new tools</span>
              </li>
            </ul>
          </CardContent>
          <CardFooter>
            <Button className="w-full" onClick={onClickCheckout}>
              Subscribe Now
            </Button>
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
                <span>30,000+ API requests</span>
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
            <Button variant="outline" className="w-full" asChild>
              <Link href="mailto:david@redoxfordonline.com?subject=Enterprise Level ssg.tools&body=Hello, I'm interested in getting more information about an enterprise level agreement to ssg.tools">
                Contact Sales
              </Link>
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
