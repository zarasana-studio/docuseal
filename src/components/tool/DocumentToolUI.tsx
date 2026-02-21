"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import {
  Loader2,
  Download,
  Copy,
  Check,
  Lock,
  ArrowRight,
  ArrowLeft,
} from "lucide-react";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { TipTapEditor } from "../TipTapEditor";

interface ToolField {
  key: string;
  label: string;
  placeholder?: string;
  type?: "text" | "textarea" | "select";
  options?: string[];
  required?: boolean;
  hint?: string;
}

interface DocumentToolProps {
  slug: string;
  documentType: string;
  title: string;
  description: string;
  fields: ToolField[];
  faqJson?: Array<{ q: string; a: string }>;
  seoDescription: string;
}

export function DocumentToolUI({
  slug,
  documentType,
  title,
  fields,
  seoDescription,
}: DocumentToolProps) {
  const { data: session } = useSession();
  const router = useRouter();

  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);
  const [step, setStep] = useState<"form" | "result">("form");
  const [upgradeRequired, setUpgradeRequired] = useState(false);

  function setField(key: string, value: string) {
    setAnswers((prev) => ({ ...prev, [key]: value }));
  }

  async function handleGenerate(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setUpgradeRequired(false);

    // Require login to generate
    if (!session?.user) {
      router.push(`/signup?redirect=/tools/${slug}`);
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ documentType, answers }),
      });

      const data = await res.json();

      if (!res.ok) {
        if (data.upgradeRequired) {
          setUpgradeRequired(true);
          setError(data.error);
        } else {
          setError(data.error ?? "Generation failed. Please try again.");
        }
      } else {
        setContent(data.content);
        setStep("result");
      }
    } catch {
      setError("Network error. Please check your connection and try again.");
    } finally {
      setLoading(false);
    }
  }

  async function handleCopy() {
    await navigator.clipboard.writeText(content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  async function handleDownload() {
    if (!session?.user) {
      router.push(`/signup?redirect=/tools/${slug}`);
      return;
    }

    const element = document.getElementById("document-content-wrapper");
    if (!element) return;

    // Temporarily hide the watermark locally if user has paid plan, 
    // but the free user watermark is hardcoded in the DOM so it will be captured.
    const canvas = await html2canvas(element, {
      scale: 2,
      useCORS: true,
      logging: false,
      backgroundColor: "#ffffff",
    });

    const imgData = canvas.toDataURL("image/png");
    const pdf = new jsPDF("p", "mm", "a4");
    
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();
    const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
    
    let heightLeft = pdfHeight;
    let position = 0;

    pdf.addImage(imgData, "PNG", 0, position, pdfWidth, pdfHeight);
    heightLeft -= pageHeight;

    while (heightLeft > 0) {
      position = heightLeft - pdfHeight;
      pdf.addPage();
      pdf.addImage(imgData, "PNG", 0, position, pdfWidth, pdfHeight);
      heightLeft -= pageHeight;
    }

    pdf.save(`${title.replace(/\s+/g, "_").toLowerCase()}.pdf`);
  }

  if (step === "result") {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="font-semibold text-foreground">
            Your {title} is ready
          </h2>
          <div className="flex gap-2">
            <button
              onClick={handleCopy}
              className="flex items-center gap-1.5 text-sm border border-border rounded-lg px-3 py-2 hover:bg-muted transition-colors"
            >
              {copied ? (
                <Check className="w-4 h-4 text-green-500" />
              ) : (
                <Copy className="w-4 h-4" />
              )}
              {copied ? "Copied!" : "Copy"}
            </button>
            <button
              onClick={handleDownload}
              className="flex items-center gap-1.5 text-sm gradient-primary text-white rounded-lg px-3 py-2 hover:opacity-90 transition-opacity"
            >
              <Download className="w-4 h-4" />
              Download PDF
            </button>
          </div>
        </div>

        <div className="relative bg-white dark:bg-slate-50 border border-border rounded-xl p-8 min-h-96 overflow-auto max-h-[60vh]">
          {/* This wrapper is what html2canvas will capture */}
          <div id="document-content-wrapper" className="relative p-8 bg-white text-slate-900">
            <h1 className="text-3xl font-bold mb-6 border-b pb-4">{title}</h1>
            <div className="prose prose-sm md:prose-base max-w-none text-slate-800 prose-headings:text-slate-900 prose-a:text-blue-600 prose-strong:text-slate-900">
              <TipTapEditor
                content={content}
                onChange={(newContent) => setContent(newContent)}
                editable={true}
              />
            </div>
            
            {/* Watermark for free plan */}
            {!session?.user?.id || session?.user?.name === "Free" ? (
              <div className="mt-16 pt-4 border-t border-slate-200 text-xs text-slate-400 text-center select-none pointer-events-none">
                Generated securely by DocuSeal.ai
              </div>
            ) : null}
          </div>
        </div>

        <div className="flex items-center justify-between">
          <button
            onClick={() => setStep("form")}
            className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="w-4 h-4" /> Edit answers
          </button>
          <Link
            href="/dashboard"
            className="flex items-center gap-1.5 text-sm text-primary hover:underline"
          >
            View all documents <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="bg-primary/5 border border-primary/20 rounded-xl p-4 text-sm">
          <p className="text-foreground font-medium mb-1">
            ⚡ Want unlimited documents + clean PDFs?
          </p>
          <p className="text-muted-foreground mb-3">
            Upgrade to Starter for $19/mo and remove all limits.
          </p>
          <Link
            href="/signup?plan=starter"
            className="inline-flex items-center gap-1.5 text-sm gradient-primary text-white font-medium px-4 py-2 rounded-lg hover:opacity-90 transition-opacity"
          >
            Start Free Trial <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleGenerate} className="space-y-5">
      {error && (
        <div className="bg-destructive/10 border border-destructive/20 text-destructive text-sm rounded-lg px-4 py-3">
          {error}
          {upgradeRequired && (
            <div className="mt-2">
              <Link
                href="/signup?plan=starter"
                className="inline-flex items-center gap-1 text-primary font-medium hover:underline"
              >
                <Lock className="w-3.5 h-3.5" /> Upgrade to continue
              </Link>
            </div>
          )}
        </div>
      )}

      {fields.map((field) => (
        <div key={field.key}>
          <label className="block text-sm font-medium text-foreground mb-1.5">
            {field.label}
            {field.required && <span className="text-destructive ml-1">*</span>}
          </label>
          {field.hint && (
            <p className="text-xs text-muted-foreground mb-1.5">{field.hint}</p>
          )}
          {field.type === "textarea" ? (
            <textarea
              required={field.required}
              value={answers[field.key] ?? ""}
              onChange={(e) => setField(field.key, e.target.value)}
              placeholder={field.placeholder}
              rows={3}
              className="w-full px-3.5 py-2.5 border border-input rounded-xl text-sm bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring resize-none"
            />
          ) : field.type === "select" && field.options ? (
            <select
              required={field.required}
              value={answers[field.key] ?? ""}
              onChange={(e) => setField(field.key, e.target.value)}
              className="w-full px-3.5 py-2.5 border border-input rounded-xl text-sm bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            >
              <option value="">Select one…</option>
              {field.options.map((o) => (
                <option key={o} value={o}>
                  {o}
                </option>
              ))}
            </select>
          ) : (
            <input
              type="text"
              required={field.required}
              value={answers[field.key] ?? ""}
              onChange={(e) => setField(field.key, e.target.value)}
              placeholder={field.placeholder}
              className="w-full px-3.5 py-2.5 border border-input rounded-xl text-sm bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            />
          )}
        </div>
      ))}

      <button
        type="submit"
        disabled={loading}
        className="w-full gradient-primary text-white font-semibold py-3.5 rounded-xl text-sm hover:opacity-90 transition-opacity disabled:opacity-50 flex items-center justify-center gap-2"
      >
        {loading ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" />
            Generating with AI…
          </>
        ) : (
          <>Generate {title} Free</>
        )}
      </button>

      <p className="text-xs text-muted-foreground text-center">
        {!session?.user && "Creating an account is free and takes 30 seconds. "}
        Not legal advice — for informational purposes only.
      </p>
    </form>
  );
}
