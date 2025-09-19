"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import PageEditor from '@/components/pages/dashboard/PageEditor';
import SuccessToast from '@/components/ui/success-toast';

interface PageEditorWrapperProps {
  initialConfig: any;
}

export default function PageEditorWrapper({ initialConfig }: PageEditorWrapperProps) {
  const [saveStatus, setSaveStatus] = useState<'saved' | 'saving' | 'error' | 'unsaved'>('saved');
  const [lastSaved, setLastSaved] = useState<Date | null>(new Date());
  const [isPublishing, setIsPublishing] = useState(false);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const router = useRouter();

  const handleSave = async (config: any) => {
    const isPublishOperation = config.published === true;
    
    if (isPublishOperation) {
      setIsPublishing(true);
      // Dispatch event to notify layout about publishing state
      window.dispatchEvent(new CustomEvent('publishing-state-changed', { 
        detail: { isPublishing: true } 
      }));
    } else {
      setSaveStatus('saving');
    }
    
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
          published: config.published,
          // Section visibility is now included in page_content, no need for separate fields
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to save page');
      }

      const data = await response.json();
      
      if (isPublishOperation) {
        setIsPublishing(false);
        setShowSuccessMessage(true);
        // Dispatch event to notify layout about publishing state
        window.dispatchEvent(new CustomEvent('publishing-state-changed', { 
          detail: { isPublishing: false } 
        }));
        // Auto-hide success message after 4 seconds
        setTimeout(() => setShowSuccessMessage(false), 4000);
      } else {
        setSaveStatus('saved');
        setLastSaved(new Date());
      }
      
      // Update the URL if the slug changed
      if (data.page?.slug && data.page.slug !== initialConfig.slug) {
        router.replace(`/dashboard/page/${data.page.id}`);
      }
      
      return data;
    } catch (error: any) {
      console.error('Save error:', error);
      if (isPublishOperation) {
        setIsPublishing(false);
        // Dispatch event to notify layout about publishing state
        window.dispatchEvent(new CustomEvent('publishing-state-changed', { 
          detail: { isPublishing: false } 
        }));
      } else {
        setSaveStatus('error');
      }
      throw error;
    }
  };

  return (
    <>
      <PageEditor 
        initialConfig={initialConfig} 
        onSave={handleSave}
        saveStatus={saveStatus}
        lastSaved={lastSaved}
        isPublishing={isPublishing}
        onPublishingChange={setIsPublishing}
      />
      <SuccessToast
        isVisible={showSuccessMessage}
        message="Page published successfully!"
        onClose={() => setShowSuccessMessage(false)}
        duration={4000}
      />
    </>
  );
} 