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
    <div className='group relative flex items-start rounded-lg border border-border/50 bg-muted/50 p-4 transition-colors hover:bg-muted/70'>
      {/* Company Logo (Primary) */}
      <div className='mr-3 flex-shrink-0'>
        {job.companyLogo ? (
          <img 
            src={job.companyLogo} 
            alt={`${job.company} logo`}
            className='h-8 w-8 rounded-md border border-border/50 bg-white object-contain p-1'
            onError={(e) => {
              e.currentTarget.style.display = 'none';
            }}
          />
        ) : (
          <div className='flex h-8 w-8 items-center justify-center rounded-md border border-border/50 bg-muted'>
            <img 
              src={getSourceLogo(job.source)} 
              alt={`${job.source} logo`}
              className='h-5 w-5 rounded-sm'
              onError={(e) => {
                e.currentTarget.style.display = 'none';
              }}
            />
          </div>
        )}
      </div>

      {/* Job Content */}
      <div className='min-w-0 flex-1'>
        <div className='mb-2 flex items-center justify-between'>
          <div className="flex items-center gap-2">
            {job.company && (
              <span className='font-semibold text-foreground text-sm'>
                {job.company}
              </span>
            )}
            <span className='text-muted-foreground text-xs'>
              via {job.source}
            </span>
          </div>
          <div className="flex items-center gap-2">
            {formatDate(job.date) && (
              <span className='text-muted-foreground text-xs'>
                {formatDate(job.date)}
              </span>
            )}
            <span className='font-medium text-muted-foreground text-xs'>
              #{index + 1}
            </span>
          </div>
        </div>
        
        <h4 className='mb-2 line-clamp-2 font-semibold text-base text-foreground transition-colors hover:text-primary'>
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
          <p className='mb-3 line-clamp-3 text-muted-foreground text-sm'>
            {job.snippet}
          </p>
        )}
        
        <div className="flex items-center justify-between">
          <a
            href={job.link}
            target="_blank"
            rel="noopener noreferrer"
            className='inline-flex items-center gap-1 rounded-md bg-primary px-3 py-1.5 font-medium text-sm text-white transition-colors hover:bg-primary/90 group-hover:shadow-sm'
          >
            Apply Now
            <svg className='h-3 w-3' fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
          </a>
          <span className='text-muted-foreground text-xs'>
            {job.source}
          </span>
        </div>
      </div>
    </div>
  );
}
