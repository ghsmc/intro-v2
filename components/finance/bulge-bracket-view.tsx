'use client';

import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Calendar,
  MapPin,
  Building2,
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
      return <span className="px-2 py-0.5 bg-green-500/10 text-green-600 text-xs rounded-full">Offers Out</span>;
    }
    if (openDate && openDate > today) {
      const daysUntil = Math.ceil((openDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
      return <span className="px-2 py-0.5 bg-yellow-500/10 text-yellow-600 text-xs rounded-full">Opens in {daysUntil}d</span>;
    }
    if (closeDate && closeDate >= today && openDate && openDate <= today) {
      const daysLeft = Math.ceil((closeDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
      if (daysLeft <= 7) {
        return <span className="px-2 py-0.5 bg-red-500/10 text-red-600 text-xs rounded-full">{daysLeft}d left</span>;
      }
      return <span className="px-2 py-0.5 bg-green-500/10 text-green-600 text-xs rounded-full">Open</span>;
    }
    if (closeDate && closeDate < today) {
      return <span className="px-2 py-0.5 bg-gray-500/10 text-gray-600 text-xs rounded-full">Closed</span>;
    }
    return <span className="px-2 py-0.5 bg-blue-500/10 text-blue-600 text-xs rounded-full">Rolling</span>;
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
    <div className="flex flex-col h-full bg-background">
      {/* Compact Header */}
      <div className="border-b border-border">
        <div className="px-6 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-6">
              <div>
                <h1 className="text-xl font-semibold">Bulge Bracket</h1>
                <p className="text-xs text-muted-foreground">2026 Investment Banking Programs</p>
              </div>

              {/* Quick Stats */}
              <div className="hidden md:flex items-center gap-4 text-xs">
                <div className="flex items-center gap-1.5">
                  <div className="size-2 bg-green-500 rounded-full"></div>
                  <span className="text-muted-foreground">{getOpenPrograms().length} Open</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="size-2 bg-yellow-500 rounded-full"></div>
                  <span className="text-muted-foreground">{getUpcomingPrograms().length} Upcoming</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="size-2 bg-gray-500 rounded-full"></div>
                  <span className="text-muted-foreground">{filteredPrograms.length} Total</span>
                </div>
              </div>
            </div>

            {/* Search Bar */}
            <div className="flex items-center gap-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 size-3.5 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Search programs..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-64 pl-9 pr-3 py-1.5 text-sm bg-muted/50 border border-border rounded-md focus:outline-none focus:ring-1 focus:ring-primary/20"
                />
              </div>
              <button
                onClick={() => setShowFilters(!showFilters)}
                className={cn(
                  "p-1.5 rounded-md transition-colors",
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
                className="pt-3 flex gap-2 overflow-hidden"
              >
                <select
                  value={filterType}
                  onChange={(e) => setFilterType(e.target.value as FilterType)}
                  className="px-3 py-1 text-sm bg-muted/50 border border-border rounded-md focus:outline-none focus:ring-1 focus:ring-primary/20"
                >
                  <option value="all">All Status</option>
                  <option value="open">Open Now</option>
                  <option value="upcoming">Upcoming</option>
                  <option value="closed">Closed</option>
                </select>

                <select
                  value={tierFilter}
                  onChange={(e) => setTierFilter(e.target.value as TierFilter)}
                  className="px-3 py-1 text-sm bg-muted/50 border border-border rounded-md focus:outline-none focus:ring-1 focus:ring-primary/20"
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
          <thead className="sticky top-0 bg-background border-b border-border">
            <tr className="text-xs text-muted-foreground">
              <th className="text-left px-6 py-2 font-medium">Company</th>
              <th className="text-left px-2 py-2 font-medium hidden lg:table-cell">Program</th>
              <th className="text-left px-2 py-2 font-medium">Status</th>
              <th className="text-left px-2 py-2 font-medium hidden md:table-cell">Opens</th>
              <th className="text-left px-2 py-2 font-medium hidden md:table-cell">Closes</th>
              <th className="text-left px-2 py-2 font-medium hidden sm:table-cell">Locations</th>
              <th className="text-left px-2 py-2 font-medium hidden xl:table-cell">Requirements</th>
              <th className="px-2 py-2"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {filteredPrograms.map((program, index) => (
              <motion.tr
                key={program.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: index * 0.01 }}
                className="group hover:bg-muted/30 transition-colors cursor-pointer"
                onClick={() => setSelectedProgram(program)}
              >
                <td className="px-6 py-2.5">
                  <div className="flex items-center gap-2">
                    <div>
                      <div className="font-medium text-sm">{program.company}</div>
                      <div className="text-xs text-muted-foreground lg:hidden">{program.programName}</div>
                    </div>
                    <span className={cn("px-1.5 py-0.5 text-xs rounded border hidden sm:inline-flex", getTierBadgeColor(program.tier))}>
                      {program.tier === 'Bulge Bracket' ? 'BB' :
                       program.tier === 'Elite Boutique' ? 'EB' :
                       program.tier === 'Middle Market' ? 'MM' :
                       program.tier.slice(0, 1)}
                    </span>
                  </div>
                </td>
                <td className="px-2 py-2.5 hidden lg:table-cell">
                  <span className="text-sm text-muted-foreground">{program.programName}</span>
                </td>
                <td className="px-2 py-2.5">
                  {getStatusBadge(program)}
                </td>
                <td className="px-2 py-2.5 hidden md:table-cell">
                  <span className="text-sm text-muted-foreground">{formatDate(program.openingDate)}</span>
                </td>
                <td className="px-2 py-2.5 hidden md:table-cell">
                  <span className="text-sm text-muted-foreground">{formatDate(program.closingDate)}</span>
                </td>
                <td className="px-2 py-2.5 hidden sm:table-cell">
                  <div className="flex items-center gap-1">
                    <MapPin className="size-3 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">{program.locations.length}</span>
                  </div>
                </td>
                <td className="px-2 py-2.5 hidden xl:table-cell">
                  <div className="flex gap-1">
                    {program.requiresCV && (
                      <span className="size-6 rounded bg-muted flex items-center justify-center" title="CV Required">
                        <FileText className="size-3 text-muted-foreground" />
                      </span>
                    )}
                    {program.requiresCoverLetter && (
                      <span className="size-6 rounded bg-muted flex items-center justify-center" title="Cover Letter">
                        <FileText className="size-3 text-muted-foreground" />
                      </span>
                    )}
                    {program.testPrep && (
                      <span className="size-6 rounded bg-blue-500/10 flex items-center justify-center" title={program.testPrep}>
                        <AlertCircle className="size-3 text-blue-600" />
                      </span>
                    )}
                  </div>
                </td>
                <td className="px-2 py-2.5">
                  <ChevronRight className="size-4 text-muted-foreground group-hover:text-foreground transition-colors" />
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>

        {filteredPrograms.length === 0 && (
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <Briefcase className="size-12 text-muted-foreground/50 mx-auto mb-3" />
              <p className="text-sm text-muted-foreground">No programs match your filters</p>
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
            className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setSelectedProgram(null)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-card border border-border rounded-lg max-w-2xl w-full max-h-[80vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Modal Header */}
              <div className="sticky top-0 bg-card border-b border-border px-6 py-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-lg font-semibold">{selectedProgram.company}</h2>
                    <p className="text-sm text-muted-foreground">{selectedProgram.programName}</p>
                  </div>
                  <button
                    onClick={() => setSelectedProgram(null)}
                    className="p-1 hover:bg-muted rounded transition-colors"
                  >
                    <X className="size-4" />
                  </button>
                </div>
              </div>

              {/* Modal Content */}
              <div className="p-6 space-y-6">
                {/* Key Info Grid */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-3">
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">Timeline</p>
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
                        <p className="text-xs text-muted-foreground mb-1">Division</p>
                        <p className="text-sm">{selectedProgram.division}</p>
                      </div>
                    )}

                    {selectedProgram.compensationRange && (
                      <div>
                        <p className="text-xs text-muted-foreground mb-1">Compensation</p>
                        <div className="flex items-center gap-1.5 text-sm">
                          <DollarSign className="size-3 text-green-600" />
                          <span>{selectedProgram.compensationRange}</span>
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="space-y-3">
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">Requirements</p>
                      <div className="space-y-1 text-sm">
                        <div className="flex items-center gap-2">
                          <div className={cn("size-4 rounded-full flex items-center justify-center",
                            selectedProgram.requiresCV ? "bg-green-500/20" : "bg-gray-500/20"
                          )}>
                            {selectedProgram.requiresCV ? '✓' : '–'}
                          </div>
                          <span className={cn(selectedProgram.requiresCV ? "" : "text-muted-foreground")}>CV/Resume</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className={cn("size-4 rounded-full flex items-center justify-center",
                            selectedProgram.requiresCoverLetter ? "bg-green-500/20" : "bg-gray-500/20"
                          )}>
                            {selectedProgram.requiresCoverLetter ? '✓' : '–'}
                          </div>
                          <span className={cn(selectedProgram.requiresCoverLetter ? "" : "text-muted-foreground")}>Cover Letter</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className={cn("size-4 rounded-full flex items-center justify-center",
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
                        <p className="text-xs text-muted-foreground mb-1">Assessment</p>
                        <div className="inline-flex items-center gap-1.5 px-2 py-1 bg-blue-500/10 text-blue-600 rounded text-sm">
                          <AlertCircle className="size-3" />
                          {selectedProgram.testPrep}
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Locations */}
                <div>
                  <p className="text-xs text-muted-foreground mb-2">Locations ({selectedProgram.locations.length})</p>
                  <div className="flex flex-wrap gap-1.5">
                    {selectedProgram.locations.map((location) => (
                      <span key={location} className="px-2 py-1 bg-muted text-xs rounded">
                        {location}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Notes */}
                {selectedProgram.notes && (
                  <div>
                    <p className="text-xs text-muted-foreground mb-2">Important Notes</p>
                    <div className="p-3 bg-muted/50 rounded-md">
                      <p className="text-sm">{selectedProgram.notes}</p>
                    </div>
                  </div>
                )}

                {/* Historical Data */}
                {selectedProgram.lastYearOpening && (
                  <div className="pt-3 border-t border-border">
                    <p className="text-xs text-muted-foreground">Last year opened: {selectedProgram.lastYearOpening}</p>
                  </div>
                )}

                {/* Actions */}
                <div className="flex items-center gap-2 pt-3">
                  <button className="flex-1 px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors text-sm flex items-center justify-center gap-2">
                    <ExternalLink className="size-3.5" />
                    Apply Now
                  </button>
                  <button className="px-4 py-2 bg-muted rounded-md hover:bg-muted/80 transition-colors text-sm">
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