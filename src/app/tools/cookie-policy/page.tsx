import type { Metadata } from "next";
import { DocumentToolUI } from "@/components/tool/DocumentToolUI";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Free Cookie Policy Generator — EU/GDPR Compliant | DocuSeal",
  description:
    "Generate a free GDPR-compliant cookie policy in 60 seconds. Covers analytics, marketing, and functional cookies. Download as PDF.",
  alternates: { canonical: "/tools/cookie-policy" },
};
const FIELDS = [
  {
    key: "businessName",
    label: "Business Name",
    required: true,
    placeholder: "Acme Inc.",
  },
  {
    key: "websiteUrl",
    label: "Website URL",
    required: true,
    placeholder: "https://yoursite.com",
  },
  {
    key: "cookiesUsed",
    label: "Types of cookies used",
    type: "textarea" as const,
    placeholder:
      "analytics (Google Analytics), marketing (Facebook Pixel), functional cookies…",
  },
  {
    key: "thirdParties",
    label: "Third-party services",
    placeholder: "Google Analytics, Facebook Pixel, Hotjar…",
  },
  {
    key: "jurisdiction",
    label: "Primary audience",
    type: "select" as const,
    options: [
      "European Union (GDPR)",
      "United Kingdom (UK GDPR)",
      "United States",
      "Global",
    ],
  },
  {
    key: "contactEmail",
    label: "Contact email",
    placeholder: "privacy@yoursite.com",
  },
];
export default function CookiePolicyPage() {
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
            <span className="text-foreground">Cookie Policy Generator</span>
          </nav>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
            <div className="lg:col-span-7">
              <h1 className="text-3xl font-bold text-foreground mb-2">
                Free Cookie Policy Generator
              </h1>
              <p className="text-muted-foreground mb-8">
                Create a GDPR-compliant cookie policy for your website in 60
                seconds. Required if you use Google Analytics, Facebook Pixel,
                or any tracking cookies.
              </p>
              <div className="bg-card border border-border rounded-2xl p-6">
                <DocumentToolUI
                  slug="cookie-policy"
                  documentType="COOKIE_POLICY"
                  title="Cookie Policy"
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
                    "What are cookies",
                    "Types of cookies table",
                    "Analytics cookie disclosure",
                    "Marketing cookie disclosure",
                    "How to opt out",
                    "Third-party cookie list",
                    "GDPR/UK GDPR compliance",
                    "Contact for cookie questions",
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
