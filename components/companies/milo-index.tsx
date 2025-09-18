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
    {
      rank: 9,
      previousRank: 10,
      name: 'Palantir',
      ticker: 'PLTR',
      domain: 'palantir.com',
      description: 'Data analytics and software',
      valuation: '$75.0 B',
      fundingStage: 'Public',
      trending: 'up',
      industry: 'Data Analytics',
      jobsUrl: 'https://palantir.com/careers',
      growth: '+31%',
      employees: '3500+',
    },
    {
      rank: 10,
      previousRank: 9,
      name: 'Anduril',
      ticker: 'ANDL',
      domain: 'anduril.com',
      description: 'Defense technology',
      valuation: '$8.5 B',
      fundingStage: 'Private',
      trending: 'down',
      industry: 'Defense Tech',
      jobsUrl: 'https://anduril.com/careers',
      growth: '+112%',
      employees: '1500+',
    },
    {
      rank: 11,
      previousRank: 13,
      name: 'Hugging Face',
      ticker: 'HF',
      domain: 'huggingface.co',
      description: 'AI model repository',
      valuation: '$4.5 B',
      fundingStage: 'Private',
      trending: 'up',
      industry: 'AI Infrastructure',
      jobsUrl: 'https://huggingface.co/join',
      growth: '+234%',
      employees: '200+',
    },
    {
      rank: 12,
      previousRank: 11,
      name: 'Scale AI',
      ticker: 'SCAI',
      domain: 'scale.com',
      description: 'AI data platform',
      valuation: '$13.8 B',
      fundingStage: 'Private',
      trending: 'down',
      industry: 'AI Infrastructure',
      jobsUrl: 'https://scale.com/careers',
      growth: '+91%',
      employees: '600+',
    },
    {
      rank: 13,
      previousRank: 14,
      name: 'Cohere',
      ticker: 'COHR',
      domain: 'cohere.com',
      description: 'Enterprise AI language models',
      valuation: '$5.5 B',
      fundingStage: 'Private',
      trending: 'up',
      industry: 'AI/LLM',
      jobsUrl: 'https://cohere.com/careers',
      growth: '+156%',
      employees: '400+',
    },
    {
      rank: 14,
      previousRank: 12,
      name: 'Mistral AI',
      ticker: 'MSTL',
      domain: 'mistral.ai',
      description: 'Open-source LLMs',
      valuation: '$6.0 B',
      fundingStage: 'Private',
      trending: 'down',
      industry: 'AI/LLM',
      jobsUrl: 'https://mistral.ai/careers',
      growth: '+412%',
      employees: '50+',
    },
    {
      rank: 15,
      previousRank: 16,
      name: 'Perplexity',
      ticker: 'PPLX',
      domain: 'perplexity.ai',
      description: 'AI-powered search',
      valuation: '$9.0 B',
      fundingStage: 'Private',
      trending: 'up',
      industry: 'AI Search',
      jobsUrl: 'https://perplexity.ai/careers',
      growth: '+523%',
      employees: '100+',
    },
    {
      rank: 16,
      previousRank: 15,
      name: 'Waymo',
      ticker: 'WYMO',
      domain: 'waymo.com',
      description: 'Autonomous vehicles',
      valuation: '$45.0 B',
      fundingStage: 'Private',
      trending: 'down',
      industry: 'Self-Driving',
      jobsUrl: 'https://waymo.com/careers',
      growth: '+67%',
      employees: '2500+',
    },
    {
      rank: 17,
      previousRank: 18,
      name: 'Cruise',
      ticker: 'CRUZ',
      domain: 'getcruise.com',
      description: 'Autonomous ride-hailing',
      valuation: '$30.0 B',
      fundingStage: 'Private',
      trending: 'up',
      industry: 'Self-Driving',
      jobsUrl: 'https://getcruise.com/careers',
      growth: '+41%',
      employees: '3800+',
    },
    {
      rank: 18,
      previousRank: 17,
      name: 'Neuralink',
      ticker: 'NRLK',
      domain: 'neuralink.com',
      description: 'Brain-computer interfaces',
      valuation: '$8.0 B',
      fundingStage: 'Private',
      trending: 'down',
      industry: 'Neurotech',
      jobsUrl: 'https://neuralink.com/careers',
      growth: '+189%',
      employees: '400+',
    },
    {
      rank: 19,
      previousRank: 20,
      name: 'Instacart',
      ticker: 'CART',
      domain: 'instacart.com',
      description: 'Grocery delivery platform',
      valuation: '$10.2 B',
      fundingStage: 'Public',
      trending: 'up',
      industry: 'Logistics Tech',
      jobsUrl: 'https://instacart.com/careers',
      growth: '+23%',
      employees: '3000+',
    },
    {
      rank: 20,
      previousRank: 19,
      name: 'DoorDash',
      ticker: 'DASH',
      domain: 'doordash.com',
      description: 'Food delivery platform',
      valuation: '$71.0 B',
      fundingStage: 'Public',
      trending: 'down',
      industry: 'Logistics Tech',
      jobsUrl: 'https://doordash.com/careers',
      growth: '+31%',
      employees: '8000+',
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
    {
      rank: 6,
      previousRank: 7,
      name: 'GitHub',
      ticker: 'GHUB',
      domain: 'github.com',
      description: 'Code collaboration platform',
      valuation: '$7.5 B',
      fundingStage: 'Acquired',
      trending: 'up',
      industry: 'Developer Tools',
      jobsUrl: 'https://github.com/careers',
      growth: '+42%',
      employees: '2500+',
    },
    {
      rank: 7,
      previousRank: 6,
      name: 'GitLab',
      ticker: 'GTLB',
      domain: 'gitlab.com',
      description: 'DevOps platform',
      valuation: '$8.6 B',
      fundingStage: 'Public',
      trending: 'down',
      industry: 'Developer Tools',
      jobsUrl: 'https://gitlab.com/careers',
      growth: '+33%',
      employees: '2000+',
    },
    {
      rank: 8,
      previousRank: 9,
      name: 'Slack',
      ticker: 'SLCK',
      domain: 'slack.com',
      description: 'Business communication platform',
      valuation: '$27.7 B',
      fundingStage: 'Acquired',
      trending: 'up',
      industry: 'Communication',
      jobsUrl: 'https://slack.com/careers',
      growth: '+25%',
      employees: '2500+',
    },
    {
      rank: 9,
      previousRank: 8,
      name: 'Zoom',
      ticker: 'ZM',
      domain: 'zoom.us',
      description: 'Video communications',
      valuation: '$21.8 B',
      fundingStage: 'Public',
      trending: 'down',
      industry: 'Communication',
      jobsUrl: 'https://zoom.us/careers',
      growth: '+18%',
      employees: '7000+',
    },
    {
      rank: 10,
      previousRank: 11,
      name: 'Atlassian',
      ticker: 'TEAM',
      domain: 'atlassian.com',
      description: 'Collaboration software',
      valuation: '$43.2 B',
      fundingStage: 'Public',
      trending: 'up',
      industry: 'Productivity',
      jobsUrl: 'https://atlassian.com/company/careers',
      growth: '+29%',
      employees: '11000+',
    },
    {
      rank: 11,
      previousRank: 10,
      name: 'Monday.com',
      ticker: 'MNDY',
      domain: 'monday.com',
      description: 'Work management platform',
      valuation: '$8.9 B',
      fundingStage: 'Public',
      trending: 'down',
      industry: 'Productivity',
      jobsUrl: 'https://monday.com/careers',
      growth: '+41%',
      employees: '1800+',
    },
    {
      rank: 12,
      previousRank: 13,
      name: 'Asana',
      ticker: 'ASAN',
      domain: 'asana.com',
      description: 'Work management software',
      valuation: '$4.2 B',
      fundingStage: 'Public',
      trending: 'up',
      industry: 'Productivity',
      jobsUrl: 'https://asana.com/careers',
      growth: '+22%',
      employees: '1600+',
    },
    {
      rank: 13,
      previousRank: 12,
      name: 'Airtable',
      ticker: 'ARTBL',
      domain: 'airtable.com',
      description: 'Low-code platform',
      valuation: '$11.7 B',
      fundingStage: 'Private',
      trending: 'down',
      industry: 'Low-Code',
      jobsUrl: 'https://airtable.com/careers',
      growth: '+38%',
      employees: '900+',
    },
    {
      rank: 14,
      previousRank: 15,
      name: 'Retool',
      ticker: 'RETL',
      domain: 'retool.com',
      description: 'Internal tools platform',
      valuation: '$3.2 B',
      fundingStage: 'Private',
      trending: 'up',
      industry: 'Low-Code',
      jobsUrl: 'https://retool.com/careers',
      growth: '+67%',
      employees: '400+',
    },
    {
      rank: 15,
      previousRank: 14,
      name: 'Webflow',
      ticker: 'WFLW',
      domain: 'webflow.com',
      description: 'No-code web design',
      valuation: '$4.0 B',
      fundingStage: 'Private',
      trending: 'down',
      industry: 'No-Code',
      jobsUrl: 'https://webflow.com/careers',
      growth: '+51%',
      employees: '700+',
    },
    {
      rank: 16,
      previousRank: 17,
      name: 'Bubble',
      ticker: 'BUBL',
      domain: 'bubble.io',
      description: 'No-code app platform',
      valuation: '$100 M',
      fundingStage: 'Series A',
      trending: 'up',
      industry: 'No-Code',
      jobsUrl: 'https://bubble.io/careers',
      growth: '+84%',
      employees: '200+',
    },
    {
      rank: 17,
      previousRank: 16,
      name: 'Zapier',
      ticker: 'ZAP',
      domain: 'zapier.com',
      description: 'Workflow automation',
      valuation: '$5.0 B',
      fundingStage: 'Private',
      trending: 'down',
      industry: 'Automation',
      jobsUrl: 'https://zapier.com/careers',
      growth: '+28%',
      employees: '800+',
    },
    {
      rank: 18,
      previousRank: 19,
      name: 'Make',
      ticker: 'MAKE',
      domain: 'make.com',
      description: 'Visual automation',
      valuation: '$1.7 B',
      fundingStage: 'Private',
      trending: 'up',
      industry: 'Automation',
      jobsUrl: 'https://make.com/careers',
      growth: '+95%',
      employees: '400+',
    },
    {
      rank: 19,
      previousRank: 18,
      name: 'Postman',
      ticker: 'PMAN',
      domain: 'postman.com',
      description: 'API development platform',
      valuation: '$5.6 B',
      fundingStage: 'Private',
      trending: 'down',
      industry: 'Developer Tools',
      jobsUrl: 'https://postman.com/careers',
      growth: '+44%',
      employees: '600+',
    },
    {
      rank: 20,
      previousRank: 20,
      name: 'Miro',
      ticker: 'MIRO',
      domain: 'miro.com',
      description: 'Visual collaboration',
      valuation: '$17.5 B',
      fundingStage: 'Private',
      trending: 'stable',
      industry: 'Collaboration',
      jobsUrl: 'https://miro.com/careers',
      growth: '+36%',
      employees: '1800+',
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
    {
      rank: 6,
      previousRank: 7,
      name: 'Blackstone',
      ticker: 'BX',
      domain: 'blackstone.com',
      description: 'Private equity giant',
      valuation: '$157.8 B',
      fundingStage: 'Public',
      trending: 'up',
      industry: 'Private Equity',
      jobsUrl: 'https://blackstone.com/careers',
      growth: '+19%',
      employees: '4500+',
    },
    {
      rank: 7,
      previousRank: 6,
      name: 'KKR',
      ticker: 'KKR',
      domain: 'kkr.com',
      description: 'Global investment firm',
      valuation: '$83.5 B',
      fundingStage: 'Public',
      trending: 'down',
      industry: 'Private Equity',
      jobsUrl: 'https://kkr.com/careers',
      growth: '+24%',
      employees: '2100+',
    },
    {
      rank: 8,
      previousRank: 9,
      name: 'Apollo',
      ticker: 'APO',
      domain: 'apollo.com',
      description: 'Alternative investment manager',
      valuation: '$67.3 B',
      fundingStage: 'Public',
      trending: 'up',
      industry: 'Private Equity',
      jobsUrl: 'https://apollo.com/careers',
      growth: '+31%',
      employees: '2200+',
    },
    {
      rank: 9,
      previousRank: 8,
      name: 'Millennium',
      ticker: 'MILL',
      domain: 'mlp.com',
      description: 'Multi-strategy hedge fund',
      valuation: '$60.0 B',
      fundingStage: 'Private',
      trending: 'down',
      industry: 'Hedge Fund',
      jobsUrl: 'https://mlp.com/careers',
      growth: '+27%',
      employees: '5000+',
    },
    {
      rank: 10,
      previousRank: 11,
      name: 'Renaissance',
      ticker: 'RENT',
      domain: 'rentec.com',
      description: 'Quantitative hedge fund',
      valuation: '$165.0 B',
      fundingStage: 'Private',
      trending: 'up',
      industry: 'Quantitative Finance',
      jobsUrl: 'https://rentec.com/careers',
      growth: '+18%',
      employees: '310+',
    },
    {
      rank: 11,
      previousRank: 10,
      name: 'Bridgewater',
      ticker: 'BWA',
      domain: 'bridgewater.com',
      description: 'Macro hedge fund',
      valuation: '$150.0 B',
      fundingStage: 'Private',
      trending: 'down',
      industry: 'Hedge Fund',
      jobsUrl: 'https://bridgewater.com/careers',
      growth: '+12%',
      employees: '1500+',
    },
    {
      rank: 12,
      previousRank: 13,
      name: 'Point72',
      ticker: 'P72',
      domain: 'point72.com',
      description: 'Multi-strategy hedge fund',
      valuation: '$35.0 B',
      fundingStage: 'Private',
      trending: 'up',
      industry: 'Hedge Fund',
      jobsUrl: 'https://point72.com/careers',
      growth: '+29%',
      employees: '3200+',
    },
    {
      rank: 13,
      previousRank: 12,
      name: 'DE Shaw',
      ticker: 'DESCO',
      domain: 'deshaw.com',
      description: 'Quantitative investment firm',
      valuation: '$60.0 B',
      fundingStage: 'Private',
      trending: 'down',
      industry: 'Quantitative Finance',
      jobsUrl: 'https://deshaw.com/careers',
      growth: '+21%',
      employees: '2000+',
    },
    {
      rank: 14,
      previousRank: 15,
      name: 'Jump Trading',
      ticker: 'JUMP',
      domain: 'jumptrading.com',
      description: 'Proprietary trading firm',
      valuation: '$20.0 B',
      fundingStage: 'Private',
      trending: 'up',
      industry: 'Proprietary Trading',
      jobsUrl: 'https://jumptrading.com/careers',
      growth: '+34%',
      employees: '1100+',
    },
    {
      rank: 15,
      previousRank: 14,
      name: 'Virtu Financial',
      ticker: 'VIRT',
      domain: 'virtu.com',
      description: 'Electronic market maker',
      valuation: '$4.8 B',
      fundingStage: 'Public',
      trending: 'down',
      industry: 'Market Making',
      jobsUrl: 'https://virtu.com/careers',
      growth: '+26%',
      employees: '800+',
    },
    {
      rank: 16,
      previousRank: 17,
      name: 'Robinhood',
      ticker: 'HOOD',
      domain: 'robinhood.com',
      description: 'Commission-free trading',
      valuation: '$18.9 B',
      fundingStage: 'Public',
      trending: 'up',
      industry: 'Retail Trading',
      jobsUrl: 'https://robinhood.com/careers',
      growth: '+41%',
      employees: '3400+',
    },
    {
      rank: 17,
      previousRank: 16,
      name: 'Plaid',
      ticker: 'PLAID',
      domain: 'plaid.com',
      description: 'Financial data connectivity',
      valuation: '$13.4 B',
      fundingStage: 'Private',
      trending: 'down',
      industry: 'Fintech Infrastructure',
      jobsUrl: 'https://plaid.com/careers',
      growth: '+35%',
      employees: '800+',
    },
    {
      rank: 18,
      previousRank: 19,
      name: 'Chime',
      ticker: 'CHME',
      domain: 'chime.com',
      description: 'Digital banking',
      valuation: '$25.0 B',
      fundingStage: 'Private',
      trending: 'up',
      industry: 'Digital Banking',
      jobsUrl: 'https://chime.com/careers',
      growth: '+52%',
      employees: '1200+',
    },
    {
      rank: 19,
      previousRank: 18,
      name: 'Affirm',
      ticker: 'AFRM',
      domain: 'affirm.com',
      description: 'Buy now pay later',
      valuation: '$8.7 B',
      fundingStage: 'Public',
      trending: 'down',
      industry: 'Consumer Finance',
      jobsUrl: 'https://affirm.com/careers',
      growth: '+48%',
      employees: '2500+',
    },
    {
      rank: 20,
      previousRank: 20,
      name: 'Block',
      ticker: 'SQ',
      domain: 'block.xyz',
      description: 'Payment solutions',
      valuation: '$81.3 B',
      fundingStage: 'Public',
      trending: 'stable',
      industry: 'Payments',
      jobsUrl: 'https://block.xyz/careers',
      growth: '+29%',
      employees: '8000+',
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
    <div className='flex h-full flex-col bg-background'>
      {/* Header */}
      <div className='border-border border-b'>
        <div className='mx-auto max-w-6xl px-6 py-6'>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              {/* Logo */}
              <div className="flex items-center">
                <div className={`flex size-12 items-center justify-center rounded bg-gradient-to-br ${domainConfigs[selectedDomain].theme.logoColor} font-bold font-mono text-white text-xl shadow-lg`}>
                  人
                </div>
                <div className="ml-3">
                  <div className="flex items-center gap-2">
                    <span className='font-mono text-muted-foreground text-xs uppercase tracking-wider'>milo</span>
                    <span className='font-mono text-primary text-xs uppercase tracking-wider'>[{domainTag}]</span>
                  </div>
                  <div className='font-bold text-2xl tracking-tight'>Index</div>
                </div>
              </div>

              {/* Subscribe button */}
              <button className='flex items-center gap-1.5 rounded-md bg-foreground px-4 py-1.5 font-medium text-background text-sm transition-colors hover:bg-foreground/90'>
                <Plus className="size-3.5" />
                subscribe
              </button>
            </div>
          </div>

          {/* Tabs */}
          <div className='mt-6 flex gap-1'>
            <button
              onClick={() => setActiveTab('companies')}
              className={`rounded-lg px-6 py-2.5 font-medium transition-all ${
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
              className={`rounded-lg px-6 py-2.5 font-medium transition-all ${
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
              className='cursor-not-allowed rounded-lg px-6 py-2.5 font-medium text-muted-foreground/50'
            >
              Hire Talent
            </button>
          </div>
        </div>
      </div>

      {/* Description */}
      <div className='mx-auto max-w-6xl px-6 py-4 text-muted-foreground text-sm'>
        The {companies.length} fastest-growing {domainName.toLowerCase()} companies. Factors include fundraising history,
        hiring trends, growth rates, valuation trends, VC investors, industry factors, layoff data, user/customer ratings,
        Milo member interest, press mentions + more. Updated weekly.
      </div>

      {/* Table Container */}
      <div className="flex-1 overflow-y-auto">
        <div className='mx-auto max-w-6xl px-6'>
          <table className="w-full">
            {/* Table Header */}
            <thead className='sticky top-0 border-border border-b bg-background'>
              <tr className='font-medium text-muted-foreground text-sm'>
                <th className='w-12 py-3 text-left' />
                <th className='w-20 py-3 pl-4 text-left'>Rank</th>
                <th className='w-96 py-3 pl-4 text-left'>Company</th>
                <th className='w-48 py-3 text-left'>Industry</th>
                <th className='w-32 py-3 text-right'>Valuation</th>
                <th className='w-32 py-3 pr-4 text-right'>Stage</th>
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
                  className='group border-border/50 border-b transition-colors last:border-0 hover:bg-muted/30'
                >
                  {/* Favorite */}
                  <td className='w-12 py-3'>
                    <button
                      onClick={() => toggleFavorite(company.name)}
                      className='rounded p-1 transition-colors hover:bg-muted'
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
                  <td className='w-20 py-3 pl-4'>
                    <div className="flex items-center gap-2">
                      <span className='font-mono text-muted-foreground text-sm'>
                        {String(company.rank).padStart(2, '0')}
                      </span>
                      {getTrendIcon(company.trending)}
                    </div>
                  </td>

                  {/* Company */}
                  <td className='w-96 py-3 pl-4'>
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
                            <span className='rounded bg-muted px-1.5 py-0.5 font-mono text-muted-foreground text-xs'>
                              {company.ticker}
                            </span>
                          )}
                        </div>
                        <div className='text-muted-foreground text-xs'>{company.description}</div>
                      </div>
                    </div>
                  </td>

                  {/* Industry */}
                  <td className='w-48 py-3 text-muted-foreground text-sm'>
                    {company.industry}
                  </td>

                  {/* Valuation */}
                  <td className='w-32 py-3 text-right font-mono text-sm'>
                    {company.valuation}
                  </td>

                  {/* Stage */}
                  <td className='w-32 py-3 pr-4 text-right text-muted-foreground text-sm'>
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