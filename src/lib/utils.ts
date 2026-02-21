import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { randomBytes } from "crypto";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function generateToken(): string {
  return randomBytes(32).toString("hex");
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export function formatDate(date: Date | string): string {
  return new Date(date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export function formatCurrency(
  amount: number,
  currency: string = "usd"
): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: currency.toUpperCase(),
    minimumFractionDigits: 0,
  }).format(amount / 100);
}

export function getMonthStart(): Date {
  const now = new Date();
  return new Date(now.getFullYear(), now.getMonth(), 1);
}

// Safe JSON parse with fallback
export function safeParseJSON<T>(str: string, fallback: T): T {
  try {
    return JSON.parse(str) as T;
  } catch {
    return fallback;
  }
}

export function truncate(str: string, length: number): string {
  if (str.length <= length) return str;
  return str.slice(0, length) + "…";
}

export const DOCUMENT_TYPE_LABELS: Record<string, string> = {
  PRIVACY_POLICY: "Privacy Policy",
  TERMS_OF_SERVICE: "Terms of Service",
  NDA: "NDA / Confidentiality Agreement",
  CLIENT_CONTRACT: "Client Contract",
  FREELANCER_AGREEMENT: "Freelancer Agreement",
  COOKIE_POLICY: "Cookie Policy",
  EMPLOYMENT_CONTRACT: "Employment Contract",
  REFUND_POLICY: "Refund Policy",
};

export const DOCUMENT_TYPE_SLUGS: Record<string, string> = {
  PRIVACY_POLICY: "privacy-policy",
  TERMS_OF_SERVICE: "terms-of-service",
  NDA: "nda",
  CLIENT_CONTRACT: "client-contract",
  FREELANCER_AGREEMENT: "freelancer-agreement",
  COOKIE_POLICY: "cookie-policy",
  EMPLOYMENT_CONTRACT: "employment-contract",
  REFUND_POLICY: "refund-policy",
};

export const SLUG_TO_DOC_TYPE: Record<string, string> = Object.fromEntries(
  Object.entries(DOCUMENT_TYPE_SLUGS).map(([k, v]) => [v, k])
);
