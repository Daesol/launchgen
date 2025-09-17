import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import dynamic from 'next/dynamic';

const GenerateClient = dynamic(() => import('../../generate/GenerateClient'), { ssr: false });

export default async function GeneratePage() {
  const supabase = createServerComponentClient({ cookies });
  const { data: { user }, error: userError } = await supabase.auth.getUser();

  if (userError || !user) {
    redirect('/auth/signin');
  }

  return <GenerateClient />;
} 