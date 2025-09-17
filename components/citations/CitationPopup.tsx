'use client';

interface CitationPopupProps {
  source: {
    id: string;
    title: string;
    url: string;
    domain: string;
    snippet?: string;
    logo?: string;
  };
  index: number;
  onClose: () => void;
}

export function CitationPopup({ source, index, onClose }: CitationPopupProps) {
  return (
    <div 
      className="w-80 p-4 bg-popover text-popover-foreground border rounded-md shadow-md"
      onMouseEnter={() => {}} // Keep popup open on hover
      onMouseLeave={onClose}
    >
      {/* Header with logo and domain */}
      <div className="flex items-center mb-3">
        {source.logo ? (
          <img 
            src={source.logo} 
            alt={`${source.domain} logo`}
            className="w-4 h-4 mr-2 rounded-sm"
            onError={(e) => {
              // Fallback to domain initial if logo fails
              e.currentTarget.style.display = 'none';
            }}
          />
        ) : (
          <div className="w-4 h-4 mr-2 bg-primary rounded-sm flex items-center justify-center">
            <span className="text-xs font-bold text-primary-foreground">
              {source.domain.charAt(0).toUpperCase()}
            </span>
          </div>
        )}
        <span className="text-sm font-medium text-foreground">{source.domain}</span>
      </div>

      {/* Title */}
      <h4 className="text-sm font-semibold text-foreground mb-2 line-clamp-2">
        {source.title}
      </h4>

      {/* Snippet */}
      {source.snippet && (
        <p className="text-xs text-muted-foreground mb-3 line-clamp-3">
          {source.snippet}
        </p>
      )}

      {/* Footer with link */}
      <div className="flex items-center justify-between">
        <a
          href={source.url}
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs text-primary hover:text-primary/80 transition-colors font-medium"
        >
          View source →
        </a>
        <span className="text-xs text-muted-foreground">[{index}]</span>
      </div>
    </div>
  );
}
