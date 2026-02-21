"use server";

import { prisma } from "@/lib/db";
import { sendVerificationEmail, sendPasswordResetEmail } from "@/lib/email";
import { generateToken } from "@/lib/utils";
import { signIn } from "@/auth";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { AuthError } from "next-auth";

const signupSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .regex(/[A-Z]/, "Must contain at least one uppercase letter")
    .regex(/[0-9]/, "Must contain at least one number"),
});

type ActionResult = { success: true; message?: string } | { error: string };

export async function signup(formData: FormData): Promise<ActionResult> {
  const raw = {
    name: formData.get("name") as string,
    email: formData.get("email") as string,
    password: formData.get("password") as string,
  };

  const parsed = signupSchema.safeParse(raw);
  if (!parsed.success) {
    return { error: parsed.error.errors[0].message };
  }

  const { name, email, password } = parsed.data;
  const normalizedEmail = email.toLowerCase();

  // Check for existing user
  const existing = await prisma.user.findUnique({
    where: { email: normalizedEmail },
  });
  if (existing) {
    return { error: "An account with this email already exists." };
  }

  const hashedPassword = await bcrypt.hash(password, 12);

  const user = await prisma.user.create({
    data: {
      name,
      email: normalizedEmail,
      password: hashedPassword,
    },
  });

  // Create email verification token (expires in 24h)
  const token = generateToken();
  await prisma.verificationToken.create({
    data: {
      userId: user.id,
      token,
      expires: new Date(Date.now() + 24 * 60 * 60 * 1000),
    },
  });

  await sendVerificationEmail(normalizedEmail, token);

  // Create free subscription
  await prisma.subscription.create({
    data: { userId: user.id, plan: "FREE", status: "ACTIVE" },
  });

  return { success: true, message: "Check your email to verify your account." };
}

export async function verifyEmail(token: string): Promise<ActionResult> {
  if (!token) return { error: "Invalid verification link." };

  const record = await prisma.verificationToken.findUnique({
    where: { token },
    include: { user: true },
  });

  if (!record) return { error: "Invalid or expired verification link." };
  if (record.used) return { error: "This link has already been used." };
  if (record.expires < new Date()) {
    return { error: "This link has expired. Please request a new one." };
  }

  // Mark token used and verify user
  await prisma.$transaction([
    prisma.verificationToken.update({ where: { id: record.id }, data: { used: true } }),
    prisma.user.update({
      where: { id: record.userId },
      data: { emailVerified: new Date() },
    }),
  ]);

  return { success: true, message: "Email verified! You can now sign in." };
}

export async function resendVerificationEmail(email: string): Promise<ActionResult> {
  const user = await prisma.user.findUnique({ where: { email: email.toLowerCase() } });
  if (!user) return { error: "No account found with that email." };
  if (user.emailVerified) return { error: "Email already verified." };

  // Invalidate existing tokens
  await prisma.verificationToken.updateMany({
    where: { userId: user.id, used: false },
    data: { used: true },
  });

  const token = generateToken();
  await prisma.verificationToken.create({
    data: {
      userId: user.id,
      token,
      expires: new Date(Date.now() + 24 * 60 * 60 * 1000),
    },
  });

  await sendVerificationEmail(email, token);
  return { success: true, message: "Verification email sent!" };
}

export async function requestPasswordReset(email: string): Promise<ActionResult> {
  const user = await prisma.user.findUnique({ where: { email: email.toLowerCase() } });

  // Always return success to prevent email enumeration
  if (!user || !user.password) {
    return { success: true, message: "If that email exists, we've sent reset instructions." };
  }

  // Invalidate old tokens
  await prisma.passwordResetToken.updateMany({
    where: { userId: user.id, used: false },
    data: { used: true },
  });

  const token = generateToken();
  await prisma.passwordResetToken.create({
    data: {
      userId: user.id,
      token,
      expires: new Date(Date.now() + 60 * 60 * 1000), // 1 hour
    },
  });

  await sendPasswordResetEmail(email, token);
  return { success: true, message: "If that email exists, we've sent reset instructions." };
}

export async function resetPassword(
  token: string,
  newPassword: string
): Promise<ActionResult> {
  if (!token || !newPassword) return { error: "Invalid request." };

  const passwordSchema = z.string().min(8).regex(/[A-Z]/).regex(/[0-9]/);
  if (!passwordSchema.safeParse(newPassword).success) {
    return { error: "Password must be 8+ chars with uppercase and number." };
  }

  const record = await prisma.passwordResetToken.findUnique({ where: { token } });
  if (!record) return { error: "Invalid or expired link." };
  if (record.used) return { error: "This link has already been used." };
  if (record.expires < new Date()) return { error: "Link has expired. Request a new one." };

  const hashedPassword = await bcrypt.hash(newPassword, 12);

  await prisma.$transaction([
    prisma.passwordResetToken.update({ where: { id: record.id }, data: { used: true } }),
    prisma.user.update({
      where: { id: record.userId },
      data: { password: hashedPassword },
    }),
  ]);

  return { success: true, message: "Password updated! You can now sign in." };
}

export async function loginWithCredentials(
  email: string,
  password: string,
  callbackUrl?: string
): Promise<ActionResult> {
  try {
    await signIn("credentials", {
      email,
      password,
      redirect: false,
    });
    return { success: true };
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case "CredentialsSignin":
          return { error: "Invalid email or password." };
        default:
          if (error.message.includes("EMAIL_NOT_VERIFIED")) {
            return { error: "Please verify your email before signing in." };
          }
          return { error: "Something went wrong. Please try again." };
      }
    }
    throw error;
  }
}
