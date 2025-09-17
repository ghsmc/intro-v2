'use client';

import { type CitationSource } from '@/lib/citations/utils';

interface StackedFaviconsProps {
  sources: CitationSource[];
  maxVisible?: number;
}

export function StackedFavicons({ sources, maxVisible = 3 }: StackedFaviconsProps) {
  // Get unique domains and their favicons
  const uniqueSources = sources.reduce((acc, source) => {
    if (!acc.find(s => s.domain === source.domain)) {
      acc.push(source);
    }
    return acc;
  }, [] as CitationSource[]);

  const visibleSources = uniqueSources.slice(0, maxVisible);
  const remainingCount = uniqueSources.length - maxVisible;

  return (
    <div className="flex items-center -space-x-2">
      {visibleSources.map((source, index) => (
        <div
          key={source.id}
          className="relative w-6 h-6 rounded-full border-2 border-background bg-background overflow-hidden ring-1 ring-border"
          style={{ zIndex: visibleSources.length - index }}
        >
          {source.logo ? (
            <img 
              src={source.logo} 
              alt={`${source.domain} logo`}
              className="w-full h-full object-cover"
              onError={(e) => {
                // Fallback to domain initial if logo fails
                e.currentTarget.style.display = 'none';
              }}
            />
          ) : (
            <div className="w-full h-full bg-primary flex items-center justify-center">
              <span className="text-xs font-bold text-primary-foreground">
                {source.domain.charAt(0).toUpperCase()}
              </span>
            </div>
          )}
        </div>
      ))}
      
      {remainingCount > 0 && (
        <div 
          className="relative w-6 h-6 rounded-full border-2 border-background bg-muted flex items-center justify-center ring-1 ring-border"
          style={{ zIndex: 0 }}
        >
          <span className="text-xs font-bold text-muted-foreground">
            +{remainingCount}
          </span>
        </div>
      )}
    </div>
  );
}
