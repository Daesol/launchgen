"use client";
import React from "react";
import { Card, CardContent } from "@/components/ui/card";

interface DeleteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  deleting: boolean;
  error: string;
}

export default function DeleteModal({ 
  isOpen, 
  onClose, 
  onConfirm, 
  deleting, 
  error 
}: DeleteModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <Card className="border border-[#2D2D2D] max-w-md w-full mx-4" style={{ backgroundColor: '#0A0A0A' }}>
        <CardContent className="p-6">
          <h3 className="text-white text-lg font-semibold mb-4">Delete Page</h3>
          <p className="text-neutral-300 mb-6">
            Are you sure you want to delete this page? This action cannot be undone.
          </p>
          {error && (
            <p className="text-red-400 text-sm mb-4">{error}</p>
          )}
          <div className="flex gap-3">
            <button
              onClick={onClose}
              disabled={deleting}
              className="flex-1 px-4 py-2 border border-[#2D2D2D] text-neutral-300 hover:bg-neutral-700 rounded transition-colors disabled:opacity-50"
              style={{ backgroundColor: '#0A0A0A' }}
            >
              Cancel
            </button>
            <button
              onClick={onConfirm}
              disabled={deleting}
              className="flex-1 px-4 py-2 bg-red-600 text-white hover:bg-red-700 rounded transition-colors disabled:opacity-50"
            >
              {deleting ? "Deleting..." : "Delete"}
            </button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
