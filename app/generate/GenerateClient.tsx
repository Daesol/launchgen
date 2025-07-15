"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";

const PageEditor = dynamic(() => import("@/components/PageEditor"), { ssr: false });

export default function GenerateClient() {
  const [prompt, setPrompt] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [config, setConfig] = useState<any>(null);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setConfig(null);
    setLoading(true);
    
    try {
      // Step 1: Generate the page config
      const res = await fetch("/api/generate-page", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to generate page");
      
      // Debug: Log the generated config
      console.log('AI Generated Config:', data.config);
      
      // Step 2: Save the generated page to database
      const pageConfig = {
        page_content: {
          business: data.config.business || { name: '', logo: '' },
          hero: data.config.hero,
          features: data.config.features,
          featuresTitle: data.config.featuresTitle,
          featuresSubtitle: data.config.featuresSubtitle,
          problemSection: data.config.problemSection,
          socialProof: data.config.socialProof,
          guarantees: data.config.guarantees,
          faq: data.config.faq,
          ctaTitle: data.config.ctaTitle,
          ctaSubtitle: data.config.ctaSubtitle,
          urgency: data.config.urgency,
        },
        page_style: {
          theme: data.config.theme,
        },
        template_id: "default",
        original_prompt: prompt // Save the original prompt
      };

      // Debug: Log what's being saved
      console.log('Page Config being saved:', pageConfig);

      const saveRes = await fetch("/api/landing-pages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(pageConfig),
      });
      
      const saveData = await saveRes.json();
      if (!saveRes.ok) throw new Error(saveData.error || "Failed to save page");
      
      // Step 3: Set the config for immediate preview
      setConfig({
        ...pageConfig,
        id: saveData.page.id,
        slug: saveData.page.slug
      });
      
      // Step 4: Trigger page refresh in sidebar and navigate to edit page
      window.dispatchEvent(new Event('refresh-pages'));
      setTimeout(() => {
        router.push(`/dashboard/page/${saveData.page.id}`);
      }, 1000);
      
    } catch (err: any) {
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-purple-700 via-indigo-900 to-slate-950 p-4">
      <div className="bg-white/90 rounded-xl shadow-xl p-8 w-full max-w-lg mt-16 animate-fade-in-up">
        <h1 className="text-3xl font-bold text-center text-slate-900 mb-2">Generate Your Landing Page</h1>
        <p className="text-slate-500 text-center mb-6">Describe your product or idea and let AI create a landing page config for you.</p>
        <form onSubmit={handleSubmit} className="space-y-4">
          <textarea
            className="w-full min-h-[80px] max-h-40 px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-slate-900 bg-white shadow-sm resize-none transition"
            placeholder="e.g. AI-powered meal planning app for busy professionals"
            value={prompt}
            onChange={e => setPrompt(e.target.value)}
            required
            disabled={loading}
          />
          {error && (
            error.includes("There was an error generating the landing page") ? (
              <div className="text-red-500 text-sm animate-fade-in-up delay-200">
                There was an error generating the landing page. This sometimes happens with the AI, but it can usually be fixed if you press the <b>Generate</b> button 2-3 more times.<br/>
                <span className="text-xs text-slate-500">{error.replace("There was an error generating the landing page. This sometimes happens with the AI, but it can usually be fixed if you press the 'Generate' button 2-3 more times. (Technical details: ", "").replace(")", "")}</span>
              </div>
            ) : (
              <div className="text-red-500 text-sm animate-fade-in-up delay-200">{error}</div>
            )
          )}
          <button
            type="submit"
            className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 text-white py-3 rounded-lg font-semibold shadow-lg hover:from-purple-700 hover:to-indigo-700 transition text-lg animate-fade-in-up delay-300 disabled:opacity-60"
            disabled={loading || !prompt.trim()}
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="animate-spin h-5 w-5 text-white" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                </svg>
                Generating...
              </span>
            ) : (
              "Generate"
            )}
          </button>
        </form>
      </div>
      
      {/* Success Message */}
      {config && !loading && (
        <div className="w-full max-w-lg mt-6 animate-fade-in-up">
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-center">
            <div className="flex items-center justify-center gap-2 text-green-600 mb-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <span className="font-semibold">Page Generated Successfully!</span>
            </div>
            <p className="text-green-700 text-sm">Redirecting to editor...</p>
          </div>
        </div>
      )}
      
      {config && (
        <div className="w-full max-w-5xl mt-10 animate-fade-in-up">
          <PageEditor initialConfig={config} />
        </div>
      )}
      
      <style jsx global>{`
        @keyframes fade-in-up {
          from { opacity: 0; transform: translateY(24px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in-up { animation: fade-in-up 0.7s cubic-bezier(.4,0,.2,1) both; }
        .delay-200 { animation-delay: 0.2s; }
        .delay-300 { animation-delay: 0.3s; }
      `}</style>
    </div>
  );
} 