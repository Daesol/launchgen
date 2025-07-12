import { NextRequest, NextResponse } from "next/server";
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import crypto from "crypto";

export async function POST(req: NextRequest) {
  const supabase = createRouteHandlerClient({ cookies });
  const { landing_page_id, event_type, referrer, utm_source, session_id } = await req.json();
  const user_agent = req.headers.get("user-agent") || "";
  const ip = req.headers.get("x-forwarded-for") || req.ip || "";
  // Hash IP for privacy
  const ip_address = ip ? crypto.createHash("sha256").update(ip).digest("hex") : null;

  if (!landing_page_id || !event_type) {
    return NextResponse.json({ error: "Missing landing_page_id or event_type" }, { status: 400 });
  }

  const { error } = await supabase.from("analytics_events").insert({
    landing_page_id,
    event_type,
    user_agent,
    ip_address,
    referrer,
    utm_source,
    session_id,
  });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
} 