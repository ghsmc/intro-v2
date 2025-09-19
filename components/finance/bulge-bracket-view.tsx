'use client';

import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Calendar,
  MapPin,
  ExternalLink,
  Clock,
  AlertCircle,
  FileText,
  Search,
  ChevronRight,
  Briefcase,
  DollarSign,
  Filter,
  X
} from 'lucide-react';
import {
  bulgeBracketPrograms,
  getOpenPrograms,
  getUpcomingPrograms,
  type InternshipProgram
} from '@/lib/data/bulge-bracket-programs';
import { cn } from '@/lib/utils';

type FilterType = 'all' | 'open' | 'upcoming' | 'closed';
type TierFilter = 'all' | 'Bulge Bracket' | 'Elite Boutique' | 'Middle Market' | 'Specialized';

export function BulgeBracketView() {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<FilterType>('all');
  const [tierFilter, setTierFilter] = useState<TierFilter>('all');
  const [selectedProgram, setSelectedProgram] = useState<InternshipProgram | null>(null);
  const [showFilters, setShowFilters] = useState(false);

  // Filter programs
  const filteredPrograms = useMemo(() => {
    let programs = [...bulgeBracketPrograms];

    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      programs = programs.filter(p =>
        p.company.toLowerCase().includes(query) ||
        p.programName.toLowerCase().includes(query) ||
        p.locations.some(l => l.toLowerCase().includes(query)) ||
        p.notes?.toLowerCase().includes(query)
      );
    }

    // Status filter
    if (filterType === 'open') {
      programs = getOpenPrograms();
    } else if (filterType === 'upcoming') {
      programs = getUpcomingPrograms();
    } else if (filterType === 'closed') {
      const today = new Date();
      programs = programs.filter(p => {
        if (!p.closingDate) return false;
        return new Date(p.closingDate) < today;
      });
    }

    // Tier filter
    if (tierFilter !== 'all') {
      programs = programs.filter(p => p.tier === tierFilter);
    }

    return programs;
  }, [searchQuery, filterType, tierFilter]);

  const getStatusBadge = (program: InternshipProgram) => {
    const today = new Date();
    const openDate = program.openingDate ? new Date(program.openingDate) : null;
    const closeDate = program.closingDate ? new Date(program.closingDate) : null;

    if (program.latestStage === 'Offers Out') {
      return <span className='rounded-full bg-green-500/10 px-2 py-0.5 text-green-600 text-xs'>Offers Out</span>;
    }
    if (openDate && openDate > today) {
      const daysUntil = Math.ceil((openDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
      return <span className='rounded-full bg-yellow-500/10 px-2 py-0.5 text-xs text-yellow-600'>Opens in {daysUntil}d</span>;
    }
    if (closeDate && closeDate >= today && openDate && openDate <= today) {
      const daysLeft = Math.ceil((closeDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
      if (daysLeft <= 7) {
        return <span className='rounded-full bg-red-500/10 px-2 py-0.5 text-red-600 text-xs'>{daysLeft}d left</span>;
      }
      return <span className='rounded-full bg-green-500/10 px-2 py-0.5 text-green-600 text-xs'>Open</span>;
    }
    if (closeDate && closeDate < today) {
      return <span className='rounded-full bg-gray-500/10 px-2 py-0.5 text-gray-600 text-xs'>Closed</span>;
    }
    return <span className='rounded-full bg-blue-500/10 px-2 py-0.5 text-blue-600 text-xs'>Rolling</span>;
  };

  const getTierBadgeColor = (tier: string) => {
    switch (tier) {
      case 'Bulge Bracket':
        return 'bg-blue-500/10 text-blue-600 border-blue-500/20';
      case 'Elite Boutique':
        return 'bg-purple-500/10 text-purple-600 border-purple-500/20';
      case 'Middle Market':
        return 'bg-green-500/10 text-green-600 border-green-500/20';
      case 'Specialized':
        return 'bg-orange-500/10 text-orange-600 border-orange-500/20';
      default:
        return 'bg-gray-500/10 text-gray-600 border-gray-500/20';
    }
  };

  const formatDate = (dateStr: string | null) => {
    if (!dateStr) return '—';
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  // Group by tier for display
  const programsByTier = useMemo(() => {
    const grouped: Record<string, InternshipProgram[]> = {};
    filteredPrograms.forEach(program => {
      if (!grouped[program.tier]) {
        grouped[program.tier] = [];
      }
      grouped[program.tier].push(program);
    });
    return grouped;
  }, [filteredPrograms]);

  return (
    <div className='flex h-full flex-col bg-background'>
      {/* Compact Header */}
      <div className='border-border border-b'>
        <div className="px-6 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-6">
              <div>
                <h1 className='font-semibold text-xl'>Bulge Bracket</h1>
                <p className='text-muted-foreground text-xs'>2026 Investment Banking Programs</p>
              </div>

              {/* Quick Stats */}
              <div className='hidden items-center gap-4 text-xs md:flex'>
                <div className="flex items-center gap-1.5">
                  <div className='size-2 rounded-full bg-green-500' />
                  <span className="text-muted-foreground">{getOpenPrograms().length} Open</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className='size-2 rounded-full bg-yellow-500' />
                  <span className="text-muted-foreground">{getUpcomingPrograms().length} Upcoming</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className='size-2 rounded-full bg-gray-500' />
                  <span className="text-muted-foreground">{filteredPrograms.length} Total</span>
                </div>
              </div>
            </div>

            {/* Search Bar */}
            <div className="flex items-center gap-2">
              <div className="relative">
                <Search className='-translate-y-1/2 absolute top-1/2 left-3 size-3.5 transform text-muted-foreground' />
                <input
                  type="text"
                  placeholder="Search programs..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className='w-64 rounded-md border border-border bg-muted/50 py-1.5 pr-3 pl-9 text-sm focus:outline-none focus:ring-1 focus:ring-primary/20'
                />
              </div>
              <button
                onClick={() => setShowFilters(!showFilters)}
                className={cn(
                  'rounded-md p-1.5 transition-colors',
                  showFilters ? "bg-primary/10 text-primary" : "hover:bg-muted"
                )}
              >
                <Filter className="size-4" />
              </button>
            </div>
          </div>

          {/* Collapsible Filters */}
          <AnimatePresence>
            {showFilters && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className='flex gap-2 overflow-hidden pt-3'
              >
                <select
                  value={filterType}
                  onChange={(e) => setFilterType(e.target.value as FilterType)}
                  className='rounded-md border border-border bg-muted/50 px-3 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-primary/20'
                >
                  <option value="all">All Status</option>
                  <option value="open">Open Now</option>
                  <option value="upcoming">Upcoming</option>
                  <option value="closed">Closed</option>
                </select>

                <select
                  value={tierFilter}
                  onChange={(e) => setTierFilter(e.target.value as TierFilter)}
                  className='rounded-md border border-border bg-muted/50 px-3 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-primary/20'
                >
                  <option value="all">All Tiers</option>
                  <option value="Bulge Bracket">Bulge Bracket</option>
                  <option value="Elite Boutique">Elite Boutique</option>
                  <option value="Middle Market">Middle Market</option>
                  <option value="Specialized">Specialized</option>
                </select>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Compact Table View */}
      <div className="flex-1 overflow-auto">
        <table className="w-full">
          <thead className='sticky top-0 border-border border-b bg-background'>
            <tr className='text-muted-foreground text-xs'>
              <th className='px-6 py-2 text-left font-medium'>Company</th>
              <th className='hidden px-2 py-2 text-left font-medium lg:table-cell'>Program</th>
              <th className='px-2 py-2 text-left font-medium'>Status</th>
              <th className='hidden px-2 py-2 text-left font-medium md:table-cell'>Opens</th>
              <th className='hidden px-2 py-2 text-left font-medium md:table-cell'>Closes</th>
              <th className='hidden px-2 py-2 text-left font-medium sm:table-cell'>Locations</th>
              <th className='hidden px-2 py-2 text-left font-medium xl:table-cell'>Requirements</th>
              <th className="px-2 py-2" />
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {filteredPrograms.map((program, index) => (
              <motion.tr
                key={program.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: index * 0.01 }}
                className='group cursor-pointer transition-colors hover:bg-muted/30'
                onClick={() => setSelectedProgram(program)}
              >
                <td className="px-6 py-2.5">
                  <div className="flex items-center gap-2">
                    <div>
                      <div className="font-medium text-sm">{program.company}</div>
                      <div className='text-muted-foreground text-xs lg:hidden'>{program.programName}</div>
                    </div>
                    <span className={cn('hidden rounded border px-1.5 py-0.5 text-xs sm:inline-flex', getTierBadgeColor(program.tier))}>
                      {program.tier === 'Bulge Bracket' ? 'BB' :
                       program.tier === 'Elite Boutique' ? 'EB' :
                       program.tier === 'Middle Market' ? 'MM' :
                       program.tier.slice(0, 1)}
                    </span>
                  </div>
                </td>
                <td className='hidden px-2 py-2.5 lg:table-cell'>
                  <span className='text-muted-foreground text-sm'>{program.programName}</span>
                </td>
                <td className="px-2 py-2.5">
                  {getStatusBadge(program)}
                </td>
                <td className='hidden px-2 py-2.5 md:table-cell'>
                  <span className='text-muted-foreground text-sm'>{formatDate(program.openingDate)}</span>
                </td>
                <td className='hidden px-2 py-2.5 md:table-cell'>
                  <span className='text-muted-foreground text-sm'>{formatDate(program.closingDate)}</span>
                </td>
                <td className='hidden px-2 py-2.5 sm:table-cell'>
                  <div className="flex items-center gap-1">
                    <MapPin className="size-3 text-muted-foreground" />
                    <span className='text-muted-foreground text-sm'>{program.locations.length}</span>
                  </div>
                </td>
                <td className='hidden px-2 py-2.5 xl:table-cell'>
                  <div className="flex gap-1">
                    {program.requiresCV && (
                      <span className='flex size-6 items-center justify-center rounded bg-muted' title="CV Required">
                        <FileText className="size-3 text-muted-foreground" />
                      </span>
                    )}
                    {program.requiresCoverLetter && (
                      <span className='flex size-6 items-center justify-center rounded bg-muted' title="Cover Letter">
                        <FileText className="size-3 text-muted-foreground" />
                      </span>
                    )}
                    {program.testPrep && (
                      <span className='flex size-6 items-center justify-center rounded bg-blue-500/10' title={program.testPrep}>
                        <AlertCircle className="size-3 text-blue-600" />
                      </span>
                    )}
                  </div>
                </td>
                <td className="px-2 py-2.5">
                  <ChevronRight className='size-4 text-muted-foreground transition-colors group-hover:text-foreground' />
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>

        {filteredPrograms.length === 0 && (
          <div className='flex h-64 items-center justify-center'>
            <div className="text-center">
              <Briefcase className='mx-auto mb-3 size-12 text-muted-foreground/50' />
              <p className='text-muted-foreground text-sm'>No programs match your filters</p>
            </div>
          </div>
        )}
      </div>

      {/* Sleek Program Detail Modal */}
      <AnimatePresence>
        {selectedProgram && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className='fixed inset-0 z-50 flex items-center justify-center bg-background/80 p-4 backdrop-blur-sm'
            onClick={() => setSelectedProgram(null)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className='max-h-[80vh] w-full max-w-2xl overflow-y-auto rounded-lg border border-border bg-card'
              onClick={(e) => e.stopPropagation()}
            >
              {/* Modal Header */}
              <div className='sticky top-0 border-border border-b bg-card px-6 py-4'>
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className='font-semibold text-lg'>{selectedProgram.company}</h2>
                    <p className='text-muted-foreground text-sm'>{selectedProgram.programName}</p>
                  </div>
                  <button
                    onClick={() => setSelectedProgram(null)}
                    className='rounded p-1 transition-colors hover:bg-muted'
                  >
                    <X className="size-4" />
                  </button>
                </div>
              </div>

              {/* Modal Content */}
              <div className='space-y-6 p-6'>
                {/* Key Info Grid */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-3">
                    <div>
                      <p className='mb-1 text-muted-foreground text-xs'>Timeline</p>
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 text-sm">
                          <Calendar className="size-3 text-muted-foreground" />
                          <span>Opens: {formatDate(selectedProgram.openingDate) || 'TBA'}</span>
                        </div>
                        {selectedProgram.closingDate && (
                          <div className="flex items-center gap-2 text-sm">
                            <Clock className="size-3 text-muted-foreground" />
                            <span>Closes: {formatDate(selectedProgram.closingDate)}</span>
                          </div>
                        )}
                      </div>
                    </div>

                    {selectedProgram.division && (
                      <div>
                        <p className='mb-1 text-muted-foreground text-xs'>Division</p>
                        <p className="text-sm">{selectedProgram.division}</p>
                      </div>
                    )}

                    {selectedProgram.compensationRange && (
                      <div>
                        <p className='mb-1 text-muted-foreground text-xs'>Compensation</p>
                        <div className="flex items-center gap-1.5 text-sm">
                          <DollarSign className="size-3 text-green-600" />
                          <span>{selectedProgram.compensationRange}</span>
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="space-y-3">
                    <div>
                      <p className='mb-1 text-muted-foreground text-xs'>Requirements</p>
                      <div className="space-y-1 text-sm">
                        <div className="flex items-center gap-2">
                          <div className={cn('flex size-4 items-center justify-center rounded-full',
                            selectedProgram.requiresCV ? "bg-green-500/20" : "bg-gray-500/20"
                          )}>
                            {selectedProgram.requiresCV ? '✓' : '–'}
                          </div>
                          <span className={cn(selectedProgram.requiresCV ? "" : "text-muted-foreground")}>CV/Resume</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className={cn('flex size-4 items-center justify-center rounded-full',
                            selectedProgram.requiresCoverLetter ? "bg-green-500/20" : "bg-gray-500/20"
                          )}>
                            {selectedProgram.requiresCoverLetter ? '✓' : '–'}
                          </div>
                          <span className={cn(selectedProgram.requiresCoverLetter ? "" : "text-muted-foreground")}>Cover Letter</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className={cn('flex size-4 items-center justify-center rounded-full',
                            selectedProgram.requiresWrittenAnswers ? "bg-green-500/20" : "bg-gray-500/20"
                          )}>
                            {selectedProgram.requiresWrittenAnswers ? '✓' : '–'}
                          </div>
                          <span className={cn(selectedProgram.requiresWrittenAnswers ? "" : "text-muted-foreground")}>Written Answers</span>
                        </div>
                      </div>
                    </div>

                    {selectedProgram.testPrep && (
                      <div>
                        <p className='mb-1 text-muted-foreground text-xs'>Assessment</p>
                        <div className='inline-flex items-center gap-1.5 rounded bg-blue-500/10 px-2 py-1 text-blue-600 text-sm'>
                          <AlertCircle className="size-3" />
                          {selectedProgram.testPrep}
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Locations */}
                <div>
                  <p className='mb-2 text-muted-foreground text-xs'>Locations ({selectedProgram.locations.length})</p>
                  <div className="flex flex-wrap gap-1.5">
                    {selectedProgram.locations.map((location) => (
                      <span key={location} className='rounded bg-muted px-2 py-1 text-xs'>
                        {location}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Notes */}
                {selectedProgram.notes && (
                  <div>
                    <p className='mb-2 text-muted-foreground text-xs'>Important Notes</p>
                    <div className='rounded-md bg-muted/50 p-3'>
                      <p className="text-sm">{selectedProgram.notes}</p>
                    </div>
                  </div>
                )}

                {/* Historical Data */}
                {selectedProgram.lastYearOpening && (
                  <div className='border-border border-t pt-3'>
                    <p className='text-muted-foreground text-xs'>Last year opened: {selectedProgram.lastYearOpening}</p>
                  </div>
                )}

                {/* Actions */}
                <div className="flex items-center gap-2 pt-3">
                  <button className='flex flex-1 items-center justify-center gap-2 rounded-md bg-primary px-4 py-2 text-primary-foreground text-sm transition-colors hover:bg-primary/90'>
                    <ExternalLink className="size-3.5" />
                    Apply Now
                  </button>
                  <button className='rounded-md bg-muted px-4 py-2 text-sm transition-colors hover:bg-muted/80'>
                    Save
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}