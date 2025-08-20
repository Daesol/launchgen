"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import PageEditorRefactored from '@/components/PageEditorRefactored';

interface PageEditorWrapperProps {
  initialConfig: any;
}

export default function PageEditorWrapper({ initialConfig }: PageEditorWrapperProps) {
  const [saveStatus, setSaveStatus] = useState<'saved' | 'saving' | 'error' | 'unsaved'>('saved');
  const [lastSaved, setLastSaved] = useState<Date | null>(new Date());
  const router = useRouter();

  const handleSave = async (config: any) => {
    setSaveStatus('saving');
    
    try {
      const response = await fetch('/api/landing-pages', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: config.id,
          template_id: config.template_id,
          page_content: config.page_content,
          page_style: config.page_style,
          original_prompt: config.original_prompt,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to save page');
      }

      const data = await response.json();
      setSaveStatus('saved');
      setLastSaved(new Date());
      
      // Update the URL if the slug changed
      if (data.page?.slug && data.page.slug !== initialConfig.slug) {
        router.replace(`/dashboard/page/${data.page.id}`);
      }
      
      return data;
    } catch (error: any) {
      console.error('Save error:', error);
      setSaveStatus('error');
      throw error;
    }
  };

  return (
    <PageEditorRefactored 
      initialConfig={initialConfig} 
      onSave={handleSave}
      saveStatus={saveStatus}
      lastSaved={lastSaved}
    />
  );
} 