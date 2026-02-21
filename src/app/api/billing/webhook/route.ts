import { NextRequest, NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { getPlanFromPriceId } from "@/lib/stripe";
import { prisma } from "@/lib/db";
import {
  sendFailedPaymentEmail,
  sendWelcomeUpgradeEmail,
} from "@/lib/email";
import type Stripe from "stripe";
import type { Plan, SubscriptionStatus } from "@prisma/client";

// Stripe sends raw body — must NOT use json body parser
export const runtime = "nodejs";

const STRIPE_MAP: Record<string, SubscriptionStatus> = {
  trialing: "TRIALING",
  active: "ACTIVE",
  past_due: "PAST_DUE",
  canceled: "CANCELED",
  incomplete: "INCOMPLETE",
  incomplete_expired: "INCOMPLETE_EXPIRED",
  unpaid: "UNPAID",
  paused: "PAUSED",
};

export async function POST(req: NextRequest) {
  const body = await req.text();
  const signature = req.headers.get("stripe-signature");

  if (!signature) {
    return NextResponse.json({ error: "Missing stripe-signature" }, { status: 400 });
  }

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Unknown error";
    console.error(`Webhook signature verification failed: ${msg}`);
    return NextResponse.json({ error: `Webhook error: ${msg}` }, { status: 400 });
  }

  // Idempotency check — skip already-processed events
  const existingPayment = await prisma.payment.findFirst({
    where: { stripeInvoiceId: event.id },
  });
  if (existingPayment) {
    return NextResponse.json({ received: true, skipped: "duplicate" });
  }

  try {
    switch (event.type) {
      // ─── Checkout Completed ─────────────────────────────────────────────
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;
        const userId = session.metadata?.userId;
        const plan = session.metadata?.plan;
        if (!userId || !plan) break;

        const stripeSubscriptionId = session.subscription as string;
        const stripeCustomerId = session.customer as string;

        const sub = await stripe.subscriptions.retrieve(stripeSubscriptionId);
        const priceId = sub.items.data[0]?.price?.id;

        await prisma.subscription.update({
          where: { userId },
          data: {
            plan: plan.toUpperCase() as Plan,
            status: STRIPE_MAP[sub.status] ?? "ACTIVE",
            stripeCustomerId,
            stripeSubscriptionId,
            stripePriceId: priceId,
            stripeCurrentPeriodEnd: new Date(sub.current_period_end * 1000),
            trialEndsAt: sub.trial_end ? new Date(sub.trial_end * 1000) : null,
          },
        });

        // Welcome email
        const user = await prisma.user.findUnique({ where: { id: userId } });
        if (user?.email) {
          await sendWelcomeUpgradeEmail(
            user.email,
            user.name ?? "there",
            plan.charAt(0).toUpperCase() + plan.slice(1)
          );
        }
        break;
      }

      // ─── Subscription Updated (plan change, renewal) ─────────────────────
      case "customer.subscription.updated": {
        const sub = event.data.object as Stripe.Subscription;
        const userId = sub.metadata?.userId;
        if (!userId) break;

        const priceId = sub.items.data[0]?.price?.id;
        const planName = getPlanFromPriceId(priceId ?? "");

        await prisma.subscription.update({
          where: { userId },
          data: {
            plan: planName.toUpperCase() as Plan,
            status: STRIPE_MAP[sub.status] ?? "ACTIVE",
            stripePriceId: priceId,
            stripeCurrentPeriodEnd: new Date(sub.current_period_end * 1000),
            stripeCancelAtPeriodEnd: sub.cancel_at_period_end,
            trialEndsAt: sub.trial_end ? new Date(sub.trial_end * 1000) : null,
          },
        });
        break;
      }

      // ─── Subscription Deleted/Canceled ───────────────────────────────────
      case "customer.subscription.deleted": {
        const sub = event.data.object as Stripe.Subscription;
        const userId = sub.metadata?.userId;
        if (!userId) break;

        await prisma.subscription.update({
          where: { userId },
          data: {
            plan: "FREE",
            status: "CANCELED",
            stripeSubscriptionId: null,
            stripePriceId: null,
            canceledAt: new Date(),
          },
        });
        break;
      }

      // ─── Invoice Paid ────────────────────────────────────────────────────
      case "invoice.paid": {
        const invoice = event.data.object as Stripe.Invoice;
        const customerId = invoice.customer as string;

        const sub = await prisma.subscription.findUnique({
          where: { stripeCustomerId: customerId },
          include: { user: true },
        });
        if (!sub) break;

        await prisma.payment.create({
          data: {
            subscriptionId: sub.id,
            stripeInvoiceId: invoice.id,
            stripePaymentIntentId: invoice.payment_intent as string,
            amount: invoice.amount_paid,
            currency: invoice.currency,
            status: "paid",
            paidAt: new Date(invoice.status_transitions.paid_at! * 1000),
          },
        });

        // Reactivate if was past_due
        if (sub.status === "PAST_DUE") {
          await prisma.subscription.update({
            where: { id: sub.id },
            data: { status: "ACTIVE" },
          });
        }
        break;
      }

      // ─── Invoice Payment Failed (Dunning) ─────────────────────────────────
      case "invoice.payment_failed": {
        const invoice = event.data.object as Stripe.Invoice;
        const customerId = invoice.customer as string;
        const attemptCount = invoice.attempt_count;

        const sub = await prisma.subscription.findUnique({
          where: { stripeCustomerId: customerId },
          include: { user: true },
        });
        if (!sub) break;

        await prisma.subscription.update({
          where: { id: sub.id },
          data: { status: "PAST_DUE" },
        });

        // Record failed payment
        await prisma.payment.create({
          data: {
            subscriptionId: sub.id,
            stripeInvoiceId: invoice.id,
            amount: invoice.amount_due,
            currency: invoice.currency,
            status: "failed",
            failureReason: "Payment method declined",
          },
        });

        // Send dunning email
        if (sub.user?.email && sub.stripeCustomerId) {
          const portalSession = await stripe.billingPortal.sessions.create({
            customer: sub.stripeCustomerId,
            return_url: `${process.env.NEXT_PUBLIC_APP_URL}/settings/billing`,
          });

          await sendFailedPaymentEmail(
            sub.user.email,
            sub.user.name ?? "there",
            `$${(invoice.amount_due / 100).toFixed(2)}`,
            portalSession.url,
            attemptCount
          );
        }
        break;
      }

      default:
        // Unhandled event — no-op
        break;
    }
  } catch (err) {
    console.error("Webhook handler error:", err);
    return NextResponse.json({ error: "Webhook handler failed" }, { status: 500 });
  }

  return NextResponse.json({ received: true });
}
