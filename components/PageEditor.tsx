"use client";
import React from "react";
import PageEditorRefactored from "./PageEditorRefactored";

interface PageEditorProps {
  initialConfig: any; // Should contain page_content, page_style, template_id, id (if editing)
  onSave?: (config: any) => void;
  saveStatus?: 'saved' | 'saving' | 'error' | 'unsaved';
  lastSaved?: Date | null;
}

export default function PageEditor({ initialConfig, onSave, saveStatus, lastSaved }: PageEditorProps) {
  return <PageEditorRefactored 
    initialConfig={initialConfig} 
    onSave={onSave} 
    saveStatus={saveStatus}
    lastSaved={lastSaved}
  />;
} 