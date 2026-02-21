import type { Metadata } from "next";
import { DocumentToolUI } from "@/components/tool/DocumentToolUI";
import Link from "next/link";
import { ChevronDown } from "lucide-react";

export const metadata: Metadata = {
  title: "Free Privacy Policy Generator — GDPR & CCPA Compliant | DocuSeal",
  description:
    "Generate a free, GDPR and CCPA compliant privacy policy for your website or app in 60 seconds. No lawyer needed. Download as PDF instantly.",
  keywords: [
    "free privacy policy generator",
    "privacy policy template",
    "GDPR privacy policy",
    "CCPA privacy policy",
  ],
  alternates: { canonical: "/tools/privacy-policy" },
  openGraph: {
    title: "Free Privacy Policy Generator — GDPR & CCPA Compliant",
    description:
      "Generate a free privacy policy in 60 seconds. GDPR, CCPA compliant.",
    url: "/tools/privacy-policy",
  },
};

const FIELDS = [
  {
    key: "businessName",
    label: "Business Name",
    placeholder: "Acme Inc.",
    required: true,
  },
  {
    key: "websiteUrl",
    label: "Website / App URL",
    placeholder: "https://yoursite.com",
    required: true,
  },
  {
    key: "businessType",
    label: "Type of Business",
    type: "select" as const,
    options: [
      "SaaS / App",
      "E-commerce",
      "Blog / Content",
      "Service Business",
      "Marketplace",
      "Other",
    ],
    required: true,
  },
  {
    key: "jurisdiction",
    label: "Primary Jurisdiction",
    type: "select" as const,
    options: [
      "United States",
      "European Union",
      "United Kingdom",
      "Canada",
      "Australia",
      "India",
      "Global",
    ],
    required: true,
  },
  {
    key: "dataCollected",
    label: "Data you collect",
    placeholder: "name, email, payment info, usage data…",
    type: "textarea" as const,
    hint: "List the personal data your site/app collects",
  },
  {
    key: "thirdParties",
    label: "Third-party services used",
    placeholder: "Google Analytics, Stripe, Mailchimp…",
    hint: "Services that also receive user data",
  },
  {
    key: "contactEmail",
    label: "Privacy contact email",
    placeholder: "privacy@yoursite.com",
    required: true,
  },
];

const FAQS = [
  {
    q: "Is this privacy policy generator really free?",
    a: "Yes — completely free. No credit card or signup required to generate your first privacy policy.",
  },
  {
    q: "Does the generated policy comply with GDPR?",
    a: "Yes. Our generator produces GDPR-compliant privacy policies including data rights, legal basis for processing, and contact information as required by Art. 13 and 14 GDPR.",
  },
  {
    q: "Does it include CCPA compliance?",
    a: "Yes. The generated policy includes California Consumer Privacy Act (CCPA) specific sections including the right to know, right to delete, and right to opt out.",
  },
  {
    q: "Can I edit the policy after generating it?",
    a: "Yes. After generation, you can edit any section directly in our editor before downloading.",
  },
  {
    q: "Do I need a privacy policy if I use Google Analytics?",
    a: "Yes — if you use Google Analytics or any similar service, you are legally required to have a privacy policy under GDPR, CCPA, and Google's own terms of service.",
  },
];

export default function PrivacyPolicyGeneratorPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Nav */}
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
              className="text-sm bg-primary text-primary-foreground px-3 py-1.5 rounded-lg font-medium hover:opacity-90"
            >
              Get Started Free
            </Link>
          </div>
        </div>
      </header>

      <main className="pt-20 pb-20 px-4">
        <div className="max-w-6xl mx-auto">
          {/* Breadcrumb */}
          <nav className="text-sm text-muted-foreground mb-6 pt-6">
            <Link href="/" className="hover:text-foreground">
              Home
            </Link>
            <span className="mx-2">/</span>
            <Link href="/#tools" className="hover:text-foreground">
              Tools
            </Link>
            <span className="mx-2">/</span>
            <span className="text-foreground">Privacy Policy Generator</span>
          </nav>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
            {/* Main Tool */}
            <div className="lg:col-span-7">
              <h1 className="text-3xl font-bold text-foreground mb-2">
                Free Privacy Policy Generator
              </h1>
              <p className="text-muted-foreground mb-8">
                Generate a comprehensive, GDPR and CCPA compliant privacy policy
                for your website or app in under 60 seconds. Powered by AI.
                Always free.
              </p>

              <div className="bg-card border border-border rounded-2xl p-6">
                <DocumentToolUI
                  slug="privacy-policy"
                  documentType="PRIVACY_POLICY"
                  title="Privacy Policy"
                  description="GDPR & CCPA compliant privacy policies"
                  seoDescription="Free privacy policy generator"
                  fields={FIELDS}
                />
              </div>
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-5 space-y-6">
              <div className="bg-card border border-border rounded-2xl p-6">
                <h2 className="font-semibold text-foreground mb-4">
                  What&apos;s included
                </h2>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  {[
                    "Information collection disclosure",
                    "How data is used",
                    "Cookies & tracking",
                    "Third-party services",
                    "Data retention policy",
                    "GDPR rights (EU users)",
                    "CCPA rights (CA users)",
                    "Contact information",
                    "Last updated date",
                  ].map((item) => (
                    <li key={item} className="flex items-start gap-2">
                      <span className="text-green-500 mt-0.5">✓</span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800 rounded-2xl p-5 text-sm">
                <p className="font-medium text-amber-800 dark:text-amber-200 mb-1">
                  ⚖️ Legal disclaimer
                </p>
                <p className="text-amber-700 dark:text-amber-300">
                  This generator produces AI-generated documents for
                  informational purposes. For legal matters involving
                  significant risk, consult a licensed attorney.
                </p>
              </div>

              <div className="bg-card border border-border rounded-2xl p-6">
                <h3 className="font-semibold text-foreground mb-3">
                  Other free generators
                </h3>
                <ul className="space-y-2 text-sm">
                  {[
                    {
                      label: "Terms of Service Generator",
                      href: "/tools/terms-of-service",
                    },
                    { label: "NDA Generator", href: "/tools/nda" },
                    {
                      label: "Cookie Policy Generator",
                      href: "/tools/cookie-policy",
                    },
                    {
                      label: "Client Contract Generator",
                      href: "/tools/client-contract",
                    },
                  ].map((link) => (
                    <li key={link.href}>
                      <Link
                        href={link.href}
                        className="text-primary hover:underline"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* SEO Content Section */}
          <div className="mt-16 max-w-3xl">
            <h2 className="text-2xl font-bold text-foreground mb-4">
              What is a privacy policy and do you need one?
            </h2>
            <div className="prose prose-sm max-w-none text-muted-foreground space-y-4">
              <p>
                A <strong className="text-foreground">privacy policy</strong> is
                a legal document that explains how your website or application
                collects, uses, stores, and protects users&apos; personal
                information. It is legally required in most jurisdictions if you
                collect any personal data from users.
              </p>
              <p>
                Under the <strong className="text-foreground">GDPR</strong>{" "}
                (General Data Protection Regulation), any business serving EU
                residents must have a privacy policy that details the legal
                basis for data processing, data retention periods, and
                users&apos; rights. Fines for non-compliance can reach €20
                million or 4% of global annual turnover.
              </p>
              <p>
                The <strong className="text-foreground">CCPA</strong>{" "}
                (California Consumer Privacy Act) requires businesses that
                collect data from California residents to disclose what data is
                collected, allow users to opt out of the sale of their personal
                information, and honor deletion requests.
              </p>
              <p>
                Even if you don&apos;t believe you&apos;re collecting personal
                data, tools like{" "}
                <strong className="text-foreground">Google Analytics</strong>,
                Facebook Pixel, and most ad networks collect user data on your
                behalf — making a privacy policy legally necessary.
              </p>
            </div>
          </div>

          {/* FAQ */}
          <div className="mt-12 max-w-3xl">
            <h2 className="text-2xl font-bold text-foreground mb-6">
              Frequently asked questions
            </h2>
            <script
              type="application/ld+json"
              dangerouslySetInnerHTML={{
                __html: JSON.stringify({
                  "@context": "https://schema.org",
                  "@type": "FAQPage",
                  mainEntity: FAQS.map((f) => ({
                    "@type": "Question",
                    name: f.q,
                    acceptedAnswer: { "@type": "Answer", text: f.a },
                  })),
                }),
              }}
            />
            <div className="space-y-3">
              {FAQS.map((faq) => (
                <details
                  key={faq.q}
                  className="bg-card border border-border rounded-xl group"
                >
                  <summary className="flex items-center justify-between px-5 py-4 cursor-pointer font-medium text-foreground list-none text-sm">
                    {faq.q}{" "}
                    <ChevronDown className="w-4 h-4 text-muted-foreground group-open:rotate-180 transition-transform shrink-0" />
                  </summary>
                  <div className="px-5 pb-4 text-sm text-muted-foreground">
                    {faq.a}
                  </div>
                </details>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
