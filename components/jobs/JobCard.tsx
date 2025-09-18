'use client';

import { useState } from 'react';
import { ArrowUpRight, ChevronDown, ChevronUp, Check, MapPin, Clock, DollarSign, Star, Users, TrendingUp, ExternalLink, Briefcase, Calendar, Zap } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface JobMetrics {
  matchScore: number;
  salary?: string;
  experience?: string;
  remote?: boolean;
  equity?: string;
  benefits?: string[];
  growth?: 'High' | 'Medium' | 'Low';
  companySize?: string;
  funding?: string;
  lastRaised?: string;
  age?: string;
  employees?: string;
  openJobs?: number;
}

interface JobBadges {
  unicorn?: boolean;
  remote?: boolean;
  equity?: boolean;
  fastGrowing?: boolean;
  wellFunded?: boolean;
  topTier?: boolean;
}

interface JobResult {
  id: string;
  title: string;
  link: string;
  snippet: string;
  date?: string;
  source: string;
  company?: string | null;
  companyLogo?: string | null;
  location?: string;
  type?: 'full-time' | 'part-time' | 'internship' | 'contract';
  level?: 'entry' | 'mid' | 'senior' | 'lead' | 'executive';
  skills?: string[];
  metrics?: JobMetrics;
  badges?: JobBadges;
  description?: string;
  requirements?: string[];
  responsibilities?: string[];
  benefits?: string[];
  culture?: string;
  team?: string;
  mission?: string;
}

interface JobCardProps {
  job: JobResult;
  index: number;
  isDark?: boolean;
  showExpanded?: boolean;
  onToggleExpanded?: (id: string) => void;
  onApply?: (id: string) => void;
  onSave?: (id: string) => void;
  onShare?: (id: string) => void;
}

export function JobCard({ 
  job, 
  index, 
  isDark = false, 
  showExpanded = false,
  onToggleExpanded,
  onApply,
  onSave,
  onShare
}: JobCardProps) {
  const [isExpanded, setIsExpanded] = useState(showExpanded);
  const [isApplied, setIsApplied] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

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

  const getMatchScoreColor = (score: number) => {
    if (score >= 90) return 'bg-emerald-500';
    if (score >= 80) return 'bg-emerald-500';
    if (score >= 70) return 'bg-yellow-500';
    return 'bg-gray-500';
  };

  const getGrowthColor = (growth?: string) => {
    switch (growth) {
      case 'High': return 'text-emerald-600';
      case 'Medium': return 'text-yellow-600';
      case 'Low': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  const handleToggleExpanded = () => {
    setIsExpanded(!isExpanded);
    onToggleExpanded?.(job.id);
  };

  const handleApply = () => {
    setIsApplied(true);
    onApply?.(job.id);
  };

  const handleSave = () => {
    setIsSaved(!isSaved);
    onSave?.(job.id);
  };

  const handleShare = () => {
    onShare?.(job.id);
  };

  return (
    <motion.div 
      className={`
        p-4 border rounded-lg transition-all duration-200 w-full group
        ${isDark 
          ? 'border-white/10 hover:bg-white/[0.02] bg-gray-900/50' 
          : 'border-gray-200 hover:bg-gray-50 bg-white'
        }
      `}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.1 }}
    >
      <div className="flex items-start gap-3 min-w-0">
        {/* Company Logo */}
        <div className="flex-shrink-0">
          {job.companyLogo ? (
            <img 
              src={job.companyLogo} 
              alt={`${job.company} logo`}
              className="w-10 h-10 rounded-lg object-contain bg-white border border-gray-200 p-1"
              onError={(e) => {
                e.currentTarget.style.display = 'none';
              }}
            />
          ) : (
            <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center">
              <img 
                src={getSourceLogo(job.source)} 
                alt={`${job.source} logo`}
                className="w-6 h-6"
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                }}
              />
            </div>
          )}
        </div>
        
        <div className="flex-1 min-w-0 overflow-hidden">
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0 flex-1">
              <h3 className={`
                text-lg font-semibold flex items-center gap-2 truncate
                ${isDark ? 'text-white' : 'text-gray-900'}
              `}>
                {job.title}
                <ArrowUpRight size={16} className={isDark ? 'text-white/40' : 'text-gray-400'} />
              </h3>
              
              <div className="mt-1 flex items-center gap-2 min-w-0">
                <span className={`
                  text-sm font-medium whitespace-nowrap
                  ${isDark ? 'text-white' : 'text-gray-900'}
                `}>
                  {job.company}
                </span>
                <span className={isDark ? 'text-white/40' : 'text-gray-400'}>•</span>
                <span className={`
                  text-sm truncate
                  ${isDark ? 'text-white/60' : 'text-gray-600'}
                `}>
                  {job.snippet}
                </span>
              </div>
            </div>

            <div className="flex flex-col items-end flex-shrink-0">
              <div className={`
                text-xs uppercase tracking-wide font-medium text-right whitespace-nowrap
                ${isDark ? 'text-white/60' : 'text-gray-500'}
              `}>
                {job.location || 'Remote'}
              </div>
              <div className={`
                text-xs mt-0.5
                ${isDark ? 'text-white/60' : 'text-gray-500'}
              `}>
                {formatDate(job.date) || 'Recently posted'}
              </div>
            </div>
          </div>

          {/* Metrics and Badges */}
          <div className="mt-3 flex items-center gap-3 flex-wrap">
            {job.metrics?.matchScore && (
              <div className="flex items-center gap-1.5">
                <div className={`
                  px-2 py-1 rounded font-mono text-white text-xs
                  ${getMatchScoreColor(job.metrics.matchScore)}
                `}>
                  {job.metrics.matchScore}
                </div>
                <span className={`
                  text-xs
                  ${isDark ? 'text-white/60' : 'text-gray-500'}
                `}>
                  Match Score
                </span>
              </div>
            )}

            {job.badges?.unicorn && (
              <div className="flex items-center gap-1">
                <span role="img" aria-label="unicorn">🦄</span>
                <span className={`
                  text-xs
                  ${isDark ? 'text-white/60' : 'text-gray-500'}
                `}>Unicorn</span>
              </div>
            )}

            {job.badges?.remote && (
              <div className="flex items-center gap-1">
                <MapPin size={12} className={isDark ? 'text-white/60' : 'text-gray-500'} />
                <span className={`
                  text-xs
                  ${isDark ? 'text-white/60' : 'text-gray-500'}
                `}>Remote</span>
              </div>
            )}

            {job.metrics?.salary && (
              <div className="flex items-center gap-1">
                <DollarSign size={12} className={isDark ? 'text-white/60' : 'text-gray-500'} />
                <span className={`
                  text-xs font-medium
                  ${isDark ? 'text-white' : 'text-gray-900'}
                `}>
                  {job.metrics.salary}
                </span>
              </div>
            )}

            {job.metrics?.growth && (
              <div className="flex items-center gap-1">
                <TrendingUp size={12} className={getGrowthColor(job.metrics.growth)} />
                <span className={`
                  text-xs
                  ${getGrowthColor(job.metrics.growth)}
                `}>
                  {job.metrics.growth} Growth
                </span>
              </div>
            )}
          </div>

          {/* Skills */}
          {job.skills && job.skills.length > 0 && (
            <div className="mt-3 flex flex-wrap gap-1">
              {job.skills.slice(0, 5).map((skill) => (
                <span
                  key={skill}
                  className={`
                    text-xs font-medium px-2 py-1 rounded-md
                    ${isDark 
                      ? 'bg-white/10 text-white/80' 
                      : 'bg-gray-100 text-gray-800'
                    }
                  `}
                >
                  {skill}
                </span>
              ))}
              {job.skills.length > 5 && (
                <span className={`
                  text-xs px-2 py-1 rounded-md
                  ${isDark 
                    ? 'bg-white/5 text-white/60' 
                    : 'bg-gray-50 text-gray-600'
                  }
                `}>
                  +{job.skills.length - 5} more
                </span>
              )}
            </div>
          )}

          {/* Action Buttons */}
          <div className="mt-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <button
                onClick={handleApply}
                disabled={isApplied}
                className={`
                  relative px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200
                  ${isApplied
                    ? 'bg-emerald-100 text-emerald-600 cursor-not-allowed'
                    : 'bg-blue-600 text-white hover:bg-blue-700'
                  }
                `}
              >
                <motion.span
                  initial={false}
                  animate={{ opacity: 1 }}
                  className="flex items-center gap-1"
                >
                  {isApplied && <Check size={14} />}
                  {isApplied ? 'Applied' : 'Apply Now'}
                </motion.span>
              </button>

              <button
                onClick={handleSave}
                className={`
                  p-2 rounded-lg transition-colors duration-200
                  ${isSaved
                    ? 'bg-yellow-100 text-yellow-600'
                    : isDark
                      ? 'hover:bg-white/10 text-white/60 hover:text-white'
                      : 'hover:bg-gray-100 text-gray-500 hover:text-gray-700'
                  }
                `}
              >
                <Star size={16} fill={isSaved ? 'currentColor' : 'none'} />
              </button>

              <button
                onClick={handleShare}
                className={`
                  p-2 rounded-lg transition-colors duration-200
                  ${isDark
                    ? 'hover:bg-white/10 text-white/60 hover:text-white'
                    : 'hover:bg-gray-100 text-gray-500 hover:text-gray-700'
                  }
                `}
              >
                <ExternalLink size={16} />
              </button>
            </div>

            <button
              onClick={handleToggleExpanded}
              className={`
                p-2 rounded-lg transition-colors duration-200
                ${isDark 
                  ? 'hover:bg-white/10 text-white/60' 
                  : 'hover:bg-gray-100 text-gray-500'
                }
              `}
            >
              {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
            </button>
          </div>

          {/* Expanded Content */}
          <AnimatePresence>
            {isExpanded && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="overflow-hidden"
              >
                <div className={`
                  mt-4 pt-4 border-t space-y-4
                  ${isDark ? 'border-white/10' : 'border-gray-200'}
                `}>
                  {/* Detailed Description */}
                  {job.description && (
                    <div>
                      <h4 className={`
                        text-sm font-semibold mb-2
                        ${isDark ? 'text-white' : 'text-gray-900'}
                      `}>
                        About This Role
                      </h4>
                      <p className={`
                        text-sm
                        ${isDark ? 'text-white/70' : 'text-gray-600'}
                      `}>
                        {job.description}
                      </p>
                    </div>
                  )}

                  {/* Requirements */}
                  {job.requirements && job.requirements.length > 0 && (
                    <div>
                      <h4 className={`
                        text-sm font-semibold mb-2
                        ${isDark ? 'text-white' : 'text-gray-900'}
                      `}>
                        Requirements
                      </h4>
                      <ul className="space-y-1">
                        {job.requirements.slice(0, 5).map((req, idx) => (
                          <li key={idx} className={`
                            text-sm flex items-start gap-2
                            ${isDark ? 'text-white/70' : 'text-gray-600'}
                          `}>
                            <span className="text-blue-500 mt-1">•</span>
                            {req}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Company Info */}
                  <div className="grid grid-cols-2 gap-4">
                    {job.metrics?.employees && (
                      <div className="flex items-center gap-2">
                        <Users size={14} className={isDark ? 'text-white/40' : 'text-gray-400'} />
                        <span className={`
                          text-sm
                          ${isDark ? 'text-white/70' : 'text-gray-600'}
                        `}>
                          {job.metrics.employees} employees
                        </span>
                      </div>
                    )}
                    
                    {job.metrics?.funding && (
                      <div className="flex items-center gap-2">
                        <TrendingUp size={14} className={isDark ? 'text-white/40' : 'text-gray-400'} />
                        <span className={`
                          text-sm
                          ${isDark ? 'text-white/70' : 'text-gray-600'}
                        `}>
                          {job.metrics.funding} funding
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  );
}
