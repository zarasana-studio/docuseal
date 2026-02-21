import { auth } from "@/auth";
import { prisma } from "@/lib/db";
import { notFound, redirect } from "next/navigation";
import { DocumentEditor } from "@/components/DocumentEditor";
import type { Metadata } from "next";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const session = await auth();
  if (!session?.user?.id) return { title: "Document" };

  const { id } = await params;

  const document = await prisma.document.findUnique({
    where: {
      id,
      userId: session.user.id,
    },
  });

  return {
    title: document?.title || "Document",
    robots: { index: false, follow: false },
  };
}

export default async function DocumentPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const { id } = await params;

  const document = await prisma.document.findUnique({
    where: {
      id,
      userId: session.user.id,
    },
  });

  if (!document) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-background pl-60">
      <main className="p-8">
        <div className="max-w-5xl mx-auto">
          {/* We pass the document data to a client component for interactive editing */}
          <DocumentEditor
            id={document.id}
            initialTitle={document.title}
            initialContent={document.content}
            type={document.type}
            createdAt={document.createdAt}
            status={document.status}
            isWatermarked={document.isWatermarked}
            userPlan={session.user.name === "Free" ? "FREE" : "PAID"}
          />
        </div>
      </main>
    </div>
  );
}
