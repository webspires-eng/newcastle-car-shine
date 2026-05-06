"use client";

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { Lock } from "lucide-react";

export default function AdminLoginPage() {
  const router = useRouter();
  const [passcode, setPasscode] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!passcode || submitting) return;
    setError(null);
    setSubmitting(true);
    try {
      const res = await fetch("/api/admin/auth", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ passcode }),
      });
      if (res.ok) {
        router.push("/admin");
        router.refresh();
        return;
      }
      setPasscode("");
      setError("Incorrect passcode");
    } catch {
      setPasscode("");
      setError("Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="fixed inset-0 bg-gray-950 text-white flex items-center justify-center p-6">
      <div className="w-full max-w-sm">
        <div className="flex flex-col items-center mb-10">
          <div className="w-14 h-14 rounded-full bg-amber-500/15 ring-1 ring-amber-400/30 flex items-center justify-center mb-5">
            <Lock className="w-6 h-6 text-amber-400" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight">Sell My Car Newcastle</h1>
          <p className="text-sm text-gray-400 mt-1">Admin sign-in</p>
        </div>

        <form onSubmit={onSubmit} className="space-y-4">
          <input
            type="password"
            inputMode="numeric"
            pattern="[0-9]*"
            autoComplete="off"
            autoFocus
            maxLength={6}
            value={passcode}
            onChange={(e) => setPasscode(e.target.value.replace(/\D/g, "").slice(0, 6))}
            placeholder="••••••"
            className="w-full bg-gray-900 border border-gray-800 rounded-xl px-4 py-4 text-center text-2xl tracking-widest text-white placeholder-gray-700 focus:outline-none focus:ring-2 focus:ring-amber-400/40 focus:border-amber-400/50"
          />

          {error && (
            <div className="text-sm text-red-400 text-center bg-red-500/10 border border-red-500/20 rounded-lg py-2">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={!passcode || submitting}
            className="w-full bg-amber-500 hover:bg-amber-400 disabled:opacity-40 disabled:cursor-not-allowed text-gray-950 font-semibold rounded-xl py-3 transition"
          >
            {submitting ? "Signing in…" : "Sign in"}
          </button>
        </form>
      </div>
    </div>
  );
}
