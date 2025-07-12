"use client";

import { useState, useEffect } from "react";
import { useSearchParams, usePathname, useRouter } from "next/navigation";
import { createPagesBrowserClient } from "@supabase/auth-helpers-nextjs";

const supabase = createPagesBrowserClient();

export default function SignInPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [modeReady, setModeReady] = useState(false);
  const searchParams = typeof window !== "undefined" ? new URLSearchParams(window.location.search) : null;
  useEffect(() => {
    if (searchParams) {
      const urlMode = searchParams.get("mode");
      if (urlMode === "signup") setMode("signup");
      if (urlMode === "signin") setMode("signin");
    }
    // If on /auth/signup path, default to signup mode
    if (typeof window !== "undefined" && window.location.pathname.endsWith("/signup")) {
      setMode("signup");
    }
    setModeReady(true);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);
    if (!email || !password) {
      setError("Email and password are required.");
      setLoading(false);
      return;
    }
    try {
      if (mode === "signin") {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        router.push("/dashboard");
        return;
      } else {
        const { error } = await supabase.auth.signUp({ email, password });
        if (error) throw error;
        setSuccess("Check your email to confirm your account.");
      }
    } catch (err: any) {
      setError(err.message || "An error occurred.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-stretch bg-gradient-to-br from-purple-700 via-indigo-900 to-slate-950">
      {/* Left branding/illustration panel */}
      <div className="hidden md:flex flex-col justify-center items-center w-1/2 bg-gradient-to-br from-purple-600/80 to-indigo-900/80 text-white p-12 relative overflow-hidden animate-fade-in-left">
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_top_left,_var(--tw-gradient-stops))] from-purple-400/30 via-transparent to-transparent pointer-events-none" />
        <div className="z-10 text-center">
          <h1 className="text-4xl font-extrabold mb-4 drop-shadow-lg tracking-tight animate-fade-in-up">Welcome to LaunchGen</h1>
          <p className="text-lg mb-8 text-purple-100 animate-fade-in-up delay-100">AI-powered landing pages, leads, and analytics—all in one place.</p>
          <img src="/logo.svg" alt="LaunchGen Logo" className="mx-auto mb-8 w-24 h-24 animate-fade-in-up delay-200" />
          <div className="text-sm text-purple-200 animate-fade-in-up delay-300">Start building your next big idea today.</div>
        </div>
      </div>
      {/* Right form panel */}
      <div className="flex flex-col justify-center items-center w-full md:w-1/2 bg-white/90 p-8 md:p-16 min-h-screen animate-fade-in-right">
        <div className="w-full max-w-md mx-auto">
          {modeReady && (
            <>
              <h2 className="text-3xl font-bold mb-2 text-slate-900 text-center animate-fade-in-up">{mode === "signin" ? "Sign In" : "Sign Up"}</h2>
              <p className="text-slate-500 mb-8 text-center animate-fade-in-up delay-100">
                {mode === "signin" ? "Welcome back! Log in to your account." : "Create your LaunchGen account."}
              </p>
              <form onSubmit={handleSubmit} className="space-y-6 animate-fade-in-up delay-200">
                <div>
                  <label htmlFor="email" className="block text-slate-700 font-medium mb-1">Email</label>
                  <input
                    id="email"
                    type="email"
                    placeholder="you@email.com"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-slate-900 bg-white shadow-sm transition"
                    required
                    autoComplete="email"
                  />
                </div>
                <div>
                  <label htmlFor="password" className="block text-slate-700 font-medium mb-1">Password</label>
                  <input
                    id="password"
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-slate-900 bg-white shadow-sm transition"
                    required
                    autoComplete={mode === "signin" ? "current-password" : "new-password"}
                  />
                </div>
                {error && <div className="text-red-500 text-sm animate-fade-in-up delay-300">{error}</div>}
                {success && <div className="text-green-600 text-sm animate-fade-in-up delay-300">{success}</div>}
                <button
                  type="submit"
                  className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 text-white py-3 rounded-lg font-semibold shadow-lg hover:from-purple-700 hover:to-indigo-700 transition text-lg animate-fade-in-up delay-400 disabled:opacity-60"
                  disabled={loading}
                >
                  {loading ? "Loading..." : mode === "signin" ? "Sign In" : "Sign Up"}
                </button>
              </form>
              <div className="mt-8 text-center animate-fade-in-up delay-500">
                {mode === "signin" ? (
                  <span>
                    Don&apos;t have an account?{' '}
                    <button
                      className="text-purple-600 hover:underline font-semibold"
                      onClick={() => setMode("signup")}
                    >
                      Sign Up
                    </button>
                  </span>
                ) : (
                  <span>
                    Already have an account?{' '}
                    <button
                      className="text-purple-600 hover:underline font-semibold"
                      onClick={() => setMode("signin")}
                    >
                      Sign In
                    </button>
                  </span>
                )}
              </div>
            </>
          )}
        </div>
      </div>
      {/* Animations */}
      <style jsx global>{`
        @keyframes fade-in-left {
          from { opacity: 0; transform: translateX(-40px); }
          to { opacity: 1; transform: translateX(0); }
        }
        @keyframes fade-in-right {
          from { opacity: 0; transform: translateX(40px); }
          to { opacity: 1; transform: translateX(0); }
        }
        @keyframes fade-in-up {
          from { opacity: 0; transform: translateY(24px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in-left { animation: fade-in-left 0.8s cubic-bezier(.4,0,.2,1) both; }
        .animate-fade-in-right { animation: fade-in-right 0.8s cubic-bezier(.4,0,.2,1) both; }
        .animate-fade-in-up { animation: fade-in-up 0.7s cubic-bezier(.4,0,.2,1) both; }
        .delay-100 { animation-delay: 0.1s; }
        .delay-200 { animation-delay: 0.2s; }
        .delay-300 { animation-delay: 0.3s; }
        .delay-400 { animation-delay: 0.4s; }
        .delay-500 { animation-delay: 0.5s; }
      `}</style>
    </div>
  );
} 