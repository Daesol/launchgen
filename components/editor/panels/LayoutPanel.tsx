import React from 'react';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import DraggableSection from '../../DraggableSection';

interface LayoutPanelProps {
  sectionState: {
    expandedSections: Record<string, boolean>;
    visibleSections: Record<string, boolean>;
    sectionOrder: string[];
  };
  onSectionToggle: (sectionName: string) => void;
  onSectionVisibilityToggle: (sectionName: string) => void;
  onSectionOrderUpdate: (newOrder: string[]) => void;
  onBack: () => void;
}

export default function LayoutPanel({
  sectionState,
  onSectionToggle,
  onSectionVisibilityToggle,
  onSectionOrderUpdate,
  onBack,
}: LayoutPanelProps) {
  // Drag and drop sensors
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  // Handle drag end for section reordering
  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (active.id !== over?.id) {
      const oldIndex = sectionState.sectionOrder.indexOf(active.id as string);
      const newIndex = sectionState.sectionOrder.indexOf(over?.id as string);
      const newOrder = arrayMove(sectionState.sectionOrder, oldIndex, newIndex);
      onSectionOrderUpdate(newOrder);
    }
  };

  // Get section display name
  const getSectionDisplayName = (sectionId: string) => {
    switch (sectionId) {
      case 'problemSection': return 'Problem Section';
      case 'features': return 'Features';
      case 'socialProof': return 'Social Proof';
      case 'guarantees': return 'Guarantees';
      case 'faq': return 'FAQ';
      case 'cta': return 'CTA';
      default: return sectionId;
    }
  };

  return (
    <div className="p-4 space-y-4">
      <div className="flex items-center gap-2 mb-4">
        <button
          onClick={onBack}
          className="p-1 text-slate-500 hover:text-slate-700 transition-colors"
          title="Back to main panel"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <h3 className="text-sm font-semibold text-slate-800">Page Layout</h3>
      </div>
      
      <div className="space-y-3">
        <h4 className="text-xs font-medium text-slate-600 uppercase tracking-wider">Section Order & Visibility</h4>
        
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext
            items={sectionState.sectionOrder}
            strategy={verticalListSortingStrategy}
          >
            {sectionState.sectionOrder.map((sectionId) => (
              <DraggableSection key={sectionId} id={sectionId}>
                <div className="flex items-center justify-between p-3 text-sm text-slate-700 bg-slate-50 rounded border hover:bg-slate-100 transition-colors">
                  <div className="flex items-center gap-3">
                    {/* Drag Handle */}
                    <div className="cursor-grab text-slate-400 hover:text-slate-600">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8h16M4 16h16" />
                      </svg>
                    </div>
                    
                    {/* Section Name */}
                    <span className="font-medium">
                      {getSectionDisplayName(sectionId)}
                    </span>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    {/* Visibility Toggle */}
                    <button
                      onClick={() => onSectionVisibilityToggle(sectionId)}
                      className={`px-2 py-1 text-xs rounded transition-colors ${
                        sectionState.visibleSections[sectionId] 
                          ? 'bg-green-100 text-green-700 hover:bg-green-200' 
                          : 'bg-red-100 text-red-700 hover:bg-red-200'
                      }`}
                      title={sectionState.visibleSections[sectionId] ? 'Hide section' : 'Show section'}
                    >
                      {sectionState.visibleSections[sectionId] ? 'Visible' : 'Hidden'}
                    </button>
                    
                    {/* Expand/Collapse Toggle */}
                    <button
                      onClick={() => onSectionToggle(sectionId)}
                      className={`p-1 rounded transition-colors ${
                        sectionState.expandedSections[sectionId]
                          ? 'text-slate-600 hover:text-slate-800'
                          : 'text-slate-400 hover:text-slate-600'
                      }`}
                      title={sectionState.expandedSections[sectionId] ? 'Collapse section' : 'Expand section'}
                    >
                      <svg 
                        className={`w-4 h-4 transition-transform ${
                          sectionState.expandedSections[sectionId] ? 'rotate-180' : ''
                        }`} 
                        fill="none" 
                        stroke="currentColor" 
                        viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>
                  </div>
                </div>
              </DraggableSection>
            ))}
          </SortableContext>
        </DndContext>
        
        {/* Help Text */}
        <div className="bg-blue-50 border border-blue-200 rounded-md p-3">
          <p className="text-xs text-blue-800">
            <strong>Drag & Drop:</strong> Reorder sections by dragging them up or down. 
            Use the visibility toggle to show/hide sections, and expand/collapse to manage the editor view.
          </p>
        </div>
      </div>
    </div>
  );
}
