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
    <div className="mt-6 pt-4 border-t border-border">
      {/* Jobs Header */}
      <div 
        className="flex items-center cursor-pointer group"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="mr-3">
          <StackedJobLogos jobs={jobs} />
        </div>
        <span className="text-sm font-medium text-foreground group-hover:text-foreground/80 transition-colors">
          Job Opportunities
        </span>
        <span className="ml-2 text-xs text-muted-foreground">
          ({jobs.length})
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
