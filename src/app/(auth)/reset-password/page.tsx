"use client";

import { useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { resetPassword } from "@/lib/auth-actions";
import { Eye, EyeOff, Loader2, Check } from "lucide-react";

function ResetContent() {
  const params = useSearchParams();
  const router = useRouter();
  const token = params.get("token") ?? "";

  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    if (password !== confirm) {
      setError("Passwords do not match.");
      return;
    }
    if (!token) {
      setError("Invalid reset link. Please request a new one.");
      return;
    }
    setLoading(true);
    const result = await resetPassword(token, password);
    if ("error" in result) {
      setError(result.error);
    } else {
      setDone(true);
      setTimeout(() => router.push("/login"), 2000);
    }
    setLoading(false);
  }

  if (done) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4 bg-background">
        <div className="gradient-hero fixed inset-0 pointer-events-none" />
        <div className="bg-card border border-border rounded-2xl p-10 text-center max-w-sm w-full relative">
          <div className="w-14 h-14 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <Check className="w-7 h-7 text-green-500" />
          </div>
          <h2 className="text-xl font-bold text-foreground mb-2">
            Password updated!
          </h2>
          <p className="text-muted-foreground text-sm">
            Redirecting you to sign in…
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-background">
      <div className="gradient-hero fixed inset-0 pointer-events-none" />
      <div className="w-full max-w-md relative">
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2 mb-6">
            <div className="w-9 h-9 rounded-xl gradient-primary flex items-center justify-center text-white font-bold">
              D
            </div>
            <span className="font-bold text-xl">DocuSeal</span>
          </Link>
        </div>
        <div className="bg-card border border-border rounded-2xl shadow-sm p-8">
          <h1 className="text-2xl font-bold text-foreground mb-1">
            Set new password
          </h1>
          <p className="text-muted-foreground text-sm mb-6">
            Choose a strong password for your account.
          </p>
          {error && (
            <div className="bg-destructive/10 border border-destructive/20 text-destructive text-sm rounded-lg px-4 py-3 mb-5">
              {error}
              {error.includes("expired") && (
                <>
                  {" "}
                  <Link href="/forgot-password" className="underline">
                    Request a new link
                  </Link>
                </>
              )}
            </div>
          )}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-1.5">
                New password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-3.5 py-2.5 border border-input rounded-xl text-sm bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring pr-10"
                  placeholder="8+ characters"
                  minLength={8}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                  tabIndex={-1}
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-1.5">
                Confirm password
              </label>
              <input
                type="password"
                required
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                className="w-full px-3.5 py-2.5 border border-input rounded-xl text-sm bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                placeholder="Repeat password"
              />
              {confirm && password !== confirm && (
                <p className="text-xs text-destructive mt-1">
                  Passwords don&apos;t match
                </p>
              )}
            </div>
            <button
              type="submit"
              disabled={loading || (!!confirm && password !== confirm)}
              className="w-full gradient-primary text-white font-semibold py-3 rounded-xl text-sm hover:opacity-90 transition-opacity disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {loading && <Loader2 className="w-4 h-4 animate-spin" />}
              Reset Password
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={null}>
      <ResetContent />
    </Suspense>
  );
}
