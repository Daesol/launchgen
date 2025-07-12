import { NextRequest, NextResponse } from "next/server";
import { generatePageConfig } from "@/lib/openai";
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";

export async function POST(req: NextRequest) {
  const supabase = createRouteHandlerClient({ cookies });
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) {
    return NextResponse.json({ error: "Not authenticated." }, { status: 401 });
  }
  try {
    const { prompt } = await req.json();
    if (!prompt || typeof prompt !== "string") {
      return NextResponse.json({ error: "Prompt is required." }, { status: 400 });
    }
    const config = await generatePageConfig(prompt);
    return NextResponse.json({ config });
  } catch (error: any) {
    return NextResponse.json({
      error: "There was an error generating the landing page. This sometimes happens with the AI, but it can usually be fixed if you press the 'Generate' button 2-3 more times. (Technical details: " + (error.message || "Unknown error") + ")"
    }, { status: 500 });
  }
} 