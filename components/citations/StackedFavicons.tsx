'use client';

import type { CitationSource } from '@/lib/citations/utils';

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
    <div className='-space-x-2 flex items-center'>
      {visibleSources.map((source, index) => (
        <div
          key={source.id}
          className='relative h-6 w-6 overflow-hidden rounded-full border-2 border-background bg-background ring-1 ring-border'
          style={{ zIndex: visibleSources.length - index }}
        >
          {source.logo ? (
            <img 
              src={source.logo} 
              alt={`${source.domain} logo`}
              className='h-full w-full object-cover'
              onError={(e) => {
                // Fallback to domain initial if logo fails
                e.currentTarget.style.display = 'none';
              }}
            />
          ) : (
            <div className='flex h-full w-full items-center justify-center bg-primary'>
              <span className='font-bold text-primary-foreground text-xs'>
                {source.domain.charAt(0).toUpperCase()}
              </span>
            </div>
          )}
        </div>
      ))}
      
      {remainingCount > 0 && (
        <div 
          className='relative flex h-6 w-6 items-center justify-center rounded-full border-2 border-background bg-muted ring-1 ring-border'
          style={{ zIndex: 0 }}
        >
          <span className='font-bold text-muted-foreground text-xs'>
            +{remainingCount}
          </span>
        </div>
      )}
    </div>
  );
}
