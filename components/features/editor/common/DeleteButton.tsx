import React from 'react';

interface DeleteButtonProps {
  onClick: () => void;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'icon-only' | 'with-text';
  disabled?: boolean;
  title?: string;
}

export default function DeleteButton({
  onClick,
  className = '',
  size = 'md',
  variant = 'icon-only',
  disabled = false,
  title = 'Delete',
}: DeleteButtonProps) {
  const sizeClasses = {
    sm: 'w-6 h-6',
    md: 'w-4 h-4',
    lg: 'w-5 h-5',
  };

  const buttonClasses = {
    sm: 'px-2 py-1 text-xs',
    md: 'px-3 py-2 text-sm',
    lg: 'px-4 py-2 text-base',
  };

  const iconClasses = sizeClasses[size];
  const buttonSizeClasses = buttonClasses[size];

  if (variant === 'icon-only') {
    return (
      <button
        onClick={onClick}
        disabled={disabled}
        className={`text-red-600 hover:text-red-800 text-sm border border-red-200 rounded-md hover:bg-red-50 transition-colors ${buttonSizeClasses} ${className} ${
          disabled ? 'opacity-50 cursor-not-allowed' : ''
        }`}
        title={title}
      >
        <svg className={iconClasses} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
        </svg>
      </button>
    );
  }

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`text-red-600 hover:text-red-800 text-sm border border-red-200 rounded-md hover:bg-red-50 transition-colors flex items-center justify-center gap-2 ${buttonSizeClasses} ${className} ${
        disabled ? 'opacity-50 cursor-not-allowed' : ''
      }`}
      title={title}
    >
      <svg className={iconClasses} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
      </svg>
      <span>Remove</span>
    </button>
  );
}

// Specialized delete buttons for different contexts
export function RemoveItemButton({ onClick, className, title }: { onClick: () => void; className?: string; title?: string }) {
  return (
    <DeleteButton
      onClick={onClick}
      variant="with-text"
      size="md"
      className={`w-full ${className || ''}`}
      title={title}
    />
  );
}

export function RemoveFeatureButton({ onClick, className }: { onClick: () => void; className?: string }) {
  return (
    <DeleteButton
      onClick={onClick}
      variant="icon-only"
      size="md"
      className={className}
      title="Remove feature"
    />
  );
}

export function RemovePainPointButton({ onClick, className }: { onClick: () => void; className?: string }) {
  return (
    <DeleteButton
      onClick={onClick}
      variant="with-text"
      size="md"
      className={`w-full ${className || ''}`}
      title="Remove pain point"
    />
  );
}

export function RemoveTestimonialButton({ onClick, className }: { onClick: () => void; className?: string }) {
  return (
    <DeleteButton
      onClick={onClick}
      variant="with-text"
      size="md"
      className={`w-full ${className || ''}`}
      title="Remove testimonial"
    />
  );
}

export function RemoveStatButton({ onClick, className }: { onClick: () => void; className?: string }) {
  return (
    <DeleteButton
      onClick={onClick}
      variant="with-text"
      size="md"
      className={`w-full ${className || ''}`}
      title="Remove stat"
    />
  );
}

export function RemoveGuaranteeButton({ onClick, className }: { onClick: () => void; className?: string }) {
  return (
    <DeleteButton
      onClick={onClick}
      variant="icon-only"
      size="md"
      className={className}
      title="Remove guarantee"
    />
  );
}

export function RemoveQuestionButton({ onClick, className }: { onClick: () => void; className?: string }) {
  return (
    <DeleteButton
      onClick={onClick}
      variant="with-text"
      size="md"
      className={`w-full ${className || ''}`}
      title="Remove Q&A"
    />
  );
}
