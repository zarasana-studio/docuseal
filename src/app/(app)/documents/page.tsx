import { auth } from "@/auth";
import { prisma } from "@/lib/db";
import { redirect } from "next/navigation";
import Link from "next/link";
import { DOCUMENT_TYPE_LABELS, formatDate } from "@/lib/utils";
import { FileText, ArrowRight, ArrowLeft } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "All Documents",
  robots: { index: false, follow: false },
};

export default async function DocumentsPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const documents = await prisma.document.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="min-h-screen bg-background pl-60">
      <main className="p-8">
        <div className="max-w-5xl mx-auto">
          <div className="mb-8">
            <Link
              href="/dashboard"
              className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-4 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" /> Back to Dashboard
            </Link>
            <h1 className="text-2xl font-bold text-foreground mb-1">
              All Documents
            </h1>
            <p className="text-muted-foreground text-sm">
              View and manage all your generated legal documents.
            </p>
          </div>

          {documents.length === 0 ? (
            <div className="bg-card border border-border border-dashed rounded-2xl p-12 text-center">
              <FileText className="w-10 h-10 text-muted-foreground/40 mx-auto mb-3" />
              <p className="text-muted-foreground text-sm mb-4">
                No documents yet. Generate your first one!
              </p>
              <Link
                href="/dashboard"
                className="inline-flex items-center gap-1.5 gradient-primary text-white text-sm font-medium px-4 py-2 rounded-lg hover:opacity-90 transition-opacity"
              >
                Go to tools
              </Link>
            </div>
          ) : (
            <div className="bg-card border border-border rounded-xl shadow-sm overflow-hidden">
              <div className="grid grid-cols-12 gap-4 p-4 border-b border-border bg-muted/50 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                <div className="col-span-5">Title</div>
                <div className="col-span-3">Type</div>
                <div className="col-span-2">Date Created</div>
                <div className="col-span-2 text-right">Action</div>
              </div>
              <div className="divide-y divide-border">
                {documents.map((doc) => (
                  <Link
                    key={doc.id}
                    href={`/documents/${doc.id}`}
                    className="grid grid-cols-12 gap-4 p-4 items-center hover:bg-muted/30 transition-colors group"
                  >
                    <div className="col-span-5 flex items-center gap-3 min-w-0">
                      <div className="w-8 h-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center shrink-0">
                        <FileText className="w-4 h-4" />
                      </div>
                      <p className="text-base font-medium text-foreground truncate">
                        {doc.title}
                      </p>
                    </div>
                    <div className="col-span-3">
                      <p className="text-sm text-muted-foreground">
                        {DOCUMENT_TYPE_LABELS[doc.type] || doc.type}
                      </p>
                    </div>
                    <div className="col-span-2">
                      <p className="text-sm text-muted-foreground">
                        {formatDate(doc.createdAt)}
                      </p>
                    </div>
                    <div className="col-span-2 flex justify-end">
                      <div className="flex items-center gap-1.5 text-sm text-primary font-medium hover:underline opacity-0 group-hover:opacity-100 transition-opacity">
                        View <ArrowRight className="w-4 h-4" />
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
