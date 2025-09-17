"use client";
import { createPagesBrowserClient } from "@supabase/auth-helpers-nextjs";

export function useAuthActions() {
  const supabase = createPagesBrowserClient();

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    setTimeout(() => {
      window.location.href = '/';
    }, 100);
  };

  return {
    handleSignOut
  };
}
