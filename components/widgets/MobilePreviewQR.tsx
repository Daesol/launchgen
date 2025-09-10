"use client";
import React, { useState, useEffect } from 'react';
import QRCode from 'react-qr-code';
import { Smartphone, Copy, Check } from 'lucide-react';

interface MobilePreviewQRProps {
  pageUrl: string;
  pageId: string;
}

export default function MobilePreviewQR({ pageUrl, pageId }: MobilePreviewQRProps) {
  const [copied, setCopied] = useState(false);
  const [showQR, setShowQR] = useState(false);

  const handleCopyUrl = async () => {
    try {
      await navigator.clipboard.writeText(pageUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy URL:', err);
    }
  };

  const toggleQR = () => {
    setShowQR(!showQR);
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4 shadow-sm">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Smartphone className="h-4 w-4 text-gray-600" />
          <span className="text-sm font-medium text-gray-700">Mobile Preview</span>
        </div>
        <button
          onClick={toggleQR}
          className="text-xs bg-blue-50 text-blue-600 px-2 py-1 rounded hover:bg-blue-100 transition-colors"
        >
          {showQR ? 'Hide QR' : 'Show QR'}
        </button>
      </div>
      
      {showQR && (
        <div className="space-y-3">
          <div className="flex justify-center">
            <div className="bg-white p-3 rounded-lg border">
              <QRCode
                value={pageUrl}
                size={120}
                level="M"
                fgColor="#000000"
                bgColor="#ffffff"
              />
            </div>
          </div>
          
          <div className="text-center space-y-2">
            <p className="text-xs text-gray-600">
              Scan with your phone to view on mobile
            </p>
            
            <div className="flex items-center justify-center gap-2">
              <input
                type="text"
                value={pageUrl}
                readOnly
                className="text-xs bg-gray-50 border border-gray-200 rounded px-2 py-1 flex-1 max-w-[200px]"
              />
              <button
                onClick={handleCopyUrl}
                className="flex items-center gap-1 text-xs bg-gray-100 hover:bg-gray-200 px-2 py-1 rounded transition-colors"
              >
                {copied ? (
                  <>
                    <Check className="h-3 w-3 text-green-600" />
                    Copied
                  </>
                ) : (
                  <>
                    <Copy className="h-3 w-3" />
                    Copy
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 