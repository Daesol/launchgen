import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import dynamic from 'next/dynamic';

const PageEditorWrapper = dynamic(() => import('./PageEditorWrapper'), { ssr: false });

interface PageProps {
  params: { id: string };
}

export default async function LandingPageEditor({ params }: PageProps) {
  const supabase = createServerComponentClient({ cookies });
  const { data: { user }, error: userError } = await supabase.auth.getUser();

  if (userError || !user) {
    redirect('/auth/signin');
  }

  // Fetch the landing page by id
  const { data: page, error } = await supabase
    .from('landing_pages')
    .select('*') // Select all columns for debugging
    .eq('id', params.id)
    .eq('owner_id', user.id) // Ensure user owns the page
    .single();

  // Debug logging
  console.log('Page ID:', params.id);
  console.log('User ID:', user.id);
  console.log('Page data:', page);
  console.log('Error:', error);

  if (error) {
    console.error('Database error:', error);
    return (
      <div className="text-center text-red-500 mt-16">
        <h2 className="text-xl font-semibold mb-2">Error Loading Page</h2>
        <p className="text-sm text-gray-600 mb-4">Page ID: {params.id}</p>
        <p className="text-sm">{error.message}</p>
        <a href="/dashboard" className="text-blue-600 hover:underline mt-4 inline-block">
          Return to Dashboard
        </a>
      </div>
    );
  }

  if (!page) {
    return (
      <div className="text-center text-red-500 mt-16">
        <h2 className="text-xl font-semibold mb-2">Landing Page Not Found</h2>
        <p className="text-sm text-gray-600 mb-4">Page ID: {params.id}</p>
        <p className="text-sm">The page you're looking for doesn't exist or you don't have permission to access it.</p>
        <a href="/dashboard" className="text-blue-600 hover:underline mt-4 inline-block">
          Return to Dashboard
        </a>
      </div>
    );
  }

  // Handle both old and new schema formats
  let processedPage = { ...page };
  
  // If page_content doesn't exist but config_json does, migrate the data
  if (!page.page_content && page.config_json) {
    console.log('Migrating from config_json to page_content');
    processedPage.page_content = page.config_json;
    processedPage.page_style = { theme: { mode: 'white', accentColor: '#6366f1' } };
  }
  
  // Ensure required fields exist with defaults
  if (!processedPage.page_content) {
    processedPage.page_content = {
      business: { name: '', logo: '' },
      hero: { headline: '', subheadline: '', cta: '' },
      features: []
    };
  }
  
  if (!processedPage.page_style) {
    processedPage.page_style = {
      theme: { mode: 'white', accentColor: '#6366f1' }
    };
  }
  
  if (!processedPage.template_id) {
    processedPage.template_id = 'default';
  }

  return (
    <div className="h-full w-full lg:h-full">
        <PageEditorWrapper initialConfig={processedPage} />
    </div>
  );
} 