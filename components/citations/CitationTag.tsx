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
        className='inline-flex cursor-pointer items-center rounded-full border border-transparent bg-secondary px-2.5 py-0.5 font-semibold text-secondary-foreground text-xs transition-colors hover:bg-secondary/80'
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
