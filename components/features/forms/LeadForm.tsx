"use client";
import { useState, useEffect, useRef } from "react";

interface LeadFormProps {
  pageId: string;
  theme?: {
    accentColor: string;
    mode: "white" | "black";
  };
  ctaText?: string;
  previewMode?: 'desktop' | 'mobile';
}

export default function LeadForm({ pageId, theme, ctaText = "Submit", previewMode = 'desktop' }: LeadFormProps) {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const accent = theme?.accentColor || "#6366f1";
  const isDark = theme?.mode === "black";
  const inputBg = isDark ? "bg-slate-800/80 text-white" : "bg-white text-black";
  const borderClass = isDark ? "border-slate-700" : "border-slate-300";

  // Debug theme changes and set placeholder color
  useEffect(() => {
    console.log('LeadForm theme changed:', theme);
    console.log('isDark:', isDark);
    console.log('inputBg classes:', inputBg);
    console.log('placeholder color:', isDark ? '#cbd5e1' : '#000000');
    
    // Directly set placeholder color via DOM manipulation
    if (inputRef.current) {
      const placeholderColor = isDark ? '#cbd5e1' : '#000000';
      inputRef.current.style.setProperty('--placeholder-color', placeholderColor);
      
      // Create a style element if it doesn't exist
      let styleElement = document.getElementById('leadform-placeholder-style');
      if (!styleElement) {
        styleElement = document.createElement('style');
        styleElement.id = 'leadform-placeholder-style';
        document.head.appendChild(styleElement);
      }
      
      // Update the style
      styleElement.textContent = `
        #leadform-input::placeholder {
          color: ${placeholderColor} !important;
        }
      `;
    }
  }, [theme, isDark, inputBg]);

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

  const isMobilePreview = previewMode === 'mobile';

  return (
    <div className="w-full flex justify-center">
      <form onSubmit={handleSubmit} className={`flex gap-2 items-stretch ${
        isMobilePreview ? 'flex-col w-full' : 'flex-col sm:flex-row sm:items-center'
      }`}>
      <input
          ref={inputRef}
          id="leadform-input"
          className={`px-4 py-2 border rounded focus:ring-2 focus:ring-opacity-60 focus:outline-none ${inputBg} ${borderClass}`}
          style={{
            borderColor: accent,
            boxShadow: `0 0 0 2px ${accent}22`,
            minWidth: isMobilePreview ? '100%' : '200px',
            width: isMobilePreview ? '100%' : '280px',
            color: isDark ? '#f8fafc' : '#000000'
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
          className={`font-semibold px-6 py-2 rounded-lg shadow transition whitespace-nowrap ${
            isMobilePreview ? 'w-full text-sm' : 'text-base w-full sm:w-auto'
          }`}
          style={{
            background: accent,
            color: isDark ? "#fff" : "#fff",
            boxShadow: `0 2px 8px 0 ${accent}33`,
            border: `1px solid ${accent}`,
            minWidth: isMobilePreview ? '100%' : '140px'
          }}
          disabled={loading || !validateEmail(email)}
          aria-label={ctaText}
      >
          {loading ? "..." : ctaText}
      </button>
    </form>
      {(error || success) && (
        <div className="mt-2 min-h-[1.5em]">
          {error && <div className={`text-red-500 ${isMobilePreview ? 'text-xs' : 'text-xs'}`}>{error}</div>}
          {success && <div className={`text-green-600 ${isMobilePreview ? 'text-xs' : 'text-xs'}`}>Thank you!</div>}
        </div>
      )}
    </div>
  );
} 