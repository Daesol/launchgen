"use client";

import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { GripVertical } from 'lucide-react';

interface DraggableSectionProps {
  id: string;
  children: React.ReactNode;
}

export default function DraggableSection({
  id,
  children
}: DraggableSectionProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div ref={setNodeRef} style={style} className="relative">
      <div className="absolute left-0 top-0 bottom-0 flex items-center justify-center w-8 z-10">
        <button
          {...attributes}
          {...listeners}
          className="p-1 text-slate-400 hover:text-slate-600 transition-colors cursor-grab active:cursor-grabbing"
          title="Drag to reorder"
        >
          <GripVertical className="h-4 w-4" />
        </button>
      </div>
      <div className="pl-8">
        {children}
      </div>
    </div>
  );
} 