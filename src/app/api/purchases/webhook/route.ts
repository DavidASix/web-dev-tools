import { NextResponse } from 'next/server';
import { headers } from 'next/headers';
import { db } from '@/src/schema/db';
import { payments } from '@/src/schema/schema';
import { stripe } from '@/src/lib/server/stripe';
import type Stripe from 'stripe';
import { eq, and, isNotNull } from 'drizzle-orm';

// Define an interface for expected session metadata
interface CheckoutSessionMetadata extends Stripe.Metadata {
  userId?: string;
}

// Helper function for User ID Determination
async function determineUserId(session: Stripe.Checkout.Session, dbInstance: typeof db): Promise<string | null> {
  const metadata = session.metadata as CheckoutSessionMetadata | null;
  if (metadata?.userId) {
    console.log(`User ID found in session metadata: ${metadata.userId} for session ${session.id}`);
    return metadata.userId;
  }

  const stripeCustomerId = typeof session.customer === 'string' ? session.customer : session.customer?.id;
  if (stripeCustomerId) {
    console.log(`User ID not in metadata for session ${session.id}. Attempting lookup with stripe_customer_id: ${stripeCustomerId}`);
    try {
      const existingPayments = await dbInstance
        .select({ userId: payments.user_id })
        .from(payments)
        .where(and(eq(payments.stripe_customer_id, stripeCustomerId), isNotNull(payments.user_id)))
        .limit(1)
        .execute();

      if (existingPayments[0]?.userId) {
        console.log(`User ID found via database lookup: ${existingPayments[0].userId} for stripe_customer_id: ${stripeCustomerId}`);
        return existingPayments[0].userId;
      }
      console.log(`No existing payment record found with user_id for stripe_customer_id: ${stripeCustomerId}`);
    } catch (lookupError) {
      const errorMessage = lookupError instanceof Error ? lookupError.message : 'Unknown database error';
      console.error(`Error looking up user_id for stripe_customer_id ${stripeCustomerId}: ${errorMessage}`);
      // Do not throw here, let it return null so main handler can decide
    }
  } else {
    console.log(`Stripe customer ID is null or undefined for session ${session.id}. Cannot perform DB lookup for user_id.`);
  }
  return null;
}

// Helper function for Processing Payment
async function processPayment(session: Stripe.Checkout.Session, userId: string, dbInstance: typeof db): Promise<NextResponse | null> {
  try {
    const sessionWithLineItems = await stripe.checkout.sessions.retrieve(
      session.id,
      { expand: ['line_items'] }
    );
    const lineItems = sessionWithLineItems.line_items;
    const metadata = session.metadata as CheckoutSessionMetadata | null;

    const paymentData = {
      user_id: userId,
      stripe_customer_id: typeof session.customer === 'string' ? session.customer : (session.customer?.id || null),
      stripe_payment_intent_id: typeof session.payment_intent === 'string' ? session.payment_intent : null,
      stripe_checkout_session_id: session.id,
      status: session.status,
      amount_total: session.amount_total,
      currency: session.currency,
      payment_status: session.payment_status,
      line_items: lineItems ? JSON.parse(JSON.stringify(lineItems)) : null,
      metadata: metadata ? JSON.parse(JSON.stringify(metadata)) : null,
    };

    await dbInstance.insert(payments).values(paymentData);
    console.log(`Payment record created for checkout session: ${session.id} with user_id: ${userId}`);
    return null; // Indicates success
  } catch (dbErr) {
    const errorMessage = dbErr instanceof Error ? dbErr.message : 'Unknown database error during payment processing';
    console.error(`Error processing checkout session ${session.id} after determining user_id: ${errorMessage}`);
    return NextResponse.json({ error: `Database error: ${errorMessage}` }, { status: 500 });
  }
}

// Main POST Handler
export async function POST(request: Request) {
  const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!endpointSecret) {
    console.error('STRIPE_WEBHOOK_SECRET is not set.');
    return NextResponse.json({ error: 'Server configuration error: Webhook secret not set.' }, { status: 500 });
  }

  const signature = headers().get('stripe-signature');
  if (!signature) {
    console.error('Stripe signature missing from request headers.');
    return NextResponse.json({ error: 'Stripe signature missing.' }, { status: 400 });
  }

  const body = await request.text();
  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(body, signature, endpointSecret);
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : 'Unknown error during event construction';
    console.error(`Webhook signature verification failed: ${errorMessage}`);
    return NextResponse.json({ error: `Webhook error: ${errorMessage}` }, { status: 400 });
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session;

    const userId = await determineUserId(session, db);

    if (!userId) {
      const finalStripeCustomerId = session.customer ? (typeof session.customer === 'string' ? session.customer : session.customer.id) : 'N/A';
      console.error(`Critical: Could not determine user_id for stripe_customer_id: ${finalStripeCustomerId} and checkout_session_id: ${session.id}. Payment record cannot be saved.`);
      // TODO: Implement developer alert email for missing user_id.
      return NextResponse.json({ error: 'Critical: user_id could not be determined. Payment processing failed.' }, { status: 500 });
    }

    const paymentProcessingErrorResponse = await processPayment(session, userId, db);
    if (paymentProcessingErrorResponse) {
      return paymentProcessingErrorResponse;
    }

  } else {
    console.log(`Received unhandled event type: ${event.type}`);
  }

  return NextResponse.json({ message: 'Webhook processed successfully' }, { status: 200 });
}
