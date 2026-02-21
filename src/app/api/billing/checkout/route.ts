import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/db";
import { stripe, STRIPE_PRICE_IDS } from "@/lib/stripe";
import type { BillingInterval } from "@/lib/stripe";

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const { plan, interval = "monthly" } = body as {
    plan: "starter" | "pro" | "business";
    interval: BillingInterval;
  };

  if (!plan || !STRIPE_PRICE_IDS[plan]) {
    return NextResponse.json({ error: "Invalid plan" }, { status: 400 });
  }

  const priceId = STRIPE_PRICE_IDS[plan][interval];
  if (!priceId) {
    return NextResponse.json({ error: "Price not configured" }, { status: 400 });
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    include: { subscription: true },
  });

  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  // Get or create Stripe customer
  let stripeCustomerId = user.subscription?.stripeCustomerId;

  if (!stripeCustomerId) {
    const customer = await stripe.customers.create({
      email: user.email!,
      name: user.name ?? undefined,
      metadata: { userId: user.id },
    });
    stripeCustomerId = customer.id;

    await prisma.subscription.update({
      where: { userId: user.id },
      data: { stripeCustomerId },
    });
  }

  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";

  const checkoutSession = await stripe.checkout.sessions.create({
    customer: stripeCustomerId,
    mode: "subscription",
    payment_method_types: ["card"],
    line_items: [{ price: priceId, quantity: 1 }],
    subscription_data: {
      trial_period_days: 14,
      metadata: { userId: user.id, plan },
    },
    allow_promotion_codes: true,
    billing_address_collection: "required", // important for international
    tax_id_collection: { enabled: true },   // VAT/GST compliance
    automatic_tax: { enabled: true },
    success_url: `${appUrl}/dashboard?upgraded=1`,
    cancel_url: `${appUrl}/pricing?canceled=1`,
    metadata: { userId: user.id, plan, interval },
  });

  return NextResponse.json({ url: checkoutSession.url });
}
