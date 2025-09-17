"use client";
import React, { useState } from 'react';
import QRCode from 'react-qr-code';
import { QrCode, Copy, Check } from 'lucide-react';

interface MobilePreviewQRProps {
  pageUrl: string;
  pageId: string;
  previewUrl?: string;
  isPublished?: boolean;
}

export default function MobilePreviewQR({ pageUrl, pageId, previewUrl, isPublished = false }: MobilePreviewQRProps) {
  const [copied, setCopied] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [activeTab, setActiveTab] = useState<'preview' | 'published'>('preview');
  const [showPublishedTooltip, setShowPublishedTooltip] = useState(false);
  const dropdownRef = React.useRef<HTMLDivElement>(null);

  // Check if we have URLs available
  const hasPreviewUrl = previewUrl && previewUrl.trim() !== '';
  const hasPublishedUrl = pageUrl && pageUrl.trim() !== '';
  const hasAnyUrl = hasPreviewUrl || hasPublishedUrl;

  // Get current URL based on active tab
  const currentUrl = activeTab === 'preview' ? previewUrl : pageUrl;

  const handleCopyUrl = async () => {
    try {
      await navigator.clipboard.writeText(currentUrl || '');
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy URL:', err);
    }
  };

  const toggleDropdown = () => {
    if (showDropdown) {
      setShowDropdown(false);
    } else {
      setShowDropdown(true);
      // Set default tab based on what's available
      if (hasPreviewUrl && !hasPublishedUrl) {
        setActiveTab('preview');
      } else if (hasPublishedUrl && !hasPreviewUrl) {
        setActiveTab('published');
      } else if (hasPublishedUrl) {
        setActiveTab('published'); // Default to published if both available
      } else {
        setActiveTab('preview');
      }
    }
  };

  // Close dropdown when clicking outside
  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
      }
    };

    if (showDropdown) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showDropdown]);

  return (
    <>
      {/* QR Code Icon Button */}
      <div className="relative" ref={dropdownRef}>
        <button
          onClick={toggleDropdown}
          className={`p-1.5 rounded transition-colors ${
            hasAnyUrl 
              ? 'text-neutral-400 hover:text-white hover:bg-neutral-700' 
              : 'text-neutral-600 cursor-not-allowed'
          } ${showDropdown ? 'bg-neutral-700 text-white' : ''}`}
          title={hasAnyUrl ? "Show QR Codes" : "No URLs available"}
          disabled={!hasAnyUrl}
        >
          <QrCode className="w-4 h-4" />
        </button>

        {/* Dropdown */}
        {showDropdown && (
          <div className="absolute top-full right-0 mt-2 w-80 bg-black border border-[#2D2D2D] rounded-lg shadow-2xl z-50">
            <div className="p-4">
              {/* Header */}
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-white">QR Codes</h3>
              </div>

              {/* Tabs */}
              <div className="flex space-x-1 mb-4 bg-neutral-800 p-1 rounded-lg">
                <button
                  onClick={() => setActiveTab('preview')}
                  className={`flex-1 py-2 px-3 text-sm font-medium rounded-md transition-colors ${
                    activeTab === 'preview'
                      ? 'bg-neutral-700 text-white'
                      : 'text-neutral-400 hover:text-white hover:bg-neutral-600'
                  } ${!hasPreviewUrl ? 'opacity-50 cursor-not-allowed' : ''}`}
                  disabled={!hasPreviewUrl}
                >
                  Preview
                </button>
                <div className="relative flex-1">
                  <div
                    onMouseEnter={() => !hasPublishedUrl && setShowPublishedTooltip(true)}
                    onMouseLeave={() => setShowPublishedTooltip(false)}
                    className="relative"
                  >
                    <button
                      onClick={() => hasPublishedUrl && setActiveTab('published')}
                      className={`w-full py-2 px-3 text-sm font-medium rounded-md transition-colors ${
                        activeTab === 'published'
                          ? 'bg-neutral-700 text-white'
                          : hasPublishedUrl 
                            ? 'text-neutral-400 hover:text-white hover:bg-neutral-600'
                            : 'text-neutral-400 opacity-50 cursor-not-allowed'
                      }`}
                    >
                      Published
                    </button>
                  </div>
                  
                  {/* Published Tooltip */}
                  {showPublishedTooltip && !hasPublishedUrl && (
                    <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 w-64 bg-gradient-to-r from-blue-900 to-indigo-900 border border-blue-500 rounded-lg shadow-xl z-50 p-4">
                      <div className="flex items-start gap-3">
                        <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                          <span className="text-white text-sm">🚀</span>
                        </div>
                        <div>
                          <h4 className="text-white font-semibold text-sm mb-1">Ready to go live?</h4>
                          <p className="text-blue-100 text-xs leading-relaxed">
                            Publish your page to generate a QR code for your live website! 
                            Click the "Publish" button above to make it happen.
                          </p>
                        </div>
                      </div>
                      {/* Arrow pointing up */}
                      <div className="absolute -top-1 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-gradient-to-r from-blue-900 to-indigo-900 border-l border-t border-blue-500 rotate-45"></div>
                    </div>
                  )}
                </div>
              </div>

              {currentUrl && currentUrl.trim() !== '' ? (
                <>
                  {/* QR Code */}
                  <div className="flex justify-center mb-4">
                    <div className="bg-white p-3 rounded-lg">
                      <QRCode
                        value={currentUrl}
                        size={140}
                        level="M"
                        fgColor="#000000"
                        bgColor="#ffffff"
                      />
                    </div>
                  </div>

                  {/* Instructions */}
                  <p className="text-sm text-neutral-400 text-center mb-4">
                    {activeTab === 'preview' 
                      ? "Scan with your phone to preview the page" 
                      : "Scan with your phone to view the published page"
                    }
                  </p>

                  {/* URL Copy Section */}
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        value={currentUrl}
                        readOnly
                        className="flex-1 text-sm bg-neutral-800 border border-[#2D2D2D] text-white rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                      <button
                        onClick={handleCopyUrl}
                        className="flex items-center gap-2 px-3 py-2 bg-neutral-700 hover:bg-neutral-600 text-white rounded transition-colors"
                      >
                        {copied ? (
                          <>
                            <Check className="w-4 h-4 text-green-400" />
                            <span className="text-sm">Copied</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-4 h-4" />
                            <span className="text-sm">Copy</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </>
              ) : (
                /* No URL Available State */
                <div className="text-center py-6">
                  <div className="w-12 h-12 bg-neutral-800 rounded-full flex items-center justify-center mx-auto mb-3">
                    <QrCode className="w-6 h-6 text-neutral-500" />
                  </div>
                  <h4 className="text-base font-semibold text-white mb-2">
                    {activeTab === 'preview' ? 'No Preview URL' : 'No Published URL'}
                  </h4>
                  <p className="text-sm text-neutral-400 mb-2">
                    {activeTab === 'preview' 
                      ? "Save your page to generate a preview QR code"
                      : "Publish your page to generate a QR code"
                    }
                  </p>
                  <p className="text-xs text-neutral-500">
                    {activeTab === 'preview' 
                      ? "Your changes will be saved automatically"
                      : "Use the 'Publish' button to make your page live"
                    }
                  </p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </>
  );
} 