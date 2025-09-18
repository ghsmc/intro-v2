'use client';

import { useMemo } from 'react';

interface JobResult {
  title: string;
  link: string;
  snippet: string;
  date?: string;
  source: string;
}

interface StackedJobLogosProps {
  jobs: JobResult[];
  maxVisible?: number;
}

export function StackedJobLogos({ jobs, maxVisible = 3 }: StackedJobLogosProps) {
  const uniqueSources = useMemo(() => {
    const seenSources = new Set<string>();
    return jobs.filter(job => {
      if (seenSources.has(job.source)) {
        return false;
      }
      seenSources.add(job.source);
      return true;
    });
  }, [jobs]);

  const visibleSources = uniqueSources.slice(0, maxVisible);
  const remainingCount = uniqueSources.length - maxVisible;

  const getSourceLogo = (source: string) => {
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
    
    return logos[source] || 'https://www.google.com/s2/favicons?domain=company.com&sz=32';
  };

  return (
    <div className='-space-x-2 flex items-center'>
      {visibleSources.map((job, index) => (
        <div
          key={job.source}
          className='relative h-6 w-6 overflow-hidden rounded-full border-2 border-background bg-background ring-1 ring-border'
          style={{ zIndex: visibleSources.length - index }}
        >
          <img 
            src={getSourceLogo(job.source)} 
            alt={`${job.source} logo`}
            className='h-full w-full object-cover'
            onError={(e) => {
              e.currentTarget.style.display = 'none';
            }}
          />
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
