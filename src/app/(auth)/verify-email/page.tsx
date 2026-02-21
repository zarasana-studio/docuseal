"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { verifyEmail, resendVerificationEmail } from "@/lib/auth-actions";
import { Check, Loader2, XCircle } from "lucide-react";

function VerifyContent() {
  const params = useSearchParams();
  const token = params.get("token");
  const [status, setStatus] = useState<
    "loading" | "success" | "error" | "resend"
  >("loading");
  const [message, setMessage] = useState("");
  const [resendEmail, setResendEmail] = useState("");
  const [resendLoading, setResendLoading] = useState(false);
  const [resendMessage, setResendMessage] = useState("");

  useEffect(() => {
    if (!token) {
      setStatus("resend");
      setMessage("Enter your email to get a new verification link.");
      return;
    }
    verifyEmail(token).then((result) => {
      if ("error" in result) {
        setStatus("error");
        setMessage(result.error);
      } else {
        setStatus("success");
        setMessage(result.message ?? "Email verified!");
      }
    });
  }, [token]);

  async function handleResend(e: React.FormEvent) {
    e.preventDefault();
    setResendLoading(true);
    const result = await resendVerificationEmail(resendEmail);
    setResendMessage(
      "error" in result ? result.error : (result.message ?? "Sent!"),
    );
    setResendLoading(false);
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-background">
      <div className="gradient-hero fixed inset-0 pointer-events-none" />
      <div className="w-full max-w-md relative">
        <div className="bg-card border border-border rounded-2xl shadow-sm p-10 text-center">
          {status === "loading" && (
            <>
              <Loader2 className="w-12 h-12 animate-spin text-primary mx-auto mb-4" />
              <h2 className="text-xl font-bold text-foreground">
                Verifying your email…
              </h2>
            </>
          )}
          {status === "success" && (
            <>
              <div className="w-14 h-14 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Check className="w-7 h-7 text-green-500" />
              </div>
              <h2 className="text-xl font-bold text-foreground mb-2">
                Email verified!
              </h2>
              <p className="text-muted-foreground text-sm mb-6">{message}</p>
              <Link
                href="/login"
                className="inline-flex items-center gap-2 gradient-primary text-white font-semibold px-6 py-3 rounded-xl text-sm hover:opacity-90 transition-opacity"
              >
                Sign In to Your Account
              </Link>
            </>
          )}
          {status === "error" && (
            <>
              <div className="w-14 h-14 bg-destructive/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <XCircle className="w-7 h-7 text-destructive" />
              </div>
              <h2 className="text-xl font-bold text-foreground mb-2">
                Verification failed
              </h2>
              <p className="text-muted-foreground text-sm mb-6">{message}</p>
              <button
                onClick={() => setStatus("resend")}
                className="text-sm text-primary hover:underline"
              >
                Get a new verification link
              </button>
            </>
          )}
          {status === "resend" && (
            <>
              <h2 className="text-xl font-bold text-foreground mb-2">
                Verify your email
              </h2>
              <p className="text-muted-foreground text-sm mb-6">{message}</p>
              {resendMessage ? (
                <p className="text-sm text-green-500">{resendMessage}</p>
              ) : (
                <form onSubmit={handleResend} className="space-y-3">
                  <input
                    type="email"
                    required
                    value={resendEmail}
                    onChange={(e) => setResendEmail(e.target.value)}
                    placeholder="your@email.com"
                    className="w-full px-3.5 py-2.5 border border-input rounded-xl text-sm bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                  />
                  <button
                    type="submit"
                    disabled={resendLoading}
                    className="w-full gradient-primary text-white font-semibold py-3 rounded-xl text-sm hover:opacity-90 transition-opacity disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    {resendLoading && (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    )}
                    Send Verification Email
                  </button>
                </form>
              )}
            </>
          )}
          <Link
            href="/"
            className="block text-xs text-muted-foreground mt-6 hover:text-foreground transition-colors"
          >
            ← Back to home
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function VerifyEmailPage() {
  return (
    <Suspense fallback={null}>
      <VerifyContent />
    </Suspense>
  );
}
