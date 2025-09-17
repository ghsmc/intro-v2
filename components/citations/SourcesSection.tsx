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
    <div className="mt-6 pt-4 border-t border-border">
      {/* Sources Header */}
      <div 
        className="flex items-center cursor-pointer group"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="mr-3">
          <StackedFavicons sources={sources} />
        </div>
        <span className="text-sm font-medium text-foreground group-hover:text-foreground/80 transition-colors">
          Sources
        </span>
        <span className="ml-2 text-xs text-muted-foreground">
          ({sources.length})
        </span>
        <svg 
          className={`ml-2 w-4 h-4 text-muted-foreground transition-transform ${isExpanded ? 'rotate-180' : ''}`}
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
              className="relative flex items-start p-3 bg-muted/50 rounded-md hover:bg-muted/70 transition-colors"
              onMouseEnter={() => setHoveredSource(source)}
              onMouseLeave={() => setHoveredSource(null)}
            >
              {/* Source Logo */}
              <div className="flex-shrink-0 mr-3">
                {source.logo ? (
                  <img 
                    src={source.logo} 
                    alt={`${source.domain} logo`}
                    className="w-5 h-5 rounded-sm"
                    onError={(e) => {
                      e.currentTarget.style.display = 'none';
                    }}
                  />
                ) : (
                  <div className="w-5 h-5 bg-primary rounded-sm flex items-center justify-center">
                    <span className="text-xs font-bold text-primary-foreground">
                      {source.domain.charAt(0).toUpperCase()}
                    </span>
                  </div>
                )}
              </div>

              {/* Source Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center mb-1">
                  <span className="text-xs font-medium text-muted-foreground mr-2">
                    [{index + 1}]
                  </span>
                  <span className="text-sm font-medium text-foreground">
                    {source.domain}
                  </span>
                </div>
                <h4 className="text-sm font-semibold text-foreground mb-1 line-clamp-2">
                  {source.title}
                </h4>
                {source.snippet && (
                  <p className="text-xs text-muted-foreground line-clamp-2">
                    {source.snippet}
                  </p>
                )}
                <a
                  href={source.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-primary hover:text-primary/80 transition-colors mt-1 inline-block"
                >
                  View source →
                </a>
              </div>

              {/* Hover Popup - positioned relative to this source item */}
              {hoveredSource && hoveredSource.id === source.id && (
                <div className="absolute top-full left-0 mt-2 z-50">
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
