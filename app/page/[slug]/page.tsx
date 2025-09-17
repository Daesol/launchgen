import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import LandingPageTemplate from '@/components/pages/landing/LandingPageTemplate';

interface PageProps {
  params: { slug: string };
}

export default async function PublicLandingPage({ params }: PageProps) {
  const supabase = createServerComponentClient({ cookies });
  const { data: page, error } = await supabase
    .from('landing_pages')
    .select('id, title, slug, created_at, template_id, page_content, page_style')
    .eq('slug', params.slug)
    .single();

  if (error || !page) {
    return <div className="text-center text-red-500 mt-16">Landing page not found.</div>;
  }

  return (
    <div className="min-h-screen bg-white text-black">
      <LandingPageTemplate config={{ ...page.page_content, theme: page.page_style?.theme }} pageId={page.id} />
    </div>
  );
} 