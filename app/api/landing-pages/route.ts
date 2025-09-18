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
    const { id, template_id, page_content, page_style, original_prompt } = await req.json();
    if (!page_content || typeof page_content !== "object") {
      return NextResponse.json({ error: "page_content is required." }, { status: 400 });
    }
    if (!page_style || typeof page_style !== "object") {
      return NextResponse.json({ error: "page_style is required." }, { status: 400 });
    }
    const owner_id = user.id;
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
      original_prompt: original_prompt || null,
      slug,
      published: true, // Auto-publish pages by default
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
  const supabase = createRouteHandlerClient({ cookies });
  const { data: { user }, error: userError } = await supabase.auth.getUser();
  
  console.log('API Auth check:', { user: user?.id, userError });
  
  if (userError || !user) {
    return NextResponse.json({ error: "Not authenticated." }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { id, title, page_content, page_style, template_id, original_prompt, published, visibleSections, sectionOrder } = body;

    console.log('PATCH request:', { id, visibleSections, sectionOrder, userId: user.id });

    if (!id) {
      return NextResponse.json({ error: "Missing landing page id." }, { status: 400 });
    }

    // Ensure the user owns the page and get existing content
    console.log('Fetching page with ID:', id, 'for user:', user.id);
    
    // Try to get the page with explicit RLS context
    const { data: existingPage, error: fetchError } = await supabase
      .from("landing_pages")
      .select("id, owner_id, slug, page_content")
      .eq("id", id)
      .eq("owner_id", user.id) // Add explicit owner check
      .single();

    console.log('Database fetch result:', { 
      existingPage: existingPage ? { id: existingPage.id, owner_id: existingPage.owner_id } : null, 
      fetchError: fetchError ? { message: fetchError.message, code: fetchError.code, details: fetchError.details } : null 
    });

    if (fetchError || !existingPage) {
      return NextResponse.json({ error: "Landing page not found." }, { status: 404 });
    }

    if (existingPage.owner_id !== user.id) {
      return NextResponse.json({ error: "Not authorized." }, { status: 403 });
    }

    // Prepare update data - only include fields that are provided
    const updateData: any = {};
    
    if (title !== undefined) {
      updateData.title = title;
    }
    
    if (page_content !== undefined) {
      // Handle nested field updates (e.g., business.name, hero.headline)
      if (typeof page_content === 'object' && !Array.isArray(page_content)) {
        // Use existing page content that was already fetched
        if (existingPage.page_content) {
          // Merge the new field with existing content
          const mergedContent = { ...existingPage.page_content };
          Object.keys(page_content).forEach(fieldPath => {
            const pathParts = fieldPath.split('.');
            let current = mergedContent;
            
            // Navigate to the nested location
            for (let i = 0; i < pathParts.length - 1; i++) {
              if (!current[pathParts[i]]) {
                current[pathParts[i]] = {};
              }
              current = current[pathParts[i]];
            }
            
            // Set the final field value
            current[pathParts[pathParts.length - 1]] = page_content[fieldPath];
          });
          
          // Add section visibility and order to page content
          if (visibleSections !== undefined) {
            mergedContent.visibleSections = visibleSections;
          }
          if (sectionOrder !== undefined) {
            mergedContent.sectionOrder = sectionOrder;
          }
          
          updateData.page_content = mergedContent;
        } else {
          const newPageContent = { ...page_content };
          if (visibleSections !== undefined) {
            newPageContent.visibleSections = visibleSections;
          }
          if (sectionOrder !== undefined) {
            newPageContent.sectionOrder = sectionOrder;
          }
          updateData.page_content = newPageContent;
        }
      } else {
        updateData.page_content = page_content;
      }
    }
    
    if (page_style !== undefined) {
      updateData.page_style = page_style;
    }
    
    if (template_id !== undefined) {
      updateData.template_id = template_id;
    }
    
    if (original_prompt !== undefined) {
      updateData.original_prompt = original_prompt;
    }
    
    if (published !== undefined) {
      updateData.published = published;
    }

    // Handle section visibility and order updates even when page_content is not provided
    if ((visibleSections !== undefined || sectionOrder !== undefined) && page_content === undefined) {
      // Use existing page content that was already fetched
      if (existingPage.page_content) {
        const mergedContent = { ...existingPage.page_content };
        if (visibleSections !== undefined) {
          mergedContent.visibleSections = visibleSections;
        }
        if (sectionOrder !== undefined) {
          mergedContent.sectionOrder = sectionOrder;
        }
        updateData.page_content = mergedContent;
      } else {
        const newPageContent: any = {};
        if (visibleSections !== undefined) {
          newPageContent.visibleSections = visibleSections;
        }
        if (sectionOrder !== undefined) {
          newPageContent.sectionOrder = sectionOrder;
        }
        updateData.page_content = newPageContent;
      }
    }

    console.log('Update data:', updateData);

    // Update the landing page
    const { data: page, error: updateError } = await supabase
      .from("landing_pages")
      .update(updateData)
      .eq("id", id)
      .select()
      .single();

    console.log('Update result:', { page, updateError });

    if (updateError) {
      console.error('Database update error:', updateError);
      throw updateError;
    }

    return NextResponse.json({ page });
  } catch (e: any) {
    console.error('PATCH error:', e);
    return NextResponse.json({ error: e.message || "Failed to update landing page." }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  const supabase = createRouteHandlerClient({ cookies });
  const { data: { user }, error: userError } = await supabase.auth.getUser();
  if (userError || !user) {
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
  if (page.owner_id !== user.id) {
    return NextResponse.json({ error: "Not authorized." }, { status: 403 });
  }
  const { error } = await supabase.from("landing_pages").delete().eq("id", id);
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  return NextResponse.json({ success: true });
} 