"use client";
import { useState } from "react";

interface LeadFormProps {
  pageId: string;
}

export default function LeadForm({ pageId }: LeadFormProps) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess(false);
    setLoading(true);
    try {
      const res = await fetch("/api/capture-lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ page_id: pageId, name, email }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to submit");
      setSuccess(true);
      setName("");
      setEmail("");
    } catch (e: any) {
      setError(e.message || "Failed to submit");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 bg-white/80 rounded-lg p-6 shadow">
      <h3 className="text-xl font-bold mb-2 text-slate-900">Get in Touch / Join Waitlist</h3>
      <input
        className="w-full px-4 py-2 border rounded focus:ring-2 focus:ring-purple-500 text-black"
        placeholder="Your Name"
        value={name}
        onChange={e => setName(e.target.value)}
        disabled={loading}
      />
      <input
        className="w-full px-4 py-2 border rounded focus:ring-2 focus:ring-purple-500 text-black"
        placeholder="Your Email"
        type="email"
        value={email}
        onChange={e => setEmail(e.target.value)}
        required
        disabled={loading}
      />
      {error && <div className="text-red-500 text-sm">{error}</div>}
      {success && <div className="text-green-600 text-sm">Thank you! We'll be in touch soon.</div>}
      <button
        type="submit"
        className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 text-white py-2 rounded-lg font-semibold shadow-lg hover:from-purple-700 hover:to-indigo-700 transition text-lg disabled:opacity-60"
        disabled={loading || !email}
      >
        {loading ? "Submitting..." : "Submit"}
      </button>
    </form>
  );
} 