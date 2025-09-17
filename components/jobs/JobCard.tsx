'use client';

interface JobResult {
  title: string;
  link: string;
  snippet: string;
  date?: string;
  source: string;
  company?: string | null;
  companyLogo?: string | null;
}

interface JobCardProps {
  job: JobResult;
  index: number;
}

export function JobCard({ job, index }: JobCardProps) {
  const formatDate = (dateString?: string) => {
    if (!dateString) return null;
    
    try {
      const date = new Date(dateString);
      const now = new Date();
      const diffTime = Math.abs(now.getTime() - date.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      
      if (diffDays === 1) return 'Today';
      if (diffDays <= 7) return `${diffDays} days ago`;
      if (diffDays <= 30) return `${Math.ceil(diffDays / 7)} weeks ago`;
      return date.toLocaleDateString();
    } catch {
      return null;
    }
  };

  const getSourceLogo = (source: string) => {
    // Clean up source name to remove "logo" suffix
    const cleanSource = source.replace(/\s+logo$/i, '');
    
    const logos: Record<string, string> = {
      'LinkedIn': 'https://www.google.com/s2/favicons?domain=linkedin.com&sz=32',
      'Indeed': 'https://www.google.com/s2/favicons?domain=indeed.com&sz=32',
      'Glassdoor': 'https://www.google.com/s2/favicons?domain=glassdoor.com&sz=32',
      'AngelList': 'https://www.google.com/s2/favicons?domain=angel.co&sz=32',
      'Built In': 'https://www.google.com/s2/favicons?domain=builtin.com&sz=32',
      'Lever': 'https://www.google.com/s2/favicons?domain=lever.co&sz=32',
      'Greenhouse': 'https://www.google.com/s2/favicons?domain=greenhouse.io&sz=32',
      'Apple Careers': 'https://www.google.com/s2/favicons?domain=apple.com&sz=32',
      'Google Careers': 'https://www.google.com/s2/favicons?domain=google.com&sz=32',
      'Microsoft Careers': 'https://www.google.com/s2/favicons?domain=microsoft.com&sz=32',
      'Amazon Jobs': 'https://www.google.com/s2/favicons?domain=amazon.com&sz=32',
      'Meta Careers': 'https://www.google.com/s2/favicons?domain=meta.com&sz=32',
      'Netflix Jobs': 'https://www.google.com/s2/favicons?domain=netflix.com&sz=32',
    };
    
    return logos[cleanSource] || `https://www.google.com/s2/favicons?domain=${cleanSource.toLowerCase().replace(/\s+/g, '')}.com&sz=32`;
  };

  return (
    <div className="relative flex items-start p-4 bg-muted/50 rounded-lg hover:bg-muted/70 transition-colors border border-border/50 group">
      {/* Company Logo (Primary) */}
      <div className="flex-shrink-0 mr-3">
        {job.companyLogo ? (
          <img 
            src={job.companyLogo} 
            alt={`${job.company} logo`}
            className="w-8 h-8 rounded-md object-contain bg-white p-1 border border-border/50"
            onError={(e) => {
              e.currentTarget.style.display = 'none';
            }}
          />
        ) : (
          <div className="w-8 h-8 rounded-md bg-muted flex items-center justify-center border border-border/50">
            <img 
              src={getSourceLogo(job.source)} 
              alt={`${job.source} logo`}
              className="w-5 h-5 rounded-sm"
              onError={(e) => {
                e.currentTarget.style.display = 'none';
              }}
            />
          </div>
        )}
      </div>

      {/* Job Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            {job.company && (
              <span className="text-sm font-semibold text-foreground">
                {job.company}
              </span>
            )}
            <span className="text-xs text-muted-foreground">
              via {job.source}
            </span>
          </div>
          <div className="flex items-center gap-2">
            {formatDate(job.date) && (
              <span className="text-xs text-muted-foreground">
                {formatDate(job.date)}
              </span>
            )}
            <span className="text-xs font-medium text-muted-foreground">
              #{index + 1}
            </span>
          </div>
        </div>
        
        <h4 className="text-base font-semibold text-foreground mb-2 line-clamp-2 hover:text-primary transition-colors">
          <a 
            href={job.link} 
            target="_blank" 
            rel="noopener noreferrer"
            className="hover:underline"
          >
            {job.title}
          </a>
        </h4>
        
        {job.snippet && (
          <p className="text-sm text-muted-foreground line-clamp-3 mb-3">
            {job.snippet}
          </p>
        )}
        
        <div className="flex items-center justify-between">
          <a
            href={job.link}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 px-3 py-1.5 text-sm font-medium text-white bg-primary hover:bg-primary/90 rounded-md transition-colors group-hover:shadow-sm"
          >
            Apply Now
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
          </a>
          <span className="text-xs text-muted-foreground">
            {job.source}
          </span>
        </div>
      </div>
    </div>
  );
}
