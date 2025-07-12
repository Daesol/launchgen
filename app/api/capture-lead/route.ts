import { NextRequest, NextResponse } from "next/server";
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";

export async function POST(req: NextRequest) {
  const supabase = createRouteHandlerClient({ cookies });
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