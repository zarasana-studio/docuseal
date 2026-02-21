import type { Metadata } from "next";
import { DocumentToolUI } from "@/components/tool/DocumentToolUI";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Free Employment Contract Generator | DocuSeal",
  description:
    "Generate a professional employment contract in 60 seconds. Covers salary, duties, confidentiality, non-compete and at-will employment. Free PDF download.",
  alternates: { canonical: "/tools/employment-contract" },
};
const FIELDS = [
  {
    key: "employerName",
    label: "Employer / Company Name",
    required: true,
    placeholder: "Acme Inc.",
  },
  {
    key: "employeeName",
    label: "Employee Full Name",
    required: true,
    placeholder: "Jane Smith",
  },
  {
    key: "position",
    label: "Job Title",
    required: true,
    placeholder: "Senior Software Engineer",
  },
  { key: "startDate", label: "Start Date", placeholder: "March 1, 2025" },
  {
    key: "salary",
    label: "Annual Salary / Hourly Rate",
    required: true,
    placeholder: "$95,000/year or $50/hour",
  },
  {
    key: "workLocation",
    label: "Work Location",
    type: "select" as const,
    options: ["Remote", "On-site", "Hybrid (Remote + Office"],
  },
  {
    key: "jurisdiction",
    label: "Governing state/country",
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
export default function EmploymentContractPage() {
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
            <span className="text-foreground">
              Employment Contract Generator
            </span>
          </nav>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
            <div className="lg:col-span-7">
              <h1 className="text-3xl font-bold text-foreground mb-2">
                Free Employment Contract Generator
              </h1>
              <p className="text-muted-foreground mb-8">
                Create a professional employment agreement for your new hire in
                60 seconds. Includes salary, duties, confidentiality, and more.
              </p>
              <div className="bg-card border border-border rounded-2xl p-6">
                <DocumentToolUI
                  slug="employment-contract"
                  documentType="EMPLOYMENT_CONTRACT"
                  title="Employment Contract"
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
                    "Job title and duties",
                    "Start date and hours",
                    "Compensation and benefits",
                    "Confidentiality clause",
                    "Non-compete (if applicable)",
                    "At-will employment clause",
                    "Termination procedures",
                    "IP assignment",
                    "Dispute resolution",
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
