'use client';

import { useState } from 'react';
import { CitationPopup } from './CitationPopup';
import { StackedFavicons } from './StackedFavicons';

interface Source {
  id: string;
  title: string;
  url: string;
  domain: string;
  snippet?: string;
  logo?: string;
}

interface SourcesSectionProps {
  sources: Source[];
}

export function SourcesSection({ sources }: SourcesSectionProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [hoveredSource, setHoveredSource] = useState<Source | null>(null);

  if (!sources || sources.length === 0) return null;

  return (
    <div className='mt-6 border-border border-t pt-4'>
      {/* Sources Header */}
      <div 
        className='group flex cursor-pointer items-center'
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="mr-3">
          <StackedFavicons sources={sources} />
        </div>
        <span className='font-medium text-foreground text-sm transition-colors group-hover:text-foreground/80'>
          Sources
        </span>
        <span className='ml-2 text-muted-foreground text-xs'>
          ({sources.length})
        </span>
        <svg 
          className={`ml-2 h-4 w-4 text-muted-foreground transition-transform ${isExpanded ? 'rotate-180' : ''}`}
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </div>

      {/* Expanded Sources List */}
      {isExpanded && (
        <div className="mt-3 space-y-2">
          {sources.map((source, index) => (
            <div 
              key={source.id}
              className='relative flex items-start rounded-md bg-muted/50 p-3 transition-colors hover:bg-muted/70'
              onMouseEnter={() => setHoveredSource(source)}
              onMouseLeave={() => setHoveredSource(null)}
            >
              {/* Source Logo */}
              <div className='mr-3 flex-shrink-0'>
                {source.logo ? (
                  <img 
                    src={source.logo} 
                    alt={`${source.domain} logo`}
                    className='h-5 w-5 rounded-sm'
                    onError={(e) => {
                      e.currentTarget.style.display = 'none';
                    }}
                  />
                ) : (
                  <div className='flex h-5 w-5 items-center justify-center rounded-sm bg-primary'>
                    <span className='font-bold text-primary-foreground text-xs'>
                      {source.domain.charAt(0).toUpperCase()}
                    </span>
                  </div>
                )}
              </div>

              {/* Source Content */}
              <div className='min-w-0 flex-1'>
                <div className='mb-1 flex items-center'>
                  <span className='mr-2 font-medium text-muted-foreground text-xs'>
                    [{index + 1}]
                  </span>
                  <span className='font-medium text-foreground text-sm'>
                    {source.domain}
                  </span>
                </div>
                <h4 className='mb-1 line-clamp-2 font-semibold text-foreground text-sm'>
                  {source.title}
                </h4>
                {source.snippet && (
                  <p className='line-clamp-2 text-muted-foreground text-xs'>
                    {source.snippet}
                  </p>
                )}
                <a
                  href={source.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className='mt-1 inline-block text-primary text-xs transition-colors hover:text-primary/80'
                >
                  View source →
                </a>
              </div>

              {/* Hover Popup - positioned relative to this source item */}
              {hoveredSource && hoveredSource.id === source.id && (
                <div className='absolute top-full left-0 z-50 mt-2'>
                  <CitationPopup 
                    source={hoveredSource} 
                    index={index + 1}
                    onClose={() => setHoveredSource(null)}
                  />
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
