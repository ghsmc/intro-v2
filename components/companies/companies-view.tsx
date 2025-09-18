'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Building2, Users, MapPin, Briefcase, TrendingUp } from 'lucide-react';
import { useDomain } from '@/components/domain-provider';
import { domainConfigs } from '@/lib/ai/domain-config';
import type { Session } from 'next-auth';

interface CompanyData {
  name: string;
  domain: string;
  description: string;
  location: string;
  employees: string;
  industry: string;
  logoUrl?: string;
  websiteUrl: string;
  jobsUrl?: string;
  trending?: boolean;
}

const companyDatabase: Record<string, CompanyData[]> = {
  ENGINEERS: [
    {
      name: 'OpenAI',
      domain: 'openai.com',
      description: 'Creating safe AGI that benefits all of humanity',
      location: 'San Francisco, CA',
      employees: '500-1000',
      industry: 'Artificial Intelligence',
      websiteUrl: 'https://openai.com',
      jobsUrl: 'https://openai.com/careers',
      trending: true,
    },
    {
      name: 'Anthropic',
      domain: 'anthropic.com',
      description: 'AI safety company building reliable, interpretable, and steerable AI systems',
      location: 'San Francisco, CA',
      employees: '200-500',
      industry: 'Artificial Intelligence',
      websiteUrl: 'https://anthropic.com',
      jobsUrl: 'https://anthropic.com/careers',
      trending: true,
    },
    {
      name: 'Google DeepMind',
      domain: 'deepmind.google',
      description: 'World leader in artificial intelligence research and its application',
      location: 'Mountain View, CA',
      employees: '1000+',
      industry: 'Artificial Intelligence',
      websiteUrl: 'https://deepmind.google',
      jobsUrl: 'https://deepmind.google/careers',
    },
    {
      name: 'Meta',
      domain: 'meta.com',
      description: 'Building the metaverse and connecting people worldwide',
      location: 'Menlo Park, CA',
      employees: '50000+',
      industry: 'Social Technology',
      websiteUrl: 'https://meta.com',
      jobsUrl: 'https://www.metacareers.com',
    },
    {
      name: 'Apple',
      domain: 'apple.com',
      description: 'Creating the best products on earth to enrich people\'s lives',
      location: 'Cupertino, CA',
      employees: '100000+',
      industry: 'Consumer Electronics',
      websiteUrl: 'https://apple.com',
      jobsUrl: 'https://jobs.apple.com',
    },
    {
      name: 'Tesla',
      domain: 'tesla.com',
      description: 'Accelerating the world\'s transition to sustainable energy',
      location: 'Palo Alto, CA',
      employees: '100000+',
      industry: 'Electric Vehicles',
      websiteUrl: 'https://tesla.com',
      jobsUrl: 'https://www.tesla.com/careers',
      trending: true,
    },
    {
      name: 'SpaceX',
      domain: 'spacex.com',
      description: 'Making humanity multiplanetary',
      location: 'Hawthorne, CA',
      employees: '10000+',
      industry: 'Aerospace',
      websiteUrl: 'https://spacex.com',
      jobsUrl: 'https://www.spacex.com/careers',
    },
    {
      name: 'Stripe',
      domain: 'stripe.com',
      description: 'Financial infrastructure for the internet',
      location: 'San Francisco, CA',
      employees: '5000+',
      industry: 'Fintech',
      websiteUrl: 'https://stripe.com',
      jobsUrl: 'https://stripe.com/jobs',
    },
    {
      name: 'Databricks',
      domain: 'databricks.com',
      description: 'Unified analytics platform for big data and AI',
      location: 'San Francisco, CA',
      employees: '5000+',
      industry: 'Data & Analytics',
      websiteUrl: 'https://databricks.com',
      jobsUrl: 'https://databricks.com/company/careers',
    },
    {
      name: 'Nvidia',
      domain: 'nvidia.com',
      description: 'Pioneering accelerated computing and AI',
      location: 'Santa Clara, CA',
      employees: '20000+',
      industry: 'Semiconductors',
      websiteUrl: 'https://nvidia.com',
      jobsUrl: 'https://nvidia.com/careers',
      trending: true,
    },
  ],
  SOFTWARE: [
    {
      name: 'Figma',
      domain: 'figma.com',
      description: 'Collaborative interface design tool',
      location: 'San Francisco, CA',
      employees: '1000+',
      industry: 'Design Software',
      websiteUrl: 'https://figma.com',
      jobsUrl: 'https://figma.com/careers',
      trending: true,
    },
    {
      name: 'Notion',
      domain: 'notion.so',
      description: 'All-in-one workspace for notes, docs, and collaboration',
      location: 'San Francisco, CA',
      employees: '500+',
      industry: 'Productivity Software',
      websiteUrl: 'https://notion.so',
      jobsUrl: 'https://notion.so/careers',
    },
    {
      name: 'Linear',
      domain: 'linear.app',
      description: 'Streamlined software project management',
      location: 'San Francisco, CA',
      employees: '50-100',
      industry: 'Developer Tools',
      websiteUrl: 'https://linear.app',
      jobsUrl: 'https://linear.app/careers',
    },
    {
      name: 'Vercel',
      domain: 'vercel.com',
      description: 'Frontend cloud platform',
      location: 'San Francisco, CA',
      employees: '200-500',
      industry: 'Developer Tools',
      websiteUrl: 'https://vercel.com',
      jobsUrl: 'https://vercel.com/careers',
    },
    {
      name: 'Canva',
      domain: 'canva.com',
      description: 'Empowering the world to design',
      location: 'Sydney, Australia',
      employees: '3000+',
      industry: 'Design Software',
      websiteUrl: 'https://canva.com',
      jobsUrl: 'https://canva.com/careers',
    },
    {
      name: 'Adobe',
      domain: 'adobe.com',
      description: 'Changing the world through digital experiences',
      location: 'San Jose, CA',
      employees: '25000+',
      industry: 'Creative Software',
      websiteUrl: 'https://adobe.com',
      jobsUrl: 'https://adobe.com/careers',
    },
    {
      name: 'Salesforce',
      domain: 'salesforce.com',
      description: 'World\'s #1 CRM platform',
      location: 'San Francisco, CA',
      employees: '70000+',
      industry: 'Enterprise Software',
      websiteUrl: 'https://salesforce.com',
      jobsUrl: 'https://salesforce.com/careers',
    },
    {
      name: 'Atlassian',
      domain: 'atlassian.com',
      description: 'Tools for teams to collaborate and build',
      location: 'Sydney, Australia',
      employees: '10000+',
      industry: 'Collaboration Software',
      websiteUrl: 'https://atlassian.com',
      jobsUrl: 'https://atlassian.com/company/careers',
    },
  ],
  FINANCE: [
    {
      name: 'Goldman Sachs',
      domain: 'goldmansachs.com',
      description: 'Leading global investment banking and financial services',
      location: 'New York, NY',
      employees: '40000+',
      industry: 'Investment Banking',
      websiteUrl: 'https://goldmansachs.com',
      jobsUrl: 'https://goldmansachs.com/careers',
    },
    {
      name: 'Morgan Stanley',
      domain: 'morganstanley.com',
      description: 'Global financial services firm',
      location: 'New York, NY',
      employees: '60000+',
      industry: 'Investment Banking',
      websiteUrl: 'https://morganstanley.com',
      jobsUrl: 'https://morganstanley.com/careers',
    },
    {
      name: 'Citadel',
      domain: 'citadel.com',
      description: 'Leading alternative investment manager',
      location: 'Chicago, IL',
      employees: '3000+',
      industry: 'Hedge Fund',
      websiteUrl: 'https://citadel.com',
      jobsUrl: 'https://citadel.com/careers',
      trending: true,
    },
    {
      name: 'Jane Street',
      domain: 'janestreet.com',
      description: 'Quantitative trading firm using sophisticated technology',
      location: 'New York, NY',
      employees: '2000+',
      industry: 'Proprietary Trading',
      websiteUrl: 'https://janestreet.com',
      jobsUrl: 'https://janestreet.com/join',
      trending: true,
    },
    {
      name: 'Two Sigma',
      domain: 'twosigma.com',
      description: 'Using data science and technology to transform finance',
      location: 'New York, NY',
      employees: '2000+',
      industry: 'Quantitative Finance',
      websiteUrl: 'https://twosigma.com',
      jobsUrl: 'https://twosigma.com/careers',
    },
    {
      name: 'Stripe',
      domain: 'stripe.com',
      description: 'Financial infrastructure for the internet',
      location: 'San Francisco, CA',
      employees: '5000+',
      industry: 'Fintech',
      websiteUrl: 'https://stripe.com',
      jobsUrl: 'https://stripe.com/jobs',
      trending: true,
    },
    {
      name: 'Coinbase',
      domain: 'coinbase.com',
      description: 'Building the cryptoeconomy',
      location: 'San Francisco, CA',
      employees: '3000+',
      industry: 'Cryptocurrency',
      websiteUrl: 'https://coinbase.com',
      jobsUrl: 'https://coinbase.com/careers',
    },
    {
      name: 'Robinhood',
      domain: 'robinhood.com',
      description: 'Democratizing finance for all',
      location: 'Menlo Park, CA',
      employees: '3000+',
      industry: 'Fintech',
      websiteUrl: 'https://robinhood.com',
      jobsUrl: 'https://robinhood.com/careers',
    },
  ],
};

export function CompaniesView({ session }: { session: Session | null }) {
  const { selectedDomain } = useDomain();
  const [companies, setCompanies] = useState<CompanyData[]>([]);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const domainCompanies = companyDatabase[selectedDomain] || companyDatabase.ENGINEERS;
    setCompanies(domainCompanies);
  }, [selectedDomain]);

  const filteredCompanies = companies.filter(company =>
    company.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    company.industry.toLowerCase().includes(searchQuery.toLowerCase()) ||
    company.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getLogoUrl = (domain: string) => {
    return `https://img.logo.dev/${domain}?token=pk_c2nKhfMyRIOeCjrk-6-RRw`;
  };

  return (
    <div className='flex h-full flex-col'>
      {/* Header */}
      <div className='border-border border-b px-6 py-4'>
        <div className='mx-auto max-w-6xl'>
          <h1 className='mb-2 font-semibold text-2xl'>Companies</h1>
          <p className="text-muted-foreground">
            Top companies hiring in {domainConfigs[selectedDomain].name.toLowerCase()}
          </p>

          {/* Search */}
          <div className="mt-4">
            <input
              type="text"
              placeholder="Search companies..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className='w-full max-w-md rounded-lg border border-border bg-muted/50 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary/20'
            />
          </div>
        </div>
      </div>

      {/* Companies Grid */}
      <div className="flex-1 overflow-y-auto px-6 py-6">
        <div className='mx-auto max-w-6xl'>
          <div className='grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3'>
            {filteredCompanies.map((company, index) => (
              <motion.div
                key={company.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className='group relative rounded-lg border border-border bg-card p-5 transition-all duration-200 hover:border-primary/20 hover:bg-accent/5'
              >
                {company.trending && (
                  <div className="absolute top-3 right-3">
                    <span className='flex items-center gap-1 rounded bg-primary/10 px-2 py-1 font-medium text-primary text-xs'>
                      <TrendingUp className="size-3" />
                      Trending
                    </span>
                  </div>
                )}

                {/* Company Logo & Name */}
                <div className='mb-3 flex items-start gap-3'>
                  <img
                    src={getLogoUrl(company.domain)}
                    alt={`${company.name} logo`}
                    className="size-12 rounded-lg bg-white p-1.5"
                    onError={(e) => {
                      e.currentTarget.style.display = 'none';
                    }}
                  />
                  <div className="flex-1">
                    <h3 className='font-semibold text-foreground transition-colors group-hover:text-primary'>
                      {company.name}
                    </h3>
                    <p className='text-muted-foreground text-sm'>{company.industry}</p>
                  </div>
                </div>

                {/* Description */}
                <p className='mb-4 line-clamp-2 text-muted-foreground text-sm'>
                  {company.description}
                </p>

                {/* Company Info */}
                <div className='mb-4 space-y-2'>
                  <div className='flex items-center gap-2 text-muted-foreground text-sm'>
                    <MapPin className="size-3.5" />
                    <span>{company.location}</span>
                  </div>
                  <div className='flex items-center gap-2 text-muted-foreground text-sm'>
                    <Users className="size-3.5" />
                    <span>{company.employees} employees</span>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2">
                  <a
                    href={company.websiteUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className='flex items-center gap-1.5 rounded-md bg-muted px-3 py-1.5 text-sm transition-colors hover:bg-muted/80'
                  >
                    <Building2 className="size-3.5" />
                    Website
                  </a>
                  {company.jobsUrl && (
                    <a
                      href={company.jobsUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className='flex items-center gap-1.5 rounded-md bg-primary/10 px-3 py-1.5 text-primary text-sm transition-colors hover:bg-primary/20'
                    >
                      <Briefcase className="size-3.5" />
                      View Jobs
                    </a>
                  )}
                </div>
              </motion.div>
            ))}
          </div>

          {filteredCompanies.length === 0 && (
            <div className='py-12 text-center'>
              <p className="text-muted-foreground">No companies found matching your search.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}