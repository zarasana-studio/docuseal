"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  Save,
  Download,
  Copy,
  Check,
  Edit3,
  Eye,
  Trash2,
  Loader2,
} from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { DOCUMENT_TYPE_LABELS, formatDate } from "@/lib/utils";

interface DocumentEditorProps {
  id: string;
  initialTitle: string;
  initialContent: string;
  type: string;
  createdAt: Date;
  status: string;
  isWatermarked: boolean;
  userPlan: "FREE" | "PAID";
}

export function DocumentEditor({
  id,
  initialTitle,
  initialContent,
  type,
  createdAt,
  status,
  isWatermarked,
  userPlan,
}: DocumentEditorProps) {
  const router = useRouter();
  const [title, setTitle] = useState(initialTitle);
  const [content, setContent] = useState(initialContent);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState("");

  async function handleSave() {
    setIsSaving(true);
    setError("");
    try {
      const res = await fetch(`/api/documents/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, content }),
      });

      if (!res.ok) throw new Error("Failed to save");
      setIsEditing(false);
      router.refresh();
    } catch (err) {
      setError("Failed to save changes. Please try again.");
    } finally {
      setIsSaving(false);
    }
  }

  async function handleDelete() {
    if (!confirm("Are you sure you want to delete this document? This cannot be undone.")) return;
    
    setIsDeleting(true);
    try {
      const res = await fetch(`/api/documents/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete");
      router.push("/documents");
    } catch (err) {
      setError("Failed to delete document.");
      setIsDeleting(false);
    }
  }

  async function handleCopy() {
    await navigator.clipboard.writeText(content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  async function handleDownload() {
    const element = document.getElementById("document-content-wrapper");
    if (!element) return;

    // Switch out of edit mode to capture the rendered view if they try to download while editing
    if (isEditing) setIsEditing(false);

    // Give react a tiny tick to render the preview mode before capturing
    setTimeout(async () => {
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
    }, 100);
  }

  return (
    <div className="space-y-6">
      {/* Header Info */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <Link
            href="/documents"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-4 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Documents
          </Link>
          
          <div className="flex items-center gap-3 mb-2">
            {isEditing ? (
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="text-2xl font-bold bg-background border-b-2 border-primary focus:outline-none px-1 py-0.5"
              />
            ) : (
              <h1 className="text-2xl font-bold text-foreground">{title}</h1>
            )}
            <span
              className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                status === "FINAL"
                  ? "bg-green-100 text-green-700"
                  : "bg-muted text-muted-foreground"
              }`}
            >
              {status === "FINAL" ? "Final" : "Draft"}
            </span>
          </div>
          
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <span>{DOCUMENT_TYPE_LABELS[type] || type}</span>
            <span>•</span>
            <span>Created {formatDate(createdAt)}</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2">
          {isEditing ? (
            <button
              onClick={handleSave}
              disabled={isSaving}
              className="flex items-center gap-1.5 text-sm gradient-primary text-white font-medium px-4 py-2 rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50"
            >
              {isSaving ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Save className="w-4 h-4" />
              )}
              Save Changes
            </button>
          ) : (
            <>
              <button
                onClick={() => setIsEditing(true)}
                className="flex items-center gap-1.5 text-sm border border-border bg-background text-foreground hover:bg-muted font-medium px-4 py-2 rounded-lg transition-colors"
              >
                <Edit3 className="w-4 h-4" /> Edit
              </button>
              <button
                onClick={handleCopy}
                className="flex items-center gap-1.5 text-sm border border-border bg-background text-foreground hover:bg-muted font-medium px-4 py-2 rounded-lg transition-colors"
              >
                {copied ? (
                  <Check className="w-4 h-4 text-green-500" />
                ) : (
                  <Copy className="w-4 h-4" />
                )}
                {copied ? "Copied" : "Copy"}
              </button>
              <button
                onClick={handleDownload}
                className="flex items-center gap-1.5 text-sm gradient-primary text-white font-medium px-4 py-2 rounded-lg hover:opacity-90 transition-opacity"
              >
                <Download className="w-4 h-4" /> Download PDF
              </button>
              <button
                onClick={handleDelete}
                disabled={isDeleting}
                className="flex items-center justify-center p-2 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-lg transition-colors ml-2"
                title="Delete Document"
              >
                {isDeleting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
              </button>
            </>
          )}
        </div>
      </div>

      {error && (
        <div className="bg-destructive/10 text-destructive text-sm px-4 py-3 rounded-lg border border-destructive/20">
          {error}
        </div>
      )}

      {/* Editor / Viewer Surface */}
      <div className="relative bg-white dark:bg-slate-50 border border-border rounded-xl shadow-sm min-h-[500px]">
        {/* View Mode Toggle Overlay (if editing) */}
        {isEditing && (
          <div className="absolute top-4 right-4 z-10 flex gap-2">
            <button
              onClick={() => setIsEditing(false)}
              className="flex items-center gap-1.5 text-xs font-semibold bg-primary text-white px-3 py-1.5 rounded-full shadow-md hover:bg-primary/90 transition-colors"
            >
              <Eye className="w-3.5 h-3.5" /> Preview Markdown
            </button>
          </div>
        )}

        {isEditing ? (
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="w-full h-full min-h-[600px] p-8 bg-slate-900 text-slate-100 font-mono text-sm leading-relaxed rounded-xl focus:outline-none focus:ring-0 resize-y"
            placeholder="Document content missing..."
            spellCheck={false}
          />
        ) : (
          <div className="overflow-auto max-h-[70vh]">
            <div
              id="document-content-wrapper"
              className="relative p-10 bg-white text-slate-900 mx-auto max-w-4xl"
            >
              <h1 className="text-3xl font-bold mb-8 border-b pb-4">{title}</h1>
              <div className="prose prose-sm md:prose-base max-w-none text-slate-800 prose-headings:text-slate-900 prose-a:text-blue-600 prose-strong:text-slate-900">
                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                  {content}
                </ReactMarkdown>
              </div>

              {/* Watermark for free plan, only visible in exported PDF or preview if unpaid */}
              {isWatermarked && userPlan === "FREE" && (
                <div className="mt-16 pt-4 border-t border-slate-200 text-xs text-slate-400 text-center select-none pointer-events-none">
                  Generated securely by DocuSeal.ai
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
