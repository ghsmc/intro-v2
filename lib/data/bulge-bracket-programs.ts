// Bulge Bracket Investment Banking Programs Data
export interface InternshipProgram {
  id: string;
  company: string;
  programName: string;
  programType: 'Summer Internship' | 'Full-Time' | 'Insight Program' | 'Off-Cycle';
  openingDate: string | null;
  closingDate: string | null;
  latestStage?: string;
  locations: string[];
  lastYearOpening?: string;
  testPrep?: string;
  requiresCV: boolean;
  requiresCoverLetter: boolean;
  requiresWrittenAnswers: boolean;
  notes?: string;
  applicationStatus: 'Not Applied' | 'Applied' | 'In Progress' | 'Rejected' | 'Offer';
  tier: 'Bulge Bracket' | 'Elite Boutique' | 'Middle Market' | 'Regional' | 'Specialized';
  division?: string;
  compensationRange?: string;
  applicationUrl?: string;
}

export const bulgeBracketPrograms: InternshipProgram[] = [
  // Bulge Bracket Banks
  {
    id: 'ms-2026-summer',
    company: 'Morgan Stanley',
    programName: '2026 Summer Analyst Program',
    programType: 'Summer Internship',
    openingDate: '2025-01-15',
    closingDate: null,
    locations: ['New York', 'London', 'Hong Kong', 'San Francisco', 'Chicago', 'Boston', 'Los Angeles'],
    lastYearOpening: '2024-01-15',
    testPrep: 'Cut-e',
    requiresCV: true,
    requiresCoverLetter: false,
    requiresWrittenAnswers: false,
    notes: 'Networking highly important',
    applicationStatus: 'Not Applied',
    tier: 'Bulge Bracket',
    division: 'Investment Banking',
    compensationRange: '$110k prorated'
  },
  {
    id: 'bofa-2026-summer',
    company: 'Bank of America',
    programName: 'Summer Analyst Program - 2026',
    programType: 'Summer Internship',
    openingDate: '2025-01-15',
    closingDate: null,
    locations: ['New York', 'Charlotte', 'San Francisco', 'Chicago', 'Los Angeles', 'Boston', 'Houston', 'Dallas', 'Atlanta', 'Miami', 'Washington DC'],
    lastYearOpening: '2024-02-01',
    requiresCV: true,
    requiresCoverLetter: false,
    requiresWrittenAnswers: false,
    notes: 'Includes technical HireVue',
    applicationStatus: 'Not Applied',
    tier: 'Bulge Bracket',
    division: 'Global Banking & Markets',
    compensationRange: '$110k prorated'
  },
  {
    id: 'ubs-2026-summer',
    company: 'UBS',
    programName: '2026 Summer Internship',
    programType: 'Summer Internship',
    openingDate: '2025-01-10',
    closingDate: null,
    locations: ['New York', 'Stamford', 'Nashville'],
    lastYearOpening: '2024-02-01',
    requiresCV: true,
    requiresCoverLetter: false,
    requiresWrittenAnswers: false,
    notes: 'First stage includes behavioural HireVue',
    applicationStatus: 'Not Applied',
    tier: 'Bulge Bracket',
    division: 'Investment Banking',
    compensationRange: '$110k prorated'
  },
  {
    id: 'barclays-2026-analyst',
    company: 'Barclays',
    programName: 'Analyst Internship Programme 2026',
    programType: 'Summer Internship',
    openingDate: '2025-01-08',
    closingDate: null,
    locations: ['New York', 'San Francisco', 'Chicago', 'Houston', 'Los Angeles', 'Boston', 'Menlo Park', 'Dallas'],
    lastYearOpening: '2024-02-02',
    testPrep: 'SHL',
    requiresCV: true,
    requiresCoverLetter: false,
    requiresWrittenAnswers: false,
    applicationStatus: 'Not Applied',
    tier: 'Bulge Bracket',
    division: 'Investment Banking',
    compensationRange: '$110k prorated'
  },
  {
    id: 'gs-2026-summer',
    company: 'Goldman Sachs',
    programName: '2026 Summer Analyst Programme',
    programType: 'Summer Internship',
    openingDate: '2024-12-31',
    closingDate: null,
    latestStage: 'Offers Out',
    locations: ['New York', 'San Francisco', 'Chicago', 'Dallas', 'Houston', 'Los Angeles', 'Philadelphia', 'Atlanta', 'Boston', 'Miami', 'Seattle', 'Salt Lake City', 'Washington DC', 'London', 'Frankfurt', 'Paris', 'Milan', 'Madrid', 'Zurich', 'Hong Kong', 'Singapore', 'Tokyo', 'Beijing', 'Mumbai'],
    lastYearOpening: '2024-03-01',
    testPrep: 'HireVue Prep',
    requiresCV: true,
    requiresCoverLetter: true,
    requiresWrittenAnswers: false,
    notes: 'Can apply to 3 positions/locations',
    applicationStatus: 'Not Applied',
    tier: 'Bulge Bracket',
    division: 'Investment Banking',
    compensationRange: '$110k prorated'
  },
  {
    id: 'citi-2026-summer',
    company: 'Citi',
    programName: 'Summer Analyst, 2026',
    programType: 'Summer Internship',
    openingDate: '2025-01-15',
    closingDate: '2025-01-22',
    locations: ['New York'],
    lastYearOpening: '2024-01-30',
    requiresCV: true,
    requiresCoverLetter: false,
    requiresWrittenAnswers: false,
    applicationStatus: 'Not Applied',
    tier: 'Bulge Bracket',
    division: 'Investment Banking',
    compensationRange: '$110k prorated'
  },
  {
    id: 'jpm-2026-summer',
    company: 'J.P. Morgan',
    programName: '2026 Summer Analyst Program',
    programType: 'Summer Internship',
    openingDate: '2024-12-30',
    closingDate: '2025-07-01',
    latestStage: 'Superday',
    locations: ['New York', 'San Francisco', 'Chicago', 'Houston', 'Los Angeles', 'Palo Alto', 'Boston', 'Miami', 'Dallas', 'Atlanta', 'Philadelphia', 'Seattle', 'Washington DC', 'London', 'Paris', 'Frankfurt', 'Milan', 'Madrid', 'Hong Kong', 'Singapore', 'Tokyo', 'Sydney'],
    lastYearOpening: '2024-01-01',
    testPrep: 'J.P. Morgan Prep',
    requiresCV: true,
    requiresCoverLetter: false,
    requiresWrittenAnswers: false,
    notes: 'Junior networking not important; HireVue straight to Superday',
    applicationStatus: 'Not Applied',
    tier: 'Bulge Bracket',
    division: 'Investment Banking',
    compensationRange: '$110k prorated'
  },
  {
    id: 'db-2026-summer',
    company: 'Deutsche Bank',
    programName: 'Internship Programme: Investment Bank 2026',
    programType: 'Summer Internship',
    openingDate: '2024-12-02',
    closingDate: '2025-01-26',
    locations: ['New York', 'San Francisco', 'Jacksonville'],
    testPrep: 'SHL',
    requiresCV: true,
    requiresCoverLetter: false,
    requiresWrittenAnswers: false,
    applicationStatus: 'Not Applied',
    tier: 'Bulge Bracket',
    division: 'Investment Banking',
    compensationRange: '$110k prorated'
  },

  // Elite Boutiques
  {
    id: 'centerview-2026',
    company: 'Centerview Partners',
    programName: '2026 Summer Analyst',
    programType: 'Summer Internship',
    openingDate: '2025-01-07',
    closingDate: '2025-07-12',
    latestStage: 'First Round',
    locations: ['New York', 'San Francisco'],
    requiresCV: true,
    requiresCoverLetter: false,
    requiresWrittenAnswers: false,
    notes: 'Only available on handshake',
    applicationStatus: 'Not Applied',
    tier: 'Elite Boutique',
    division: 'M&A Advisory',
    compensationRange: '$125k+ prorated'
  },
  {
    id: 'pjt-2026-summer',
    company: 'PJT Partners',
    programName: '2026 Summer Analyst',
    programType: 'Summer Internship',
    openingDate: '2025-01-02',
    closingDate: '2025-07-12',
    latestStage: 'First Round',
    locations: ['New York', 'San Francisco', 'Chicago', 'London'],
    lastYearOpening: '2024-01-25',
    testPrep: 'Suited',
    requiresCV: true,
    requiresCoverLetter: false,
    requiresWrittenAnswers: false,
    applicationStatus: 'Not Applied',
    tier: 'Elite Boutique',
    division: 'Strategic Advisory',
    compensationRange: '$125k+ prorated'
  },
  {
    id: 'evercore-2026',
    company: 'Evercore',
    programName: '2026 Summer Intern Program',
    programType: 'Summer Internship',
    openingDate: '2025-01-01',
    closingDate: '2025-02-16',
    latestStage: 'Offers Out',
    locations: ['New York', 'San Francisco', 'Houston', 'Chicago', 'Menlo Park'],
    lastYearOpening: '2024-02-01',
    requiresCV: true,
    requiresCoverLetter: true,
    requiresWrittenAnswers: false,
    notes: '1-3 first round screens, mostly technical',
    applicationStatus: 'Not Applied',
    tier: 'Elite Boutique',
    division: 'Advisory',
    compensationRange: '$125k+ prorated'
  },
  {
    id: 'moelis-2026',
    company: 'Moelis & Co',
    programName: '2026 Summer Analyst',
    programType: 'Summer Internship',
    openingDate: '2025-01-01',
    closingDate: '2025-07-12',
    latestStage: 'Offers Out',
    locations: ['New York', 'Los Angeles', 'San Francisco', 'Chicago', 'Boston', 'Houston'],
    requiresCV: true,
    requiresCoverLetter: false,
    requiresWrittenAnswers: false,
    applicationStatus: 'Not Applied',
    tier: 'Elite Boutique',
    division: 'Investment Banking',
    compensationRange: '$125k+ prorated'
  },
  {
    id: 'lazard-2026',
    company: 'Lazard',
    programName: '2026 Summer Analyst Program',
    programType: 'Summer Internship',
    openingDate: '2024-12-13',
    closingDate: '2025-07-12',
    latestStage: 'Offers Out',
    locations: ['New York', 'San Francisco', 'Chicago', 'Houston', 'Los Angeles', 'Boston', 'Washington DC', 'Charlotte'],
    lastYearOpening: '2024-01-05',
    requiresCV: true,
    requiresCoverLetter: false,
    requiresWrittenAnswers: true,
    applicationStatus: 'Not Applied',
    tier: 'Elite Boutique',
    division: 'Financial Advisory',
    compensationRange: '$125k+ prorated'
  },
  {
    id: 'pwp-2026',
    company: 'Perella Weinberg Partners',
    programName: '2026 Advisory Summer Analyst',
    programType: 'Summer Internship',
    openingDate: '2024-12-02',
    closingDate: '2025-01-31',
    latestStage: 'Superday',
    locations: ['New York', 'San Francisco', 'Chicago', 'Houston', 'Denver'],
    lastYearOpening: '2024-01-08',
    requiresCV: true,
    requiresCoverLetter: false,
    requiresWrittenAnswers: false,
    notes: 'First round with HR or headhunter',
    applicationStatus: 'Not Applied',
    tier: 'Elite Boutique',
    division: 'Advisory',
    compensationRange: '$125k+ prorated'
  },
  {
    id: 'rothschild-2026',
    company: 'Rothschild & Co.',
    programName: '2026 Global Advisory Summer Analyst',
    programType: 'Summer Internship',
    openingDate: '2024-11-11',
    closingDate: '2025-01-26',
    locations: ['New York', 'Los Angeles'],
    requiresCV: true,
    requiresCoverLetter: false,
    requiresWrittenAnswers: false,
    applicationStatus: 'Not Applied',
    tier: 'Elite Boutique',
    division: 'Global Advisory',
    compensationRange: '$125k+ prorated'
  },
  {
    id: 'greenhill-2026',
    company: 'Greenhill',
    programName: '2026 Summer Analyst Program',
    programType: 'Summer Internship',
    openingDate: null,
    closingDate: null,
    locations: ['New York'],
    requiresCV: true,
    requiresCoverLetter: false,
    requiresWrittenAnswers: false,
    notes: 'First round behavioural interview, then highly technical Superday',
    applicationStatus: 'Not Applied',
    tier: 'Elite Boutique',
    division: 'M&A Advisory',
    compensationRange: '$125k+ prorated'
  },
  {
    id: 'qatalyst-2026',
    company: 'Qatalyst Partners',
    programName: '2026 Summer Internship',
    programType: 'Summer Internship',
    openingDate: null,
    closingDate: null,
    locations: ['San Francisco'],
    requiresCV: true,
    requiresCoverLetter: false,
    requiresWrittenAnswers: false,
    notes: 'First round highly technical interview',
    applicationStatus: 'Not Applied',
    tier: 'Elite Boutique',
    division: 'Technology M&A',
    compensationRange: '$125k+ prorated'
  },

  // Middle Market & Others
  {
    id: 'jefferies-2026',
    company: 'Jefferies',
    programName: '2026 Summer Analyst Program',
    programType: 'Summer Internship',
    openingDate: '2025-01-15',
    closingDate: '2025-07-13',
    locations: ['New York', 'San Francisco', 'Los Angeles', 'Chicago', 'Houston', 'Boston', 'Nashville', 'Atlanta', 'Stamford', 'Miami'],
    lastYearOpening: '2024-01-25',
    requiresCV: true,
    requiresCoverLetter: false,
    requiresWrittenAnswers: false,
    applicationStatus: 'Not Applied',
    tier: 'Middle Market',
    division: 'Investment Banking',
    compensationRange: '$110k prorated'
  },
  {
    id: 'houlihan-2026',
    company: 'Houlihan Lokey',
    programName: '2026 Summer Financial Analyst',
    programType: 'Summer Internship',
    openingDate: '2024-11-22',
    closingDate: '2025-02-16',
    latestStage: 'Third Round',
    locations: ['New York', 'Los Angeles', 'San Francisco', 'Chicago', 'Minneapolis', 'Dallas', 'Houston', 'Atlanta', 'Boston', 'Miami'],
    testPrep: 'Suited',
    requiresCV: true,
    requiresCoverLetter: false,
    requiresWrittenAnswers: false,
    applicationStatus: 'Not Applied',
    tier: 'Middle Market',
    division: 'Investment Banking',
    compensationRange: '$110k prorated'
  },
  {
    id: 'william-blair-2026',
    company: 'William Blair',
    programName: 'Summer Analyst, 2026 Program',
    programType: 'Summer Internship',
    openingDate: '2024-10-14',
    closingDate: '2025-07-13',
    latestStage: 'Offers Out',
    locations: ['Chicago', 'San Francisco', 'Boston', 'New York', 'London', 'Frankfurt', 'Zurich'],
    lastYearOpening: '2024-01-08',
    requiresCV: true,
    requiresCoverLetter: false,
    requiresWrittenAnswers: false,
    applicationStatus: 'Not Applied',
    tier: 'Middle Market',
    division: 'Investment Banking',
    compensationRange: '$100k prorated'
  },
  {
    id: 'baird-2026',
    company: 'Baird',
    programName: 'Internship - Summer 2026',
    programType: 'Summer Internship',
    openingDate: '2024-10-04',
    closingDate: '2025-07-13',
    locations: ['Chicago', 'Milwaukee'],
    lastYearOpening: '2024-01-05',
    requiresCV: true,
    requiresCoverLetter: false,
    requiresWrittenAnswers: false,
    applicationStatus: 'Not Applied',
    tier: 'Middle Market',
    division: 'Investment Banking',
    compensationRange: '$100k prorated'
  },
  {
    id: 'piper-sandler-2026',
    company: 'Piper Sandler',
    programName: '2026 Summer Analyst',
    programType: 'Summer Internship',
    openingDate: '2025-01-03',
    closingDate: '2025-07-13',
    latestStage: 'Offers Out',
    locations: ['Minneapolis', 'New York', 'San Francisco', 'Chicago', 'Denver', 'Houston', 'Los Angeles', 'Boston', 'Nashville'],
    lastYearOpening: '2024-01-04',
    requiresCV: true,
    requiresCoverLetter: true,
    requiresWrittenAnswers: false,
    applicationStatus: 'Not Applied',
    tier: 'Middle Market',
    division: 'Investment Banking',
    compensationRange: '$100k prorated'
  },
  {
    id: 'harris-williams-2026',
    company: 'Harris Williams',
    programName: '2026 Summer Analyst',
    programType: 'Summer Internship',
    openingDate: '2025-01-21',
    closingDate: '2025-02-08',
    locations: ['Richmond', 'Boston', 'San Francisco'],
    lastYearOpening: '2024-02-06',
    testPrep: 'Suited',
    requiresCV: true,
    requiresCoverLetter: false,
    requiresWrittenAnswers: false,
    applicationStatus: 'Not Applied',
    tier: 'Middle Market',
    division: 'Investment Banking',
    compensationRange: '$100k prorated'
  },
  {
    id: 'stifel-2026',
    company: 'Stifel',
    programName: '2026 Summer Analyst',
    programType: 'Summer Internship',
    openingDate: '2025-01-21',
    closingDate: '2025-02-23',
    locations: ['St. Louis', 'New York', 'San Francisco', 'Chicago', 'Baltimore', 'Boston', 'Denver', 'Minneapolis'],
    lastYearOpening: '2024-01-27',
    requiresCV: true,
    requiresCoverLetter: false,
    requiresWrittenAnswers: false,
    applicationStatus: 'Not Applied',
    tier: 'Middle Market',
    division: 'Investment Banking',
    compensationRange: '$95k prorated'
  },
  {
    id: 'lincoln-2026',
    company: 'Lincoln International',
    programName: '2026 Summer Analyst Intern',
    programType: 'Summer Internship',
    openingDate: '2024-10-29',
    closingDate: '2025-07-31',
    locations: ['Chicago', 'New York', 'Los Angeles', 'San Francisco', 'Dallas', 'Miami'],
    lastYearOpening: '2024-01-09',
    requiresCV: true,
    requiresCoverLetter: false,
    requiresWrittenAnswers: false,
    applicationStatus: 'Not Applied',
    tier: 'Middle Market',
    division: 'Investment Banking',
    compensationRange: '$100k prorated'
  },

  // Specialized Firms
  {
    id: 'liontree-2026',
    company: 'LionTree',
    programName: '2026 Summer Analyst',
    programType: 'Summer Internship',
    openingDate: '2025-01-08',
    closingDate: '2025-02-21',
    locations: ['New York', 'San Francisco'],
    requiresCV: true,
    requiresCoverLetter: false,
    requiresWrittenAnswers: false,
    applicationStatus: 'Not Applied',
    tier: 'Specialized',
    division: 'TMT Advisory',
    compensationRange: '$110k prorated'
  },
  {
    id: 'ft-partners-2026',
    company: 'FT Partners',
    programName: '2026 Summer Analyst',
    programType: 'Summer Internship',
    openingDate: '2024-12-17',
    closingDate: '2025-07-12',
    latestStage: 'First Round',
    locations: ['San Francisco', 'New York'],
    lastYearOpening: '2024-02-01',
    requiresCV: true,
    requiresCoverLetter: true,
    requiresWrittenAnswers: false,
    applicationStatus: 'Not Applied',
    tier: 'Specialized',
    division: 'FinTech Advisory',
    compensationRange: '$110k prorated'
  },
  {
    id: 'raine-2026',
    company: 'Raine Group',
    programName: '2026 Summer Analyst',
    programType: 'Summer Internship',
    openingDate: '2024-10-14',
    closingDate: '2025-01-13',
    locations: ['New York'],
    requiresCV: true,
    requiresCoverLetter: false,
    requiresWrittenAnswers: false,
    applicationStatus: 'Not Applied',
    tier: 'Specialized',
    division: 'TMT Merchant Bank',
    compensationRange: '$110k prorated'
  },
  {
    id: 'guggenheim-2026',
    company: 'Guggenheim Partners',
    programName: '2026 Summer Analyst',
    programType: 'Summer Internship',
    openingDate: '2025-01-03',
    closingDate: null,
    locations: ['New York', 'Chicago', 'Santa Monica', 'San Francisco', 'Atlanta', 'Houston'],
    requiresCV: true,
    requiresCoverLetter: false,
    requiresWrittenAnswers: false,
    applicationStatus: 'Not Applied',
    tier: 'Middle Market',
    division: 'Investment Banking',
    compensationRange: '$100k prorated',
    notes: 'Offers Out'
  },

  // Canadian Banks
  {
    id: 'rbc-2026',
    company: 'RBC Capital Markets',
    programName: '2026 Summer Analyst',
    programType: 'Summer Internship',
    openingDate: '2024-09-27',
    closingDate: '2025-03-03',
    locations: ['New York', 'San Francisco', 'Toronto'],
    testPrep: 'smartPredict',
    requiresCV: true,
    requiresCoverLetter: false,
    requiresWrittenAnswers: false,
    applicationStatus: 'Not Applied',
    tier: 'Bulge Bracket',
    division: 'Investment Banking',
    compensationRange: '$110k prorated'
  },
  {
    id: 'bmo-2026',
    company: 'BMO Capital Markets',
    programName: 'Summer 2026 Internship',
    programType: 'Summer Internship',
    openingDate: '2024-12-02',
    closingDate: '2025-12-02',
    locations: ['New York', 'Chicago', 'Toronto'],
    lastYearOpening: '2023-12-18',
    requiresCV: true,
    requiresCoverLetter: false,
    requiresWrittenAnswers: false,
    applicationStatus: 'Not Applied',
    tier: 'Middle Market',
    division: 'Investment Banking',
    compensationRange: '$100k prorated'
  },
  {
    id: 'td-securities-2026',
    company: 'TD Securities',
    programName: '2026 Summer Analyst',
    programType: 'Summer Internship',
    openingDate: '2024-12-13',
    closingDate: '2025-01-05',
    latestStage: 'Superday',
    locations: ['Houston'],
    lastYearOpening: '2024-01-22',
    requiresCV: true,
    requiresCoverLetter: false,
    requiresWrittenAnswers: false,
    applicationStatus: 'Not Applied',
    tier: 'Middle Market',
    division: 'Investment Banking',
    compensationRange: '$100k prorated'
  },
  {
    id: 'scotiabank-2026',
    company: 'Scotiabank',
    programName: '2026 Investment Banking Summer Analyst',
    programType: 'Summer Internship',
    openingDate: '2024-12-17',
    closingDate: '2025-07-13',
    latestStage: 'Offers Out',
    locations: ['New York', 'Houston'],
    requiresCV: true,
    requiresCoverLetter: false,
    requiresWrittenAnswers: false,
    applicationStatus: 'Not Applied',
    tier: 'Middle Market',
    division: 'Global Banking & Markets',
    compensationRange: '$100k prorated'
  }
];

// Helper functions for data manipulation
export const getCompaniesByTier = (tier: string) => {
  return bulgeBracketPrograms.filter(program => program.tier === tier);
};

export const getOpenPrograms = () => {
  const today = new Date();
  return bulgeBracketPrograms.filter(program => {
    if (!program.openingDate) return false;
    const openDate = new Date(program.openingDate);
    const closeDate = program.closingDate ? new Date(program.closingDate) : null;
    return openDate <= today && (!closeDate || closeDate >= today);
  });
};

export const getUpcomingPrograms = () => {
  const today = new Date();
  return bulgeBracketPrograms.filter(program => {
    if (!program.openingDate) return false;
    const openDate = new Date(program.openingDate);
    return openDate > today;
  });
};

export const getProgramsByCompany = (company: string) => {
  return bulgeBracketPrograms.filter(program =>
    program.company.toLowerCase() === company.toLowerCase()
  );
};

export const searchPrograms = (query: string) => {
  const lowerQuery = query.toLowerCase();
  return bulgeBracketPrograms.filter(program =>
    program.company.toLowerCase().includes(lowerQuery) ||
    program.programName.toLowerCase().includes(lowerQuery) ||
    program.locations.some(loc => loc.toLowerCase().includes(lowerQuery)) ||
    program.notes?.toLowerCase().includes(lowerQuery)
  );
};