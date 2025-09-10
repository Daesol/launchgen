import React from 'react';

interface BusinessPanelProps {
  business: {
    name: string;
    logo: string;
  };
  onBusinessChange: (field: string, value: any) => void;
  onBack: () => void;
}

export default function BusinessPanel({ business, onBusinessChange, onBack }: BusinessPanelProps) {
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
        <h3 className="text-sm font-semibold text-slate-800">Business Info</h3>
      </div>
      
      <div className="space-y-4">
        {/* Business Name */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Business Name
          </label>
          <input
            type="text"
            value={business.name || ''}
            onChange={(e) => onBusinessChange('business.name', e.target.value)}
            className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-slate-500 text-sm"
            placeholder="Enter your business name"
          />
        </div>

        {/* Logo URL */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Logo URL
          </label>
          <input
            type="text"
            value={business.logo || ''}
            onChange={(e) => onBusinessChange('business.logo', e.target.value)}
            className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-slate-500 text-sm"
            placeholder="Enter logo URL or leave empty for default"
          />
          
          {/* Logo Preview */}
          {business.logo && (
            <div className="mt-2">
              <label className="block text-xs font-medium text-slate-600 mb-1">
                Logo Preview
              </label>
              <div className="w-16 h-16 border border-slate-200 rounded-md overflow-hidden bg-slate-50 flex items-center justify-center">
                <img 
                  src={business.logo} 
                  alt="Business logo" 
                  className="w-full h-full object-contain"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.style.display = 'none';
                    target.nextElementSibling?.classList.remove('hidden');
                  }}
                />
                <div className="hidden text-xs text-slate-400 text-center px-1">
                  Invalid URL
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Help Text */}
        <div className="bg-blue-50 border border-blue-200 rounded-md p-3">
          <p className="text-xs text-blue-800">
            <strong>Tip:</strong> Your business name and logo will appear in the header of your landing page. 
            If no logo is provided, a default icon will be used.
          </p>
        </div>
      </div>
    </div>
  );
}
