'use client';

import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { MapPin, ExternalLink, Code, Users, Calendar, DollarSign, Sparkles, ChevronDown, ChevronUp, Search, } from 'lucide-react';

interface FinanceCompany {
  id: string;
  name: string;
  hq: string;
  founded: number | null;
  employees: string;
  focus: string;
  tech_stack: string | string[];
  comp_range: string;
  culture: string;
  career_site: string;
  tier: string;
  category: string;
  subcategory: string | null;
}

const tierColors = {
  'Tier 1': 'bg-gradient-to-r from-yellow-500/20 to-orange-500/20 border-yellow-500/30',
  'Tier 2': 'bg-gradient-to-r from-blue-500/20 to-purple-500/20 border-blue-500/30',
  'Tier 3': 'bg-gradient-to-r from-green-500/20 to-teal-500/20 border-green-500/30',
  'Tier 4': 'bg-gradient-to-r from-pink-500/20 to-rose-500/20 border-pink-500/30',
  'Tier 5': 'bg-gradient-to-r from-gray-500/20 to-slate-500/20 border-gray-500/30',
};

const tierDescriptions = {
  'Tier 1': 'Quantitative Trading Giants - Elite firms using cutting-edge tech and math',
  'Tier 2': 'Prop Trading & Market Makers - High-frequency trading powerhouses',
  'Tier 3': 'Crypto/DeFi Trading - Digital asset innovation leaders',
  'Tier 4': 'Fintech Infrastructure & Platforms - Building the future of finance',
  'Tier 5': 'Market Data & Analytics - Intelligence and insights providers',
};

export function FinanceCompaniesView() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [expandedTiers, setExpandedTiers] = useState<Set<string>>(new Set(['Tier 1', 'Tier 2']));
  const [selectedCompany, setSelectedCompany] = useState<FinanceCompany | null>(null);

  // Import the finance companies data directly
  const companiesByTier = useMemo((): Record<string, FinanceCompany[]> => {
    // This would normally come from your seed data
    // For now, using empty object - you can import from seed-finance-companies.ts
    return {};
  }, []);

  const toggleTier = (tier: string) => {
    const newExpanded = new Set(expandedTiers);
    if (newExpanded.has(tier)) {
      newExpanded.delete(tier);
    } else {
      newExpanded.add(tier);
    }
    setExpandedTiers(newExpanded);
  };

  const filterCompanies = (companies: FinanceCompany[]) => {
    return companies.filter(company => {
      const matchesSearch = searchQuery === '' ||
        company.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        company.focus.toLowerCase().includes(searchQuery.toLowerCase()) ||
        company.category.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesCategory = selectedCategory === 'all' ||
        company.category === selectedCategory;

      return matchesSearch && matchesCategory;
    });
  };

  const getAllCategories = () => {
    const categories = new Set<string>();
    Object.values(companiesByTier).flat().forEach((company: any) => {
      categories.add(company.category);
    });
    return Array.from(categories).sort();
  };

  const formatTechStack = (techStack: string | string[]) => {
    if (typeof techStack === 'string') {
      try {
        return JSON.parse(techStack);
      } catch {
        return techStack.split(',').map(t => t.trim());
      }
    }
    return techStack;
  };


  const tiers = ['Tier 1', 'Tier 2', 'Tier 3', 'Tier 4', 'Tier 5'];

  return (
    <div className='flex h-full flex-col'>
      {/* Header */}
      <div className='border-border border-b px-6 py-4'>
        <div className='mx-auto max-w-7xl'>
          <h1 className='mb-2 bg-gradient-to-r from-yellow-500 to-orange-500 bg-clip-text font-bold text-3xl text-transparent'>
            Elite Finance Companies
          </h1>
          <p className='mb-4 text-muted-foreground'>
            100 top quantitative trading firms, prop shops, and fintech innovators
          </p>

          {/* Search and Filters */}
          <div className='flex flex-col gap-3 sm:flex-row'>
            <div className='relative max-w-md flex-1'>
              <Search className='-translate-y-1/2 absolute top-1/2 left-3 size-4 transform text-muted-foreground' />
              <input
                type="text"
                placeholder="Search companies, focus areas, or tech..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className='w-full rounded-lg border border-border bg-muted/50 py-2 pr-4 pl-10 focus:outline-none focus:ring-2 focus:ring-primary/20'
              />
            </div>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className='rounded-lg border border-border bg-muted/50 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary/20'
            >
              <option value="all">All Categories</option>
              {getAllCategories().map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Companies by Tier */}
      <div className="flex-1 overflow-y-auto px-6 py-6">
        <div className='mx-auto max-w-7xl space-y-6'>
          {tiers.map(tier => {
            const companies = companiesByTier[tier] || [];
            const filteredCompanies = filterCompanies(companies);
            const isExpanded = expandedTiers.has(tier);

            if (filteredCompanies.length === 0) return null;

            return (
              <div key={tier} className="space-y-4">
                {/* Tier Header */}
                <div
                  onClick={() => toggleTier(tier)}
                  className={`cursor-pointer rounded-lg border p-4 transition-all ${tierColors[tier as keyof typeof tierColors]}`}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="flex items-center gap-3">
                        <h2 className='font-semibold text-xl'>{tier}</h2>
                        <span className='rounded bg-background/50 px-2 py-1 text-sm'>
                          {filteredCompanies.length} companies
                        </span>
                      </div>
                      <p className='mt-1 text-muted-foreground text-sm'>
                        {tierDescriptions[tier as keyof typeof tierDescriptions]}
                      </p>
                    </div>
                    {isExpanded ? <ChevronUp className="size-5" /> : <ChevronDown className="size-5" />}
                  </div>
                </div>

                {/* Companies Grid */}
                {isExpanded && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className='grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3'
                  >
                    {filteredCompanies.map((company, index) => (
                      <motion.div
                        key={company.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.03 }}
                        onClick={() => setSelectedCompany(company)}
                        className='group cursor-pointer rounded-lg border border-border bg-card p-5 transition-all duration-200 hover:border-primary/30 hover:bg-accent/5'
                      >
                        {/* Company Header */}
                        <div className="mb-3">
                          <div className='mb-2 flex items-start justify-between'>
                            <h3 className='font-semibold text-lg transition-colors group-hover:text-primary'>
                              {company.name}
                            </h3>
                            {company.subcategory?.includes('HFT') && (
                              <Sparkles className="size-4 text-yellow-500" />
                            )}
                          </div>
                          <p className='text-muted-foreground text-sm'>{company.category}</p>
                        </div>

                        {/* Focus */}
                        <p className='mb-3 line-clamp-2 text-sm'>{company.focus}</p>

                        {/* Info Grid */}
                        <div className="space-y-2">
                          <div className='flex items-center gap-2 text-muted-foreground text-xs'>
                            <MapPin className="size-3" />
                            <span>{company.hq}</span>
                          </div>
                          <div className='flex items-center gap-2 text-muted-foreground text-xs'>
                            <Users className="size-3" />
                            <span>{company.employees}</span>
                          </div>
                          <div className='flex items-center gap-2 text-muted-foreground text-xs'>
                            <DollarSign className="size-3" />
                            <span className="line-clamp-1">{company.comp_range}</span>
                          </div>
                        </div>

                        {/* Tech Stack Preview */}
                        {company.tech_stack && (
                          <div className="mt-3 flex flex-wrap gap-1">
                            {formatTechStack(company.tech_stack).slice(0, 3).map((tech: string) => (
                              <span key={tech} className='rounded bg-muted px-2 py-0.5 text-xs'>
                                {tech}
                              </span>
                            ))}
                            {formatTechStack(company.tech_stack).length > 3 && (
                              <span className='rounded bg-muted/50 px-2 py-0.5 text-muted-foreground text-xs'>
                                +{formatTechStack(company.tech_stack).length - 3}
                              </span>
                            )}
                          </div>
                        )}
                      </motion.div>
                    ))}
                  </motion.div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Company Detail Modal */}
      {selectedCompany && (
        <div
          className='fixed inset-0 z-50 flex items-center justify-center bg-background/80 p-4 backdrop-blur-sm'
          onClick={() => setSelectedCompany(null)}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className='max-h-[80vh] w-full max-w-2xl overflow-y-auto rounded-lg border border-border bg-card p-6'
            onClick={(e) => e.stopPropagation()}
          >
            <div className="space-y-4">
              <div>
                <h2 className='mb-2 font-bold text-2xl'>{selectedCompany.name}</h2>
                <div className='flex items-center gap-3 text-muted-foreground text-sm'>
                  <span className={`rounded px-2 py-1 ${tierColors[selectedCompany.tier as keyof typeof tierColors]}`}>
                    {selectedCompany.tier}
                  </span>
                  <span>{selectedCompany.category}</span>
                  {selectedCompany.subcategory && (
                    <span>• {selectedCompany.subcategory}</span>
                  )}
                </div>
              </div>

              <div className="space-y-3">
                <div>
                  <h3 className='mb-1 font-semibold'>Focus</h3>
                  <p className="text-sm">{selectedCompany.focus}</p>
                </div>

                <div>
                  <h3 className='mb-1 font-semibold'>Culture</h3>
                  <p className="text-sm">{selectedCompany.culture}</p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h3 className='mb-1 font-semibold'>Location</h3>
                    <p className='flex items-center gap-1 text-sm'>
                      <MapPin className="size-3" />
                      {selectedCompany.hq}
                    </p>
                  </div>
                  <div>
                    <h3 className='mb-1 font-semibold'>Size</h3>
                    <p className='flex items-center gap-1 text-sm'>
                      <Users className="size-3" />
                      {selectedCompany.employees}
                    </p>
                  </div>
                  {selectedCompany.founded && (
                    <div>
                      <h3 className='mb-1 font-semibold'>Founded</h3>
                      <p className='flex items-center gap-1 text-sm'>
                        <Calendar className="size-3" />
                        {selectedCompany.founded}
                      </p>
                    </div>
                  )}
                  <div>
                    <h3 className='mb-1 font-semibold'>Compensation</h3>
                    <p className='flex items-center gap-1 text-sm'>
                      <DollarSign className="size-3" />
                      {selectedCompany.comp_range}
                    </p>
                  </div>
                </div>

                {selectedCompany.tech_stack && (
                  <div>
                    <h3 className='mb-2 font-semibold'>Tech Stack</h3>
                    <div className="flex flex-wrap gap-2">
                      {formatTechStack(selectedCompany.tech_stack).map((tech: string) => (
                        <span key={tech} className='flex items-center gap-1 rounded-md bg-muted px-3 py-1 text-sm'>
                          <Code className="size-3" />
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                <div className='border-border border-t pt-4'>
                  <a
                    href={`https://${selectedCompany.career_site}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className='inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-primary-foreground transition-colors hover:bg-primary/90'
                  >
                    <ExternalLink className="size-4" />
                    View Careers
                  </a>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}