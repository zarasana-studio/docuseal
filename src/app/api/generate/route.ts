import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/db";
import { generateDocument } from "@/lib/ai";
import { PLAN_LIMITS, isWithinLimit } from "@/lib/plans";
import { z } from "zod";

const schema = z.object({
  documentType: z.enum([
    "PRIVACY_POLICY",
    "TERMS_OF_SERVICE",
    "NDA",
    "CLIENT_CONTRACT",
    "FREELANCER_AGREEMENT",
    "COOKIE_POLICY",
    "EMPLOYMENT_CONTRACT",
    "REFUND_POLICY",
  ]),
  answers: z.record(z.string()),
});

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.errors[0].message },
      { status: 400 }
    );
  }

  const { documentType, answers } = parsed.data;

  // Get user subscription
  const subscription = await prisma.subscription.findUnique({
    where: { userId: session.user.id },
  });

  const plan = subscription?.plan ?? "FREE";
  const limits = PLAN_LIMITS[plan];

  // Check if this doc type is allowed on this plan
  const FREE_TYPES = ["PRIVACY_POLICY", "TERMS_OF_SERVICE", "NDA"];
  if (plan === "FREE" && !FREE_TYPES.includes(documentType)) {
    return NextResponse.json(
      { error: "Upgrade to Starter to access this document type.", upgradeRequired: true },
      { status: 403 }
    );
  }

  // Check monthly usage
  const monthStart = new Date();
  monthStart.setDate(1);
  monthStart.setHours(0, 0, 0, 0);

  const usedThisMonth = await prisma.document.count({
    where: {
      userId: session.user.id,
      createdAt: { gte: monthStart },
    },
  });

  if (!isWithinLimit(plan, usedThisMonth)) {
    return NextResponse.json(
      {
        error: `You've used all ${limits.docsPerMonth} documents for this month. Upgrade to generate more.`,
        upgradeRequired: true,
        usedThisMonth,
        limit: limits.docsPerMonth,
      },
      { status: 429 }
    );
  }

  // Validate required answers
  if (!answers.businessName && !answers.disclosingParty) {
    return NextResponse.json(
      { error: "Please fill in all required fields." },
      { status: 400 }
    );
  }

  // Generate document content via AI
  let content: string;
  try {
    content = await generateDocument(documentType, answers);
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Unknown error";
    console.error("AI generation error:", msg);
    return NextResponse.json(
      { error: "Document generation failed. Please try again." },
      { status: 500 }
    );
  }

  // Save document to database
  const doc = await prisma.document.create({
    data: {
      userId: session.user.id,
      type: documentType,
      title: `${documentType.replace(/_/g, " ")} — ${answers.businessName ?? answers.disclosingParty}`,
      content,
      answers,
      wordCount: content.split(/\s+/).length,
      isWatermarked: limits.watermark,
      status: "DRAFT",
    },
  });

  // Log usage
  await prisma.usageRecord.create({
    data: {
      userId: session.user.id,
      action: "generate_document",
      metadata: { documentType, documentId: doc.id },
    },
  });

  return NextResponse.json({
    id: doc.id,
    content,
    isWatermarked: limits.watermark,
    usedThisMonth: usedThisMonth + 1,
    limit: limits.docsPerMonth === -1 ? "unlimited" : limits.docsPerMonth,
  });
}
