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
  const [googleLoading, setGoogleLoading] = useState(false);
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

    // Check if user is already authenticated
    const checkAuth = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        router.push("/dashboard");
        router.refresh();
      }
    };

    checkAuth();

    // Listen for auth state changes and redirect if user is already signed in
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_IN' && session) {
        router.push("/dashboard");
        router.refresh();
      }
    });

    return () => subscription.unsubscribe();
  }, [router]);

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
        const { data, error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        
        // Wait a moment for the auth state to update, then redirect
        if (data.user) {
          setTimeout(() => {
            router.push("/dashboard");
            router.refresh(); // Force a refresh to ensure middleware runs
          }, 100);
        }
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

  const handleGoogleSignIn = async () => {
    setGoogleLoading(true);
    setError("");
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: typeof window !== "undefined" ? window.location.origin : undefined,
        },
      });
      if (error) {
        throw error;
      }
    } catch (e: any) {
      setError(e.message || "Google sign-in failed");
      setGoogleLoading(false);
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
          <img src="/images/logos/default-launchgen-logo.png" alt="LaunchGen Logo" className="mx-auto mb-8 w-24 h-24 animate-fade-in-up delay-200" />
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
              
              {/* Divider */}
              <div className="relative my-6 animate-fade-in-up delay-500">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-slate-300"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white text-slate-500">or</span>
                </div>
              </div>
              
              {/* Google Sign In Button */}
              <button
                type="button"
                onClick={handleGoogleSignIn}
                className="w-full flex items-center justify-center gap-3 bg-white border border-slate-300 text-slate-700 font-semibold py-3 rounded-lg shadow hover:bg-slate-50 transition animate-fade-in-up delay-600 disabled:opacity-60"
                disabled={googleLoading}
              >
                <svg className="w-5 h-5" viewBox="0 0 48 48"><g><path fill="#4285F4" d="M24 9.5c3.54 0 6.7 1.22 9.19 3.23l6.85-6.85C35.64 2.36 30.18 0 24 0 14.82 0 6.71 5.82 2.69 14.09l7.98 6.2C12.13 13.13 17.56 9.5 24 9.5z"/><path fill="#34A853" d="M46.1 24.55c0-1.64-.15-3.22-.42-4.74H24v9.01h12.42c-.54 2.9-2.18 5.36-4.65 7.01l7.19 5.6C43.98 37.13 46.1 31.36 46.1 24.55z"/><path fill="#FBBC05" d="M10.67 28.29c-1.01-2.99-1.01-6.21 0-9.2l-7.98-6.2C.9 16.36 0 20.06 0 24c0 3.94.9 7.64 2.69 11.11l7.98-6.2z"/><path fill="#EA4335" d="M24 48c6.18 0 11.36-2.05 15.15-5.57l-7.19-5.6c-2.01 1.35-4.58 2.15-7.96 2.15-6.44 0-11.87-3.63-14.33-8.89l-7.98 6.2C6.71 42.18 14.82 48 24 48z"/><path fill="none" d="M0 0h48v48H0z"/></g></svg>
                {googleLoading ? "Signing in..." : `Sign ${mode === "signin" ? "in" : "up"} with Google`}
              </button>
              <div className="mt-8 text-center animate-fade-in-up delay-700">
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
        .delay-600 { animation-delay: 0.6s; }
        .delay-700 { animation-delay: 0.7s; }
      `}</style>
    </div>
  );
} 