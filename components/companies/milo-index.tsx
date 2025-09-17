'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Heart, Plus, TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { useDomain } from '@/components/domain-provider';
import { domainConfigs } from '@/lib/ai/domain-config';
import type { Session } from 'next-auth';

interface CompanyData {
  rank: number;
  previousRank?: number;
  name: string;
  ticker?: string;
  domain: string;
  description: string;
  valuation: string;
  fundingStage: string;
  trending?: 'up' | 'down' | 'stable';
  favorite?: boolean;
  logoUrl?: string;
  industry: string;
  jobsUrl?: string;
  growth?: string;
  employees?: string;
}

const indexDatabase: Record<string, CompanyData[]> = {
  ENGINEERS: [
    {
      rank: 1,
      previousRank: 2,
      name: 'xAI',
      ticker: 'xAI',
      domain: 'x.ai',
      description: 'Artificial intelligence research',
      valuation: '$80.0 B',
      fundingStage: 'Private',
      trending: 'up',
      industry: 'AI Research',
      jobsUrl: 'https://x.ai/careers',
      growth: '+142%',
      employees: '100-500',
    },
    {
      rank: 2,
      previousRank: 1,
      name: 'OpenAI',
      ticker: 'OAI',
      domain: 'openai.com',
      description: 'Safe artificial general intelligence',
      valuation: '$157.0 B',
      fundingStage: 'Private',
      trending: 'down',
      industry: 'AI Research',
      jobsUrl: 'https://openai.com/careers',
      growth: '+87%',
      employees: '500-1000',
    },
    {
      rank: 3,
      previousRank: 3,
      name: 'Anthropic',
      ticker: 'ANTH',
      domain: 'anthropic.com',
      description: 'AI safety and research',
      valuation: '$18.3 B',
      fundingStage: 'Private',
      trending: 'stable',
      industry: 'AI Systems',
      jobsUrl: 'https://anthropic.com/careers',
      growth: '+203%',
      employees: '200-500',
    },
    {
      rank: 4,
      previousRank: 5,
      name: 'SpaceX',
      ticker: 'SPX',
      domain: 'spacex.com',
      description: 'Space exploration technologies',
      valuation: '$210.0 B',
      fundingStage: 'Private',
      trending: 'up',
      industry: 'Aerospace',
      jobsUrl: 'https://spacex.com/careers',
      growth: '+52%',
      employees: '10000+',
    },
    {
      rank: 5,
      previousRank: 4,
      name: 'Databricks',
      ticker: 'DBX',
      domain: 'databricks.com',
      description: 'Unified data analytics platform',
      valuation: '$43.0 B',
      fundingStage: 'Private',
      trending: 'down',
      industry: 'Data & Analytics',
      jobsUrl: 'https://databricks.com/company/careers',
      growth: '+65%',
      employees: '5000+',
    },
    {
      rank: 6,
      previousRank: 8,
      name: 'Stripe',
      ticker: 'STRP',
      domain: 'stripe.com',
      description: 'Financial infrastructure for the internet',
      valuation: '$65.0 B',
      fundingStage: 'Private',
      trending: 'up',
      industry: 'Fintech',
      jobsUrl: 'https://stripe.com/jobs',
      growth: '+38%',
      employees: '5000+',
    },
    {
      rank: 7,
      previousRank: 6,
      name: 'Nvidia',
      ticker: 'NVDA',
      domain: 'nvidia.com',
      description: 'Accelerated computing and AI',
      valuation: '$3,420.0 B',
      fundingStage: 'Public',
      trending: 'down',
      industry: 'Semiconductors',
      jobsUrl: 'https://nvidia.com/careers',
      growth: '+126%',
      employees: '20000+',
    },
    {
      rank: 8,
      previousRank: 7,
      name: 'Tesla',
      ticker: 'TSLA',
      domain: 'tesla.com',
      description: 'Electric vehicles and energy',
      valuation: '$1,324.0 B',
      fundingStage: 'Public',
      trending: 'down',
      industry: 'Electric Vehicles',
      jobsUrl: 'https://tesla.com/careers',
      growth: '+48%',
      employees: '100000+',
    },
  ],
  SOFTWARE: [
    {
      rank: 1,
      previousRank: 2,
      name: 'Figma',
      ticker: 'FIG',
      domain: 'figma.com',
      description: 'Collaborative design platform',
      valuation: '$12.5 B',
      fundingStage: 'Private',
      trending: 'up',
      industry: 'Design Tools',
      jobsUrl: 'https://figma.com/careers',
      growth: '+72%',
      employees: '1000+',
    },
    {
      rank: 2,
      previousRank: 1,
      name: 'Canva',
      ticker: 'CANV',
      domain: 'canva.com',
      description: 'Visual communication platform',
      valuation: '$40.0 B',
      fundingStage: 'Private',
      trending: 'down',
      industry: 'Design Tools',
      jobsUrl: 'https://canva.com/careers',
      growth: '+58%',
      employees: '3000+',
    },
    {
      rank: 3,
      previousRank: 4,
      name: 'Notion',
      ticker: 'NTN',
      domain: 'notion.so',
      description: 'All-in-one workspace',
      valuation: '$10.0 B',
      fundingStage: 'Private',
      trending: 'up',
      industry: 'Productivity',
      jobsUrl: 'https://notion.so/careers',
      growth: '+95%',
      employees: '500+',
    },
    {
      rank: 4,
      previousRank: 3,
      name: 'Linear',
      ticker: 'LNR',
      domain: 'linear.app',
      description: 'Software project management',
      valuation: '$400 M',
      fundingStage: 'Series B',
      trending: 'down',
      industry: 'Developer Tools',
      jobsUrl: 'https://linear.app/careers',
      growth: '+142%',
      employees: '50-100',
    },
    {
      rank: 5,
      previousRank: 5,
      name: 'Vercel',
      ticker: 'VRCL',
      domain: 'vercel.com',
      description: 'Frontend cloud platform',
      valuation: '$2.5 B',
      fundingStage: 'Private',
      trending: 'stable',
      industry: 'Developer Tools',
      jobsUrl: 'https://vercel.com/careers',
      growth: '+83%',
      employees: '200-500',
    },
  ],
  FINANCE: [
    {
      rank: 1,
      previousRank: 1,
      name: 'Citadel',
      ticker: 'CTD',
      domain: 'citadel.com',
      description: 'Alternative investment management',
      valuation: '$62.0 B',
      fundingStage: 'Private',
      trending: 'stable',
      industry: 'Hedge Fund',
      jobsUrl: 'https://citadel.com/careers',
      growth: '+28%',
      employees: '3000+',
    },
    {
      rank: 2,
      previousRank: 3,
      name: 'Jane Street',
      ticker: 'JS',
      domain: 'janestreet.com',
      description: 'Quantitative trading firm',
      valuation: '$30.0 B',
      fundingStage: 'Private',
      trending: 'up',
      industry: 'Proprietary Trading',
      jobsUrl: 'https://janestreet.com/join',
      growth: '+45%',
      employees: '2000+',
    },
    {
      rank: 3,
      previousRank: 2,
      name: 'Two Sigma',
      ticker: 'TS',
      domain: 'twosigma.com',
      description: 'Data science investment management',
      valuation: '$12.0 B',
      fundingStage: 'Private',
      trending: 'down',
      industry: 'Quantitative Finance',
      jobsUrl: 'https://twosigma.com/careers',
      growth: '+22%',
      employees: '2000+',
    },
    {
      rank: 4,
      previousRank: 5,
      name: 'Stripe',
      ticker: 'STRP',
      domain: 'stripe.com',
      description: 'Payment processing platform',
      valuation: '$65.0 B',
      fundingStage: 'Private',
      trending: 'up',
      industry: 'Fintech',
      jobsUrl: 'https://stripe.com/jobs',
      growth: '+38%',
      employees: '5000+',
    },
    {
      rank: 5,
      previousRank: 4,
      name: 'Coinbase',
      ticker: 'COIN',
      domain: 'coinbase.com',
      description: 'Cryptocurrency exchange platform',
      valuation: '$142.7 B',
      fundingStage: 'Public',
      trending: 'down',
      industry: 'Crypto',
      jobsUrl: 'https://coinbase.com/careers',
      growth: '+185%',
      employees: '3000+',
    },
  ],
};

export function MiloIndex({ session }: { session: Session | null }) {
  const { selectedDomain } = useDomain();
  const [companies, setCompanies] = useState<CompanyData[]>([]);
  const [favorites, setFavorites] = useState<Set<string>>(new Set());
  const [activeTab, setActiveTab] = useState<'jobs' | 'companies'>('companies');

  useEffect(() => {
    const domainCompanies = indexDatabase[selectedDomain] || indexDatabase.ENGINEERS;
    setCompanies(domainCompanies);
  }, [selectedDomain]);

  const toggleFavorite = (companyName: string) => {
    setFavorites(prev => {
      const newFavorites = new Set(prev);
      if (newFavorites.has(companyName)) {
        newFavorites.delete(companyName);
      } else {
        newFavorites.add(companyName);
      }
      return newFavorites;
    });
  };

  const getLogoUrl = (domain: string) => {
    return `https://img.logo.dev/${domain}?token=pk_c2nKhfMyRIOeCjrk-6-RRw`;
  };

  const getTrendIcon = (trend?: string) => {
    if (trend === 'up') return <TrendingUp className="size-3.5 text-green-500" />;
    if (trend === 'down') return <TrendingDown className="size-3.5 text-red-500" />;
    return <Minus className="size-3.5 text-muted-foreground" />;
  };

  const domainName = domainConfigs[selectedDomain].name;
  const domainTag = selectedDomain === 'ENGINEERS' ? 'ENGINEERING' : selectedDomain;

  return (
    <div className="flex flex-col h-full bg-background">
      {/* Header */}
      <div className="border-b border-border">
        <div className="max-w-6xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              {/* Logo */}
              <div className="flex items-center">
                <div className="size-12 bg-gradient-to-br from-red-600 to-red-700 rounded flex items-center justify-center text-white font-mono text-xl font-bold shadow-lg">
                  人
                </div>
                <div className="ml-3">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono text-muted-foreground uppercase tracking-wider">milo</span>
                    <span className="text-xs font-mono text-primary uppercase tracking-wider">[{domainTag}]</span>
                  </div>
                  <div className="text-2xl font-bold tracking-tight">Index</div>
                </div>
              </div>

              {/* Subscribe button */}
              <button className="px-4 py-1.5 bg-foreground text-background rounded-md text-sm font-medium hover:bg-foreground/90 transition-colors flex items-center gap-1.5">
                <Plus className="size-3.5" />
                subscribe
              </button>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex gap-1 mt-6">
            <button
              onClick={() => setActiveTab('companies')}
              className={`px-6 py-2.5 rounded-lg font-medium transition-all ${
                activeTab === 'companies'
                  ? 'bg-muted text-foreground'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              Companies
              <span className="ml-2 text-sm opacity-60">{companies.length}</span>
            </button>
            <button
              onClick={() => setActiveTab('jobs')}
              className={`px-6 py-2.5 rounded-lg font-medium transition-all ${
                activeTab === 'jobs'
                  ? 'bg-muted text-foreground'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              Jobs
              <span className="ml-2 text-sm opacity-60">17,145</span>
            </button>
            <button
              disabled
              className="px-6 py-2.5 rounded-lg font-medium text-muted-foreground/50 cursor-not-allowed"
            >
              Hire Talent
            </button>
          </div>
        </div>
      </div>

      {/* Description */}
      <div className="max-w-6xl mx-auto px-6 py-4 text-sm text-muted-foreground">
        The {companies.length} fastest-growing {domainName.toLowerCase()} companies. Factors include fundraising history,
        hiring trends, growth rates, valuation trends, VC investors, industry factors, layoff data, user/customer ratings,
        Milo member interest, press mentions + more. Updated weekly.
      </div>

      {/* Table Container */}
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-6xl mx-auto px-6">
          <table className="w-full">
            {/* Table Header */}
            <thead className="sticky top-0 bg-background border-b border-border">
              <tr className="text-sm font-medium text-muted-foreground">
                <th className="text-left py-3 w-12"></th>
                <th className="text-left py-3 w-20 pl-4">Rank</th>
                <th className="text-left py-3 w-96 pl-4">Company</th>
                <th className="text-left py-3 w-48">Industry</th>
                <th className="text-right py-3 w-32">Valuation</th>
                <th className="text-right py-3 w-32 pr-4">Stage</th>
              </tr>
            </thead>

            {/* Companies List */}
            <tbody>
              {companies.map((company, index) => (
                <motion.tr
                  key={company.name}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: index * 0.02 }}
                  className="group hover:bg-muted/30 transition-colors border-b border-border/50 last:border-0"
                >
                  {/* Favorite */}
                  <td className="py-3 w-12">
                    <button
                      onClick={() => toggleFavorite(company.name)}
                      className="p-1 hover:bg-muted rounded transition-colors"
                    >
                      <Heart
                        className={`size-4 ${
                          favorites.has(company.name)
                            ? 'fill-red-500 text-red-500'
                            : 'text-muted-foreground'
                        }`}
                      />
                    </button>
                  </td>

                  {/* Rank */}
                  <td className="py-3 w-20 pl-4">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-sm text-muted-foreground">
                        {String(company.rank).padStart(2, '0')}
                      </span>
                      {getTrendIcon(company.trending)}
                    </div>
                  </td>

                  {/* Company */}
                  <td className="py-3 w-96 pl-4">
                    <div className="flex items-center gap-3">
                      <img
                        src={getLogoUrl(company.domain)}
                        alt={`${company.name} logo`}
                        className="size-8 rounded bg-white p-1"
                        onError={(e) => {
                          e.currentTarget.style.display = 'none';
                        }}
                      />
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <span className="font-medium">{company.name}</span>
                          {company.ticker && (
                            <span className="text-xs font-mono text-muted-foreground bg-muted px-1.5 py-0.5 rounded">
                              {company.ticker}
                            </span>
                          )}
                        </div>
                        <div className="text-xs text-muted-foreground">{company.description}</div>
                      </div>
                    </div>
                  </td>

                  {/* Industry */}
                  <td className="py-3 w-48 text-sm text-muted-foreground">
                    {company.industry}
                  </td>

                  {/* Valuation */}
                  <td className="py-3 w-32 text-right font-mono text-sm">
                    {company.valuation}
                  </td>

                  {/* Stage */}
                  <td className="py-3 w-32 text-right pr-4 text-sm text-muted-foreground">
                    {company.fundingStage}
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}