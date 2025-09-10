import React from 'react';

interface AddItemButtonProps {
  onClick: () => void;
  label: string;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'outline' | 'filled';
  disabled?: boolean;
  icon?: React.ReactNode;
}

export default function AddItemButton({
  onClick,
  label,
  className = '',
  size = 'md',
  variant = 'outline',
  disabled = false,
  icon,
}: AddItemButtonProps) {
  const sizeClasses = {
    sm: 'px-2 py-1 text-xs',
    md: 'px-3 py-2 text-sm',
    lg: 'px-4 py-2 text-base',
  };

  const variantClasses = {
    outline: 'border border-slate-300 text-slate-700 hover:bg-slate-50 hover:border-slate-400',
    filled: 'bg-slate-600 text-white hover:bg-slate-700 border border-slate-600',
  };

  const buttonClasses = `${sizeClasses[size]} ${variantClasses[variant]} rounded-md transition-colors font-medium ${className} ${
    disabled ? 'opacity-50 cursor-not-allowed' : ''
  }`;

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={buttonClasses}
    >
      <div className="flex items-center justify-center gap-2">
        {icon && <span className="flex-shrink-0">{icon}</span>}
        <span>{label}</span>
      </div>
    </button>
  );
}

// Specialized add buttons for different sections
export function AddFeatureButton({ onClick, className }: { onClick: () => void; className?: string }) {
  return (
    <AddItemButton
      onClick={onClick}
      label="Add Feature"
      variant="outline"
      size="md"
      className={`w-full ${className || ''}`}
      icon={
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
        </svg>
      }
    />
  );
}

export function AddPainPointButton({ onClick, className }: { onClick: () => void; className?: string }) {
  return (
    <AddItemButton
      onClick={onClick}
      label="Add Pain Point"
      variant="outline"
      size="md"
      className={`w-full ${className || ''}`}
      icon={
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
        </svg>
      }
    />
  );
}

export function AddTestimonialButton({ onClick, className }: { onClick: () => void; className?: string }) {
  return (
    <AddItemButton
      onClick={onClick}
      label="Add Testimonial"
      variant="outline"
      size="md"
      className={`w-full ${className || ''}`}
      icon={
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
        </svg>
      }
    />
  );
}

export function AddStatButton({ onClick, className }: { onClick: () => void; className?: string }) {
  return (
    <AddItemButton
      onClick={onClick}
      label="Add Stat"
      variant="outline"
      size="md"
      className={`w-full ${className || ''}`}
      icon={
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
        </svg>
      }
    />
  );
}

export function AddGuaranteeButton({ onClick, className }: { onClick: () => void; className?: string }) {
  return (
    <AddItemButton
      onClick={onClick}
      label="Add Guarantee"
      variant="outline"
      size="md"
      className={`w-full ${className || ''}`}
      icon={
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
        </svg>
      }
    />
  );
}

export function AddQuestionButton({ onClick, className }: { onClick: () => void; className?: string }) {
  return (
    <AddItemButton
      onClick={onClick}
      label="Add Q&A"
      variant="outline"
      size="md"
      className={`w-full ${className || ''}`}
      icon={
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
        </svg>
      }
    />
  );
}
