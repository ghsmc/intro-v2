'use client';

import { useState } from 'react';
import { JobCard } from './JobCard';
import { StackedJobLogos } from './StackedJobLogos';

interface JobResult {
  title: string;
  link: string;
  snippet: string;
  date?: string;
  source: string;
}

interface JobsSectionProps {
  jobs: JobResult[];
}

export function JobsSection({ jobs }: JobsSectionProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  if (!jobs || jobs.length === 0) return null;

  return (
    <div className='mt-6 border-border border-t pt-4'>
      {/* Jobs Header */}
      <div 
        className='group flex cursor-pointer items-center'
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="mr-3">
          <StackedJobLogos jobs={jobs} />
        </div>
        <span className='font-medium text-foreground text-sm transition-colors group-hover:text-foreground/80'>
          Job Opportunities
        </span>
        <span className='ml-2 text-muted-foreground text-xs'>
          ({jobs.length})
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

      {/* Expanded Jobs List */}
      {isExpanded && (
        <div className="mt-3 space-y-3">
          {jobs.map((job, index) => (
            <JobCard 
              key={`${job.link}-${index}`}
              job={job}
              index={index}
            />
          ))}
        </div>
      )}
    </div>
  );
}
