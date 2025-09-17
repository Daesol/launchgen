import { NextRequest, NextResponse } from "next/server";
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";

export async function POST(req: NextRequest) {
  const supabase = createRouteHandlerClient({ cookies });
  const { data: { user }, error: userError } = await supabase.auth.getUser();
  if (userError || !user) {
    return NextResponse.json({ error: "Not authenticated." }, { status: 401 });
  }
  try {
    const { prompt, existingConfig } = await req.json();
    if (!prompt || typeof prompt !== "string") {
      return NextResponse.json({ error: "Prompt is required." }, { status: 400 });
    }
    
    // Dynamic import to prevent build-time execution
    const { generatePageConfig } = await import("@/lib/openai");
    
    // If existingConfig is provided, this is a regeneration
    if (existingConfig) {
      const config = await generatePageConfig(prompt, existingConfig);
      return NextResponse.json({ success: true, config });
    } else {
      // This is a new generation
    const config = await generatePageConfig(prompt);
      return NextResponse.json({ success: true, config });
    }
  } catch (error: any) {
    return NextResponse.json({
      error: "There was an error generating the landing page. This sometimes happens with the AI, but it can usually be fixed if you press the 'Generate' button 2-3 more times. (Technical details: " + (error.message || "Unknown error") + ")"
    }, { status: 500 });
  }
} 