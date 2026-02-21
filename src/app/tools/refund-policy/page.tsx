import type { Metadata } from "next";
import { DocumentToolUI } from "@/components/tool/DocumentToolUI";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Free Refund Policy Generator | DocuSeal",
  description:
    "Generate a professional refund and return policy for your business in 60 seconds. Free PDF download. Trusted by e-commerce stores and SaaS companies.",
  alternates: { canonical: "/tools/refund-policy" },
};
const FIELDS = [
  {
    key: "businessName",
    label: "Business Name",
    required: true,
    placeholder: "Acme Inc.",
  },
  {
    key: "productType",
    label: "Type of product/service",
    type: "select" as const,
    options: [
      "Physical products",
      "Digital products / Downloads",
      "SaaS / Software subscription",
      "Services / Consulting",
      "Online courses",
      "Mixed (physical + digital)",
    ],
    required: true,
  },
  {
    key: "refundWindow",
    label: "Refund window",
    type: "select" as const,
    options: [
      "7 days",
      "14 days",
      "30 days",
      "60 days",
      "90 days",
      "No refunds",
    ],
  },
  {
    key: "conditions",
    label: "Conditions for refund",
    type: "textarea" as const,
    placeholder:
      "Unused, in original packaging; or within 30 days of purchase for digital…",
  },
  {
    key: "contactEmail",
    label: "Support/refund contact email",
    required: true,
    placeholder: "support@yoursite.com",
  },
];
export default function RefundPolicyPage() {
  return (
    <div className="min-h-screen bg-background">
      <header className="fixed top-0 left-0 right-0 z-50 glass border-b border-border">
        <div className="max-w-7xl mx-auto px-4 h-14 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg gradient-primary flex items-center justify-center text-white font-bold text-xs">
              D
            </div>
            <span className="font-bold">DocuSeal</span>
          </Link>
          <Link
            href="/signup"
            className="text-sm bg-primary text-primary-foreground px-3 py-1.5 rounded-lg font-medium"
          >
            Get Started Free
          </Link>
        </div>
      </header>
      <main className="pt-20 pb-20 px-4">
        <div className="max-w-6xl mx-auto">
          <nav className="text-sm text-muted-foreground mb-6 pt-6">
            <Link href="/" className="hover:text-foreground">
              Home
            </Link>
            <span className="mx-2">/</span>
            <span className="text-foreground">Refund Policy Generator</span>
          </nav>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
            <div className="lg:col-span-7">
              <h1 className="text-3xl font-bold text-foreground mb-2">
                Free Refund Policy Generator
              </h1>
              <p className="text-muted-foreground mb-8">
                Build customer trust with a clear, professional refund and
                return policy tailored to your business type.
              </p>
              <div className="bg-card border border-border rounded-2xl p-6">
                <DocumentToolUI
                  slug="refund-policy"
                  documentType="REFUND_POLICY"
                  title="Refund Policy"
                  description=""
                  seoDescription=""
                  fields={FIELDS}
                />
              </div>
            </div>
            <div className="lg:col-span-5">
              <div className="bg-card border border-border rounded-2xl p-6">
                <h2 className="font-semibold mb-4">What&apos;s included</h2>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  {[
                    "Eligibility for refunds",
                    "How to request a refund",
                    "Refund processing timeline",
                    "Exceptions and exclusions",
                    "Exchanges vs refunds",
                    "Contact information",
                    "Consumer rights notice",
                  ].map((i) => (
                    <li key={i} className="flex gap-2">
                      <span className="text-green-500">✓</span>
                      {i}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
