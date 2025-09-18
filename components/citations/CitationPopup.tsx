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
      className='w-80 rounded-md border bg-popover p-4 text-popover-foreground shadow-md'
      onMouseEnter={() => {}} // Keep popup open on hover
      onMouseLeave={onClose}
    >
      {/* Header with logo and domain */}
      <div className='mb-3 flex items-center'>
        {source.logo ? (
          <img 
            src={source.logo} 
            alt={`${source.domain} logo`}
            className='mr-2 h-4 w-4 rounded-sm'
            onError={(e) => {
              // Fallback to domain initial if logo fails
              e.currentTarget.style.display = 'none';
            }}
          />
        ) : (
          <div className='mr-2 flex h-4 w-4 items-center justify-center rounded-sm bg-primary'>
            <span className='font-bold text-primary-foreground text-xs'>
              {source.domain.charAt(0).toUpperCase()}
            </span>
          </div>
        )}
        <span className='font-medium text-foreground text-sm'>{source.domain}</span>
      </div>

      {/* Title */}
      <h4 className='mb-2 line-clamp-2 font-semibold text-foreground text-sm'>
        {source.title}
      </h4>

      {/* Snippet */}
      {source.snippet && (
        <p className='mb-3 line-clamp-3 text-muted-foreground text-xs'>
          {source.snippet}
        </p>
      )}

      {/* Footer with link */}
      <div className="flex items-center justify-between">
        <a
          href={source.url}
          target="_blank"
          rel="noopener noreferrer"
          className='font-medium text-primary text-xs transition-colors hover:text-primary/80'
        >
          View source →
        </a>
        <span className='text-muted-foreground text-xs'>[{index}]</span>
      </div>
    </div>
  );
}
