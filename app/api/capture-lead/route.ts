import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export async function POST(req: NextRequest) {
  // Use service role client for lead capture to bypass RLS
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
  try {
    const { page_id, name, email, source, metadata } = await req.json();
    if (!page_id || !email) {
      return NextResponse.json({ error: "page_id and email are required." }, { status: 400 });
    }
    const { data, error } = await supabase.from("leads").insert([
      {
        page_id,
        name,
        email,
        source,
        metadata,
      },
    ]).select().single();
    if (error) throw error;
    return NextResponse.json({ lead: data });
  } catch (e: any) {
    return NextResponse.json({ error: e.message || "Failed to capture lead." }, { status: 500 });
  }
} 