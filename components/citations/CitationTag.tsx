'use client';

import { useState } from 'react';
import { CitationPopup } from './CitationPopup';

interface CitationTagProps {
  source: {
    id: string;
    title: string;
    url: string;
    domain: string;
    snippet?: string;
    logo?: string;
  };
  index: number;
}

export function CitationTag({ source, index }: CitationTagProps) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div className="relative inline-block">
      <span
        className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors cursor-pointer bg-secondary text-secondary-foreground hover:bg-secondary/80 border-transparent"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {source.domain}
      </span>
      
      {isHovered && (
        <CitationPopup 
          source={source} 
          index={index}
          onClose={() => setIsHovered(false)}
        />
      )}
    </div>
  );
}
