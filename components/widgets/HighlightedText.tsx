"use client";

import React from 'react';

interface HighlightedTextProps {
  text: string;
  highlights: string[];
  accentColor: string;
  className?: string;
}

export default function HighlightedText({ 
  text, 
  highlights, 
  accentColor, 
  className = "" 
}: HighlightedTextProps) {
  if (!highlights || highlights.length === 0) {
    return <span className={className}>{text}</span>;
  }

  // Simple word-by-word highlighting
  const words = text.split(' ');
  
  return (
    <>
      {words.map((word, index) => {
        const cleanWord = word.replace(/[^\w]/g, '');
        const isHighlighted = highlights.some(h => 
          h.toLowerCase() === cleanWord.toLowerCase()
        );
        
        if (isHighlighted) {
          return (
            <span
              key={index}
              className={className}
              style={{ color: accentColor, fontWeight: 'bold' }}
            >
              {word}{index < words.length - 1 ? ' ' : ''}
            </span>
          );
        }
        
        return (
          <span key={index} className={className}>
            {word}{index < words.length - 1 ? ' ' : ''}
          </span>
        );
      })}
    </>
  );
} 