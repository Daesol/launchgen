"use client";
import { useState } from "react";

interface LeadFormProps {
  pageId: string;
  theme?: {
    accentColor: string;
    mode: "white" | "black";
  };
  ctaText?: string;
}

export default function LeadForm({ pageId, theme, ctaText = "Submit" }: LeadFormProps) {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const accent = theme?.accentColor || "#6366f1";
  const isDark = theme?.mode === "black";
  const inputBg = isDark ? "bg-slate-800/80 text-white placeholder:text-slate-400" : "bg-white text-black placeholder:text-slate-400";
  const borderClass = isDark ? "border-slate-700" : "border-slate-300";

  const validateEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess(false);
    if (!validateEmail(email)) {
      setError("Please enter a valid email address.");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/capture-lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ page_id: pageId, email }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to submit");
      setSuccess(true);
      setEmail("");
      // Analytics: Track form_submit event
      if (pageId) {
        let session_id = localStorage.getItem(`lg_session_${pageId}`);
        fetch("/api/analytics", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            landing_page_id: pageId,
            event_type: "form_submit",
            session_id,
          }),
        });
      }
    } catch (e: any) {
      setError(e.message || "Failed to submit");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full">
      <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row w-full gap-2 sm:gap-2 items-stretch sm:items-center">
        <input
          className={`flex-1 px-4 py-2 border rounded focus:ring-2 focus:ring-opacity-60 focus:outline-none ${inputBg} ${borderClass}`}
          style={{
            borderColor: accent,
            boxShadow: `0 0 0 2px ${accent}22`
          }}
          placeholder="Your Email"
          type="email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          required
          disabled={loading}
          aria-label="Email address"
        />
        <button
          type="submit"
          className="font-semibold px-5 py-2 rounded-lg shadow transition text-base disabled:opacity-60 w-full sm:w-auto"
          style={{
            background: accent,
            color: isDark ? "#fff" : "#fff",
            boxShadow: `0 2px 8px 0 ${accent}33`,
            border: `1px solid ${accent}`,
          }}
          disabled={loading || !validateEmail(email)}
          aria-label={ctaText}
        >
          {loading ? "..." : ctaText}
        </button>
      </form>
      {(error || success) && (
        <div className="mt-2 min-h-[1.5em]">
          {error && <div className="text-red-500 text-xs">{error}</div>}
          {success && <div className="text-green-600 text-xs">Thank you!</div>}
        </div>
      )}
    </div>
  );
} 