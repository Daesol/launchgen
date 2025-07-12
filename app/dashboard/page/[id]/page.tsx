import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import dynamic from 'next/dynamic';

const PageEditor = dynamic(() => import('@/components/PageEditor'), { ssr: false });

interface PageProps {
  params: { id: string };
}

export default async function LandingPageEditor({ params }: PageProps) {
  const supabase = createServerComponentClient({ cookies });
  const { data: { session } } = await supabase.auth.getSession();

  if (!session) {
    redirect('/auth/signin');
  }

  // Fetch the landing page by id
  const { data: page, error } = await supabase
    .from('landing_pages')
    .select('id, title, slug, created_at, template_id, page_content, page_style')
    .eq('id', params.id)
    .single();

  if (error || !page) {
    return <div className="text-center text-red-500 mt-16">Landing page not found.</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-700 via-indigo-900 to-slate-950 p-4 flex flex-col items-center">
      <div className="max-w-5xl w-full mt-12">
        <PageEditor initialConfig={page} />
      </div>
    </div>
  );
} 