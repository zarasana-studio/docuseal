import type { Metadata } from "next";
import { DocumentToolUI } from "@/components/tool/DocumentToolUI";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Free Terms of Service Generator | DocuSeal",
  description:
    "Generate a free terms of service agreement for your website, app, or SaaS in 60 seconds. AI-powered. Download as PDF.",
  keywords: [
    "free terms of service generator",
    "terms and conditions generator",
    "TOS template",
  ],
  alternates: { canonical: "/tools/terms-of-service" },
};

const FIELDS = [
  {
    key: "businessName",
    label: "Business / App Name",
    placeholder: "Acme Inc.",
    required: true,
  },
  {
    key: "websiteUrl",
    label: "Website URL",
    placeholder: "https://yoursite.com",
    required: true,
  },
  {
    key: "serviceDescription",
    label: "What does your service do?",
    placeholder: "A SaaS tool that helps teams manage projects…",
    type: "textarea" as const,
    required: true,
  },
  {
    key: "jurisdiction",
    label: "Governing Law",
    type: "select" as const,
    options: [
      "United States (Delaware)",
      "United States (California)",
      "United Kingdom",
      "European Union",
      "Canada",
      "Australia",
      "India",
      "Singapore",
    ],
  },
  {
    key: "paymentTerms",
    label: "Payment model",
    type: "select" as const,
    options: [
      "Free product",
      "One-time payment",
      "Subscription / SaaS",
      "Marketplace",
      "Freemium",
    ],
  },
  {
    key: "contactEmail",
    label: "Legal contact email",
    placeholder: "legal@yoursite.com",
    required: true,
  },
];

export default function ToSGeneratorPage() {
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
          <div className="flex gap-3">
            <Link
              href="/login"
              className="text-sm text-muted-foreground hover:text-foreground"
            >
              Sign in
            </Link>
            <Link
              href="/signup"
              className="text-sm bg-primary text-primary-foreground px-3 py-1.5 rounded-lg font-medium"
            >
              Get Started Free
            </Link>
          </div>
        </div>
      </header>
      <main className="pt-20 pb-20 px-4">
        <div className="max-w-6xl mx-auto">
          <nav className="text-sm text-muted-foreground mb-6 pt-6">
            <Link href="/" className="hover:text-foreground">
              Home
            </Link>
            <span className="mx-2">/</span>
            <span className="text-foreground">Terms of Service Generator</span>
          </nav>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
            <div className="lg:col-span-7">
              <h1 className="text-3xl font-bold text-foreground mb-2">
                Free Terms of Service Generator
              </h1>
              <p className="text-muted-foreground mb-8">
                Create a professional, legally comprehensive terms of service
                agreement for your website or app in 60 seconds.
              </p>
              <div className="bg-card border border-border rounded-2xl p-6">
                <DocumentToolUI
                  slug="terms-of-service"
                  documentType="TERMS_OF_SERVICE"
                  title="Terms of Service"
                  description=""
                  seoDescription=""
                  fields={FIELDS}
                />
              </div>
            </div>
            <div className="lg:col-span-5">
              <div className="bg-card border border-border rounded-2xl p-6 mb-5">
                <h2 className="font-semibold text-foreground mb-4">
                  What&apos;s included
                </h2>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  {[
                    "Acceptance of terms",
                    "Account & registration",
                    "Payment & billing",
                    "Intellectual property rights",
                    "Prohibited conduct",
                    "Disclaimer of warranties",
                    "Limitation of liability",
                    "Indemnification",
                    "Termination clause",
                    "Dispute resolution",
                    "Governing law",
                  ].map((i) => (
                    <li key={i} className="flex gap-2">
                      <span className="text-green-500">✓</span>
                      {i}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="bg-card border border-border rounded-2xl p-6">
                <h3 className="font-semibold mb-3">Related</h3>
                <ul className="space-y-2 text-sm">
                  {[
                    { l: "Privacy Policy", h: "/tools/privacy-policy" },
                    { l: "Cookie Policy", h: "/tools/cookie-policy" },
                    { l: "Refund Policy", h: "/tools/refund-policy" },
                  ].map((x) => (
                    <li key={x.h}>
                      <Link href={x.h} className="text-primary hover:underline">
                        {x.l}
                      </Link>
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
