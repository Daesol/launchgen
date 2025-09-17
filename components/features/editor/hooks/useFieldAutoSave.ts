import { useState, useCallback, useRef } from 'react';
import { UseFieldAutoSaveReturn, FieldChangeHandler, FieldBlurHandler } from '../types/editor.types';

export function useFieldAutoSave(
  onSave: (fieldPath: string, value: any) => Promise<void>,
  onMarkUnsaved?: () => void
): UseFieldAutoSaveReturn {
  // Track original values for change detection
  const [originalValues, setOriginalValues] = useState<Record<string, any>>({});
  
  // Queue of field changes to prevent unnecessary saves
  const [fieldChangeQueue, setFieldChangeQueue] = useState<Record<string, any>>({});
  
  // Track unsaved changes
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  
  // Ref to store the current onSave function to avoid stale closures
  const onSaveRef = useRef(onSave);
  onSaveRef.current = onSave;

  // Initialize field tracking
  const initializeFieldTracking = useCallback((fieldPath: string, value: any) => {
    if (originalValues[fieldPath] === undefined) {
      setOriginalValues(prev => ({
        ...prev,
        [fieldPath]: value
      }));
    }
  }, [originalValues]);

  // Handle field changes
  const handleFieldChange = useCallback<FieldChangeHandler>((fieldPath: string, value: any) => {
    // Queue the change for potential auto-save
    setFieldChangeQueue(prev => ({
      ...prev,
      [fieldPath]: value
    }));

    // Mark as having unsaved changes
    if (onMarkUnsaved) {
      onMarkUnsaved();
    } else {
      setHasUnsavedChanges(true);
    }
  }, [onMarkUnsaved]);

  // Handle field blur (when user exits the field)
  const handleFieldBlur = useCallback<FieldBlurHandler>(async (fieldPath: string, currentValue: any) => {
    const originalValue = originalValues[fieldPath];
    
    // Only save if the value actually changed
    if (originalValue !== currentValue) {
      try {
        // Save this specific field to database
        await onSaveRef.current(fieldPath, currentValue);
        
        // Update original values to reflect the new saved state
        setOriginalValues(prev => ({
          ...prev,
          [fieldPath]: currentValue
        }));
        
        // Remove from change queue
        setFieldChangeQueue(prev => {
          const newQueue = { ...prev };
          delete newQueue[fieldPath];
          return newQueue;
        });
        
        // Clear unsaved changes if no more pending changes
        if (Object.keys(fieldChangeQueue).length === 0) {
          setHasUnsavedChanges(false);
        }
        
        console.log(`Auto-saved field: ${fieldPath} = ${currentValue}`);
      } catch (error) {
        console.error(`Failed to auto-save field ${fieldPath}:`, error);
        
        // Revert to original value on error
        // Note: This would need to be handled by the parent component
        // since we don't have access to the page content state here
        throw error;
      }
    }
  }, [originalValues, fieldChangeQueue]);

  // Mark changes as unsaved
  const markAsUnsaved = useCallback(() => {
    setHasUnsavedChanges(true);
  }, []);

  return {
    handleFieldChange,
    handleFieldBlur,
    initializeFieldTracking,
    hasUnsavedChanges,
    markAsUnsaved,
  };
}
