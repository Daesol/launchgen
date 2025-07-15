"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function SignUpPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const router = useRouter();

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
      const { error } = await supabase.auth.signUp({ email, password });
      if (error) throw error;
      setSuccess("Check your email to confirm your account.");
      // Optionally, redirect to dashboard if you want to auto-login after sign-up
      // router.push("/dashboard");
    } catch (err: any) {
      setError(err.message || "An error occurred.");
    } finally {
      setLoading(false);
    }
  };

  return null;
} 