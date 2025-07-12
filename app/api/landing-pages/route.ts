import { NextRequest, NextResponse } from "next/server";
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";

export async function POST(req: NextRequest) {
  const supabase = createRouteHandlerClient({ cookies });
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) {
    return NextResponse.json({ error: "Not authenticated." }, { status: 401 });
  }
  try {
    const { id, template_id, page_content, page_style } = await req.json();
    if (!page_content || typeof page_content !== "object") {
      return NextResponse.json({ error: "page_content is required." }, { status: 400 });
    }
    if (!page_style || typeof page_style !== "object") {
      return NextResponse.json({ error: "page_style is required." }, { status: 400 });
    }
    const owner_id = session.user.id;
    const title = page_content.hero?.headline || "Untitled";
    let slug;
    if (id) {
      // Fetch existing page to get slug
      const { data: existing, error: fetchError } = await supabase
        .from("landing_pages")
        .select("slug")
        .eq("id", id)
        .single();
      if (fetchError || !existing?.slug) {
        return NextResponse.json({ error: "Could not find existing landing page to update." }, { status: 400 });
      }
      slug = existing.slug;
    } else {
      // Generate a unique slug if creating new
      slug =
        title
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, "-")
          .replace(/(^-|-$)/g, "")
          .slice(0, 32) +
        "-" +
        Math.random().toString(36).slice(2, 8);
    }
    // Upsert landing page (update if id, insert if not)
    const upsertData: any = {
      title,
      owner_id,
      template_id: template_id || "default",
      page_content,
      page_style,
      slug,
    };
    if (id) upsertData["id"] = id;
    const { data: page, error: dbError } = await supabase
      .from("landing_pages")
      .upsert([upsertData])
      .select()
      .single();
    if (dbError) throw dbError;
    return NextResponse.json({ page });
  } catch (e: any) {
    return NextResponse.json({ error: e.message || "Failed to save landing page." }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  // PATCH is identical to POST for upsert, but more RESTful for updates
  return POST(req);
}

export async function DELETE(req: NextRequest) {
  const supabase = createRouteHandlerClient({ cookies });
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) {
    return NextResponse.json({ error: "Not authenticated." }, { status: 401 });
  }
  const { id } = await req.json();
  if (!id) {
    return NextResponse.json({ error: "Missing landing page id." }, { status: 400 });
  }
  // Ensure the user owns the page
  const { data: page, error: fetchError } = await supabase
    .from("landing_pages")
    .select("id, owner_id")
    .eq("id", id)
    .single();
  if (fetchError || !page) {
    return NextResponse.json({ error: "Landing page not found." }, { status: 404 });
  }
  if (page.owner_id !== session.user.id) {
    return NextResponse.json({ error: "Not authorized." }, { status: 403 });
  }
  const { error } = await supabase.from("landing_pages").delete().eq("id", id);
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  return NextResponse.json({ success: true });
} 