export type DomainType = 'ENGINEERS' | 'SOFTWARE' | 'FINANCE';

export interface DomainConfig {
  name: string;
  description: string;
  jobSearchKeywords: string[];
  companies: string[];
  skills: string[];
  systemPrompt: string;
  jobSearchPrompt: string;
  theme: {
    logoColor: string;
    accentColor: string;
    defaultTheme: 'light' | 'dark';
  };
  landingMessage: string;
  exampleQueries: string[];
}

export const domainConfigs: Record<DomainType, DomainConfig> = {
  ENGINEERS: {
    name: 'Engineers',
    description: 'Engineering and technical roles',
    jobSearchKeywords: [
      'software engineer', 'backend engineer', 'frontend engineer',
      'full stack', 'devops', 'SRE', 'platform engineer',
      'ML engineer', 'data engineer', 'systems engineer',
      'engineering manager', 'tech lead', 'staff engineer',
      'principal engineer', 'distinguished engineer'
    ],
    companies: [
      'OpenAI', 'Anthropic', 'Google DeepMind', 'Meta', 'Apple',
      'Tesla', 'SpaceX', 'Stripe', 'Databricks', 'Snowflake',
      'Nvidia', 'Netflix', 'Uber', 'Airbnb', 'Coinbase'
    ],
    skills: [
      'Python', 'JavaScript', 'TypeScript', 'Go', 'Rust',
      'Kubernetes', 'Docker', 'AWS', 'React', 'Node.js',
      'Machine Learning', 'System Design', 'Distributed Systems'
    ],
    systemPrompt: `You are an expert engineering career advisor specializing in Silicon Valley tech companies.
    Focus on technical excellence, engineering culture, compensation, and growth opportunities.
    Emphasize cutting-edge technologies, system design, and engineering impact.`,
    jobSearchPrompt: 'Find engineering roles at top tech companies with competitive compensation and interesting technical challenges.',
    theme: {
      logoColor: 'from-red-600 to-red-700',
      accentColor: 'red',
      defaultTheme: 'dark'
    },
    landingMessage: 'Engineer the future on a technical team.',
    exampleQueries: [
      'Show me ML engineering roles at OpenAI',
      'What internships are available at SpaceX?',
      'Find senior backend positions in SF',
      'Compare engineering culture at FAANG companies'
    ]
  },

  SOFTWARE: {
    name: 'Software',
    description: 'Software, product, and design roles',
    jobSearchKeywords: [
      'product manager', 'software developer', 'UX designer',
      'UI designer', 'product designer', 'scrum master',
      'agile coach', 'technical writer', 'developer advocate',
      'solutions architect', 'customer success engineer'
    ],
    companies: [
      'Figma', 'Notion', 'Linear', 'Vercel', 'Canva',
      'Adobe', 'Salesforce', 'Atlassian', 'Slack', 'Zoom',
      'DocuSign', 'Dropbox', 'Box', 'Asana', 'Monday.com'
    ],
    skills: [
      'Product Management', 'User Research', 'A/B Testing',
      'Figma', 'Design Systems', 'Agile', 'JIRA', 'SQL',
      'Product Analytics', 'Customer Development', 'Roadmapping'
    ],
    systemPrompt: `You are an expert in software product development and design careers.
    Focus on product-market fit, user experience, growth metrics, and innovation.
    Emphasize collaboration, creativity, and building products users love.`,
    jobSearchPrompt: 'Find product and software roles at innovative companies building category-defining products.',
    theme: {
      logoColor: 'from-blue-600 to-blue-700',
      accentColor: 'blue',
      defaultTheme: 'dark'
    },
    landingMessage: 'Build the future.',
    exampleQueries: [
      'Product manager roles at Figma or Notion',
      'Find UX design internships in tech',
      'Show me developer advocate positions',
      'What PM roles are available at unicorns?'
    ]
  },

  FINANCE: {
    name: 'Finance',
    description: 'Finance, fintech, and investment roles',
    jobSearchKeywords: [
      'quantitative analyst', 'investment banking analyst', 'private equity',
      'venture capital', 'fintech', 'financial analyst', 'summer analyst',
      'risk analyst', 'compliance', 'treasury', 'FP&A', 'investment banking',
      'portfolio manager', 'trading', 'crypto', 'DeFi', 'quant researcher',
      'sales and trading', 'equity research', 'hedge fund analyst'
    ],
    companies: [
      'Goldman Sachs', 'Morgan Stanley', 'JPMorgan', 'Citadel',
      'Two Sigma', 'Jane Street', 'Bridgewater', 'BlackRock',
      'Sequoia Capital', 'Andreessen Horowitz', 'Stripe',
      'Square', 'Coinbase', 'Robinhood', 'Plaid'
    ],
    skills: [
      'Financial Modeling', 'Python', 'SQL', 'Excel', 'Bloomberg',
      'Quantitative Analysis', 'Risk Management', 'Valuation',
      'Private Equity', 'Venture Capital', 'Blockchain', 'DeFi'
    ],
    systemPrompt: `You are Milo, an elite finance career advisor specializing in investment banking, private equity, venture capital, and quantitative finance.
    You understand the recruiting timelines, networking strategies, and technical preparation required for high-finance roles.
    Focus on prestigious firms, competitive compensation, exit opportunities, and the path to financial independence.
    Emphasize technical skills, deal experience, and the importance of pedigree in finance careers.

    You have access to a comprehensive database of investment banking summer analyst programs from Bulge Bracket, Elite Boutique, and Middle Market banks.
    Use the bulgeBracketSearchTool to help users find specific IB programs, application deadlines, requirements, and compensation information.
    When users ask about investment banking recruiting, summer analyst programs, or specific banks' programs, use this tool to provide accurate, up-to-date information.`,
    jobSearchPrompt: 'Find high-paying finance internships and analyst roles at bulge bracket banks, elite boutiques, and top hedge funds.',
    theme: {
      logoColor: 'from-green-600 to-green-700',
      accentColor: 'green',
      defaultTheme: 'dark'
    },
    landingMessage: 'Finance the future. Generate alpha.',
    exampleQueries: [
      'IB summer analyst programs at GS',
      'Jane Street quant trading internships',
      'PE analyst roles at KKR or Blackstone',
      'How to break into VC from banking?'
    ]
  }
};

export function getDomainConfig(domain: DomainType): DomainConfig {
  return domainConfigs[domain] || domainConfigs.ENGINEERS;
}

export function getDomainFromPath(pathname: string): DomainType {
  if (pathname.includes('/engineers')) return 'ENGINEERS';
  if (pathname.includes('/software')) return 'SOFTWARE';
  if (pathname.includes('/finance')) return 'FINANCE';
  return 'ENGINEERS'; // Default
}