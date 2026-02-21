import type { Metadata } from "next";
import { DocumentToolUI } from "@/components/tool/DocumentToolUI";
import Link from "next/link";
import { ChevronDown } from "lucide-react";

export const metadata: Metadata = {
  title: "Free NDA Generator — Non-Disclosure Agreement Template | DocuSeal",
  description:
    "Generate a free, legally binding NDA in 60 seconds. Protect your confidential information with an AI-generated non-disclosure agreement. Download as PDF.",
  keywords: [
    "free NDA generator",
    "NDA template",
    "non-disclosure agreement generator",
    "confidentiality agreement",
  ],
  alternates: { canonical: "/tools/nda" },
  openGraph: {
    title: "Free NDA Generator",
    description: "Generate a binding NDA in 60 seconds. Free.",
    url: "/tools/nda",
  },
};

const FIELDS = [
  {
    key: "disclosingParty",
    label: "Disclosing Party (who shares info)",
    placeholder: "Acme Inc.",
    required: true,
  },
  {
    key: "receivingParty",
    label: "Receiving Party (who receives info)",
    placeholder: "John Smith / XYZ Corp",
    required: true,
  },
  {
    key: "purpose",
    label: "Purpose of disclosure",
    placeholder: "Evaluating a potential business partnership",
    required: true,
    type: "textarea" as const,
  },
  {
    key: "confidentialInfo",
    label: "Type of confidential information",
    placeholder: "business plans, source code, financial data…",
    type: "textarea" as const,
  },
  {
    key: "duration",
    label: "Confidentiality duration",
    type: "select" as const,
    options: ["1 year", "2 years", "3 years", "5 years", "Indefinitely"],
  },
  {
    key: "jurisdiction",
    label: "Governing jurisdiction",
    type: "select" as const,
    options: [
      "United States",
      "United Kingdom",
      "European Union",
      "Canada",
      "Australia",
      "India",
      "Singapore",
    ],
  },
];

const FAQS = [
  {
    q: "Is a free NDA legally binding?",
    a: "Yes — an NDA is legally binding as long as it includes an offer, acceptance, and consideration (the exchange of confidential information). Our generated NDAs include all required elements.",
  },
  {
    q: "What is the difference between a mutual and one-way NDA?",
    a: "A one-way (unilateral) NDA protects information flowing from one party to another. A mutual NDA protects information shared by both parties. The generator asks you to specify this.",
  },
  {
    q: "When do I need an NDA?",
    a: "You need an NDA before sharing sensitive business information with potential partners, contractors, employees, or investors — essentially any situation where you risk your confidential information being misused.",
  },
];

export default function NDAGeneratorPage() {
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
              className="text-sm bg-primary text-primary-foreground px-3 py-1.5 rounded-lg font-medium hover:opacity-90"
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
            <Link href="/#tools" className="hover:text-foreground">
              Tools
            </Link>
            <span className="mx-2">/</span>
            <span className="text-foreground">NDA Generator</span>
          </nav>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
            <div className="lg:col-span-7">
              <h1 className="text-3xl font-bold text-foreground mb-2">
                Free NDA Generator
              </h1>
              <p className="text-muted-foreground mb-8">
                Create a legally binding Non-Disclosure Agreement (NDA) in under
                60 seconds. AI-powered, lawyer-reviewed template. Download as
                PDF instantly.
              </p>
              <div className="bg-card border border-border rounded-2xl p-6">
                <DocumentToolUI
                  slug="nda"
                  documentType="NDA"
                  title="NDA Agreement"
                  description=""
                  seoDescription=""
                  fields={FIELDS}
                />
              </div>
            </div>
            <div className="lg:col-span-5 space-y-6">
              <div className="bg-card border border-border rounded-2xl p-6">
                <h2 className="font-semibold text-foreground mb-4">
                  What&apos;s included
                </h2>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  {[
                    "Definition of confidential information",
                    "Obligations of receiving party",
                    "Exclusions from confidentiality",
                    "Term and expiration",
                    "Return of information",
                    "Injunctive relief clause",
                    "Governing law",
                    "Signature blocks",
                  ].map((i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="text-green-500">✓</span>
                      {i}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="bg-card border border-border rounded-2xl p-6">
                <h3 className="font-semibold text-foreground mb-3">
                  Related generators
                </h3>
                <ul className="space-y-2 text-sm">
                  {[
                    {
                      label: "Privacy Policy Generator",
                      href: "/tools/privacy-policy",
                    },
                    {
                      label: "Client Contract",
                      href: "/tools/client-contract",
                    },
                    {
                      label: "Freelancer Agreement",
                      href: "/tools/freelancer-agreement",
                    },
                  ].map((l) => (
                    <li key={l.href}>
                      <Link
                        href={l.href}
                        className="text-primary hover:underline"
                      >
                        {l.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
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
                    {faq.q}
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
