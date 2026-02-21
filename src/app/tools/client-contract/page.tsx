import type { Metadata } from "next";
import { DocumentToolUI } from "@/components/tool/DocumentToolUI";
import Link from "next/link";

export const metadata: Metadata = {
  title:
    "Free Client Contract Generator — Service Agreement Template | DocuSeal",
  description:
    "Generate a professional client service agreement in 60 seconds. Protect your work with clear payment terms, scope of work, and IP clauses. Free PDF download.",
  alternates: { canonical: "/tools/client-contract" },
};
const FIELDS = [
  {
    key: "providerName",
    label: "Service Provider (you)",
    placeholder: "Your Name / Company",
    required: true,
  },
  {
    key: "clientName",
    label: "Client Name / Company",
    placeholder: "Client Corp",
    required: true,
  },
  {
    key: "services",
    label: "Services to be provided",
    type: "textarea" as const,
    placeholder: "Web design and development, 5-page website…",
    required: true,
  },
  {
    key: "payment",
    label: "Payment amount & terms",
    placeholder: "$5,000 — 50% upfront, 50% on delivery",
    required: true,
  },
  {
    key: "timeline",
    label: "Project timeline",
    placeholder: "6 weeks from contract signing",
  },
  {
    key: "jurisdiction",
    label: "Governing law",
    type: "select" as const,
    options: [
      "United States",
      "United Kingdom",
      "Canada",
      "Australia",
      "India",
      "EU",
    ],
  },
];
export default function ClientContractPage() {
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
            <span className="text-foreground">Client Contract Generator</span>
          </nav>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
            <div className="lg:col-span-7">
              <h1 className="text-3xl font-bold text-foreground mb-2">
                Free Client Contract Generator
              </h1>
              <p className="text-muted-foreground mb-8">
                Generate a professional client service agreement protecting your
                work, payment, and intellectual property rights.
              </p>
              <div className="bg-card border border-border rounded-2xl p-6">
                <DocumentToolUI
                  slug="client-contract"
                  documentType="CLIENT_CONTRACT"
                  title="Client Contract"
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
                    "Scope of work",
                    "Payment terms & schedule",
                    "Revision policy",
                    "IP ownership & assignment",
                    "Confidentiality",
                    "Warranty disclaimer",
                    "Limitation of liability",
                    "Termination clause",
                    "Dispute resolution",
                    "Signatures",
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
