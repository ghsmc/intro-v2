'use client';

import { CitationTag } from './CitationTag';
import type { CitationSource } from '@/lib/citations/utils';

interface CitedTextProps {
  text: string;
  citations: CitationSource[];
}

export function CitedText({ text, citations }: CitedTextProps) {
  // Check if there are any citation markers in the text
  const hasCitations = /\[\d+\]/.test(text);
  
  // If no citation markers, just return the text as-is
  if (!hasCitations) {
    return <span>{text}</span>;
  }

  // Parse text to find citation markers like [1], [2], etc.
  const parseTextWithCitations = (text: string) => {
    const parts = [];
    let lastIndex = 0;
    
    // Find all citation markers [1], [2], etc.
    const citationRegex = /\[(\d+)\]/g;
    let match;
    
    while ((match = citationRegex.exec(text)) !== null) {
      const citationIndex = Number.parseInt(match[1]) - 1; // Convert to 0-based index
      const source = citations[citationIndex];
      
      // Add text before citation
      if (match.index > lastIndex) {
        parts.push({
          type: 'text',
          content: text.slice(lastIndex, match.index)
        });
      }
      
      if (source) {
        // Add citation tag
        parts.push({
          type: 'citation',
          source,
          index: citationIndex + 1
        });
      } else {
        // If no source found, keep the original citation marker
        parts.push({
          type: 'text',
          content: match[0]
        });
      }
      
      lastIndex = match.index + match[0].length;
    }
    
    // Add remaining text
    if (lastIndex < text.length) {
      parts.push({
        type: 'text',
        content: text.slice(lastIndex)
      });
    }
    
    return parts;
  };

  const parts = parseTextWithCitations(text);

  // Debug logging
  if (process.env.NODE_ENV === 'development') {
    console.log('CitedText Debug:', {
      textLength: text.length,
      textPreview: `${text.substring(0, 100)}...`,
      citationsCount: citations.length,
      hasCitations,
      partsCount: parts.length,
      textParts: parts.filter(p => p.type === 'text').length,
      citationParts: parts.filter(p => p.type === 'citation').length
    });
  }

  return (
    <div className="prose prose-invert max-w-none">
      {parts.map((part, index) => {
        if (part.type === 'text') {
          return (
            <span key={index}>
              {part.content}
            </span>
          );
        } else if (part.type === 'citation' && part.source) {
          return (
            <CitationTag
              key={index}
              source={part.source}
              index={part.index}
            />
          );
        }
        return null;
      })}
    </div>
  );
}
