import type { Metadata } from "next";
import { DocumentToolUI } from "@/components/tool/DocumentToolUI";
import Link from "next/link";

export const metadata: Metadata = {
  title:
    "Free Freelancer Agreement Generator — Independent Contractor Template | DocuSeal",
  description:
    "Generate a free freelancer/independent contractor agreement in 60 seconds. Covers deliverables, IP assignment, payment, and confidentiality. Download PDF free.",
  alternates: { canonical: "/tools/freelancer-agreement" },
};
const FIELDS = [
  {
    key: "clientName",
    label: "Client Name / Company",
    required: true,
    placeholder: "Acme Inc.",
  },
  {
    key: "freelancerName",
    label: "Your Name (Freelancer)",
    required: true,
    placeholder: "Jane Smith",
  },
  {
    key: "projectDescription",
    label: "Project description",
    required: true,
    type: "textarea" as const,
    placeholder: "Build a 5-page marketing website using React…",
  },
  {
    key: "rate",
    label: "Rate / Payment",
    required: true,
    placeholder: "$3,500 fixed or $150/hr",
  },
  {
    key: "paymentSchedule",
    label: "Payment schedule",
    type: "select" as const,
    options: [
      "50% upfront, 50% on completion",
      "100% on completion",
      "Monthly invoices",
      "Weekly invoices",
      "Milestone-based",
    ],
  },
  {
    key: "jurisdiction",
    label: "Governing jurisdiction",
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
export default function FreelancerAgreementPage() {
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
            <span className="text-foreground">Freelancer Agreement</span>
          </nav>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
            <div className="lg:col-span-7">
              <h1 className="text-3xl font-bold text-foreground mb-2">
                Free Freelancer Agreement Generator
              </h1>
              <p className="text-muted-foreground mb-8">
                Create a professional independent contractor agreement with IP
                rights, payment terms, and non-solicitation clauses.
              </p>
              <div className="bg-card border border-border rounded-2xl p-6">
                <DocumentToolUI
                  slug="freelancer-agreement"
                  documentType="FREELANCER_AGREEMENT"
                  title="Freelancer Agreement"
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
                    "Independent contractor status",
                    "Project deliverables",
                    "Payment schedule",
                    "IP ownership / assignment",
                    "Confidentiality",
                    "Non-solicitation",
                    "Revision policy",
                    "Termination",
                    "Governing law",
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
