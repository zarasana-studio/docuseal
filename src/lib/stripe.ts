import Stripe from "stripe";

if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error("STRIPE_SECRET_KEY is not set");
}

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: "2024-12-18.acacia",
  typescript: true,
  appInfo: {
    name: "DocuSeal",
    version: "1.0.0",
  },
});

// Plan → Stripe Price ID mapping
export const STRIPE_PRICE_IDS = {
  starter: {
    monthly: process.env.STRIPE_STARTER_MONTHLY_PRICE_ID!,
    yearly: process.env.STRIPE_STARTER_YEARLY_PRICE_ID!,
  },
  pro: {
    monthly: process.env.STRIPE_PRO_MONTHLY_PRICE_ID!,
    yearly: process.env.STRIPE_PRO_YEARLY_PRICE_ID!,
  },
  business: {
    monthly: process.env.STRIPE_BUSINESS_MONTHLY_PRICE_ID!,
    yearly: process.env.STRIPE_BUSINESS_YEARLY_PRICE_ID!,
  },
} as const;

export type BillingInterval = "monthly" | "yearly";

export function getPlanFromPriceId(priceId: string): string {
  for (const [plan, ids] of Object.entries(STRIPE_PRICE_IDS)) {
    if (Object.values(ids).includes(priceId as never)) return plan;
  }
  return "free";
}

// Supported currencies by country (for reference)
export const CURRENCY_BY_COUNTRY: Record<string, string> = {
  IN: "inr",
  US: "usd",
  GB: "gbp",
  EU: "eur",
  AU: "aud",
  CA: "cad",
  SG: "sgd",
  AE: "aed",
  // Stripe supports 135+ currencies automatically
};
