import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import LandingPageTemplate from '@/components/pages/landing/LandingPageTemplate';

interface PageProps {
  params: { slug: string };
}

export default async function PublicLandingPage({ params }: PageProps) {
  const supabase = createServerComponentClient({ cookies });
  
  try {
    const { data: page, error } = await supabase
      .from('landing_pages')
      .select('id, title, slug, created_at, template_id, page_content, page_style, published')
      .eq('slug', params.slug)
      .eq('published', true) // Only show published pages
      .single();

    if (error) {
      console.error('Database error for slug:', params.slug, error);
      return <div className="text-center text-red-500 mt-16">Landing page not found.</div>;
    }

    if (!page) {
      console.log('No published page found for slug:', params.slug);
      return <div className="text-center text-red-500 mt-16">Landing page not found.</div>;
    }

    // Validate required data
    if (!page.page_content) {
      console.error('Page content missing for slug:', params.slug);
      return <div className="text-center text-red-500 mt-16">Landing page not found.</div>;
    }

    return (
      <div className="min-h-screen bg-white text-black">
        <LandingPageTemplate config={{ ...page.page_content, theme: page.page_style?.theme }} pageId={page.id} />
      </div>
    );
  } catch (err) {
    console.error('Unexpected error for slug:', params.slug, err);
    return <div className="text-center text-red-500 mt-16">Landing page not found.</div>;
  }
} 