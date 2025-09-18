import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const supabase = createRouteHandlerClient({ cookies });
    const { data: { user }, error: userError } = await supabase.auth.getUser();

    if (userError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { pageId, newSlug } = await req.json();

    if (!pageId || !newSlug) {
      return NextResponse.json({ error: 'Page ID and new slug are required' }, { status: 400 });
    }

    // Validate slug format (alphanumeric, hyphens, underscores only)
    const slugRegex = /^[a-zA-Z0-9-_]+$/;
    if (!slugRegex.test(newSlug)) {
      return NextResponse.json({ 
        error: 'Invalid URL format. Only letters, numbers, hyphens, and underscores are allowed.' 
      }, { status: 400 });
    }

    // Check if the user owns the page
    const { data: page, error: pageError } = await supabase
      .from('landing_pages')
      .select('id, slug')
      .eq('id', pageId)
      .eq('owner_id', user.id)
      .single();

    if (pageError || !page) {
      return NextResponse.json({ error: 'Page not found or access denied' }, { status: 404 });
    }

    // If the slug hasn't changed, return success
    if (page.slug === newSlug) {
      return NextResponse.json({ success: true, slug: newSlug });
    }

    // Check if the new slug is already taken
    const { data: existingPage, error: checkError } = await supabase
      .from('landing_pages')
      .select('id')
      .eq('slug', newSlug)
      .single();

    if (checkError && checkError.code !== 'PGRST116') { // PGRST116 is "not found" error
      console.error('Error checking slug uniqueness:', checkError);
      return NextResponse.json({ error: 'Error checking URL availability' }, { status: 500 });
    }

    if (existingPage) {
      return NextResponse.json({ 
        error: 'This URL is already taken. Please choose a different one.' 
      }, { status: 409 });
    }

    // Update the slug
    const { error: updateError } = await supabase
      .from('landing_pages')
      .update({ slug: newSlug })
      .eq('id', pageId)
      .eq('owner_id', user.id);

    if (updateError) {
      console.error('Error updating slug:', updateError);
      return NextResponse.json({ error: 'Failed to update URL' }, { status: 500 });
    }

    return NextResponse.json({ success: true, slug: newSlug });
  } catch (error) {
    console.error('Unexpected error in update-url API:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
