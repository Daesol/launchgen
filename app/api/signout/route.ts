import { NextRequest, NextResponse } from "next/server";
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";

export async function POST(req: NextRequest) {
  const supabase = createRouteHandlerClient({ cookies });
  await supabase.auth.signOut();
  // Clear the session cookie by setting it to an expired value
  const response = NextResponse.json({ success: true });
  response.cookies.set({
    name: "sb-access-token",
    value: "",
    path: "/",
    maxAge: 0,
  });
  response.cookies.set({
    name: "sb-refresh-token",
    value: "",
    path: "/",
    maxAge: 0,
  });
  // Redirect to signin page
  return NextResponse.redirect(new URL('/auth/signin', req.url));
} 