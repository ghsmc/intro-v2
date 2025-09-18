// Enhanced Job Search Tool with ChatGPT-like UX and Deep Website Scraping
import { z } from 'zod';
import { tool } from 'ai';
import * as cheerio from 'cheerio';

interface JobListing {
  id: string;
  title: string;
  company: string;
  companyId: string;
  location: string;
  description: string;
  requirements: string[];
  responsibilities: string[];
  benefits: string[];
  salary?: string;
  type: 'full-time' | 'part-time' | 'internship' | 'contract';
  level: 'entry' | 'mid' | 'senior' | 'lead' | 'executive';
  postedDate?: string;
  applyUrl: string;
  source: string;
  companyLogo?: string;
  team?: string;
  culture?: string;
  mission?: string;
  urgency: 'closing-soon' | 'just-opened' | 'high-demand' | 'normal';
  matchScore?: number;
}

interface SearchProgress {
  step: string;
  status: 'pending' | 'processing' | 'completed' | 'error';
  details: string;
  duration?: number;
  resultsCount?: number;
}

// Comprehensive company career page mappings
const CAREER_PAGES: Record<string, { 
  url: string; 
  selector: string;
  jobTitleSelector: string;
  jobDescriptionSelector: string;
  jobLocationSelector: string;
  jobApplySelector: string;
  baseUrl: string;
}> = {
  // AI/Tech Giants
  'openai': {
    url: 'https://openai.com/careers/search',
    selector: '.careers-listing',
    jobTitleSelector: 'h3',
    jobDescriptionSelector: '.job-description',
    jobLocationSelector: '.location',
    jobApplySelector: 'a[href*="apply"]',
    baseUrl: 'https://openai.com'
  },
  'anthropic': {
    url: 'https://www.anthropic.com/careers',
    selector: '[data-job-listing]',
    jobTitleSelector: '.job-title',
    jobDescriptionSelector: '.job-description',
    jobLocationSelector: '.job-location',
    jobApplySelector: 'a[href*="apply"]',
    baseUrl: 'https://www.anthropic.com'
  },
  'google': {
    url: 'https://careers.google.com/jobs/results/',
    selector: '.job-card',
    jobTitleSelector: 'h3',
    jobDescriptionSelector: '.job-description',
    jobLocationSelector: '.location',
    jobApplySelector: 'a[href*="apply"]',
    baseUrl: 'https://careers.google.com'
  },
  'microsoft': {
    url: 'https://careers.microsoft.com/us/en/search-results',
    selector: '.job-card',
    jobTitleSelector: '.job-title',
    jobDescriptionSelector: '.job-description',
    jobLocationSelector: '.job-location',
    jobApplySelector: 'a[href*="apply"]',
    baseUrl: 'https://careers.microsoft.com'
  },
  'meta': {
    url: 'https://www.metacareers.com/jobs/',
    selector: '.job-card',
    jobTitleSelector: 'h3',
    jobDescriptionSelector: '.job-description',
    jobLocationSelector: '.location',
    jobApplySelector: 'a[href*="apply"]',
    baseUrl: 'https://www.metacareers.com'
  },
  'apple': {
    url: 'https://jobs.apple.com/en-us/search',
    selector: '.job-card',
    jobTitleSelector: '.job-title',
    jobDescriptionSelector: '.job-description',
    jobLocationSelector: '.job-location',
    jobApplySelector: 'a[href*="apply"]',
    baseUrl: 'https://jobs.apple.com'
  },
  'amazon': {
    url: 'https://www.amazon.jobs/en/search',
    selector: '.job-card',
    jobTitleSelector: 'h3',
    jobDescriptionSelector: '.job-description',
    jobLocationSelector: '.location',
    jobApplySelector: 'a[href*="apply"]',
    baseUrl: 'https://www.amazon.jobs'
  },

  // Unicorns & High-Growth
  'stripe': {
    url: 'https://stripe.com/jobs/search',
    selector: '.JobListing',
    jobTitleSelector: '.JobListing-title',
    jobDescriptionSelector: '.JobListing-description',
    jobLocationSelector: '.JobListing-location',
    jobApplySelector: 'a[href*="apply"]',
    baseUrl: 'https://stripe.com'
  },
  'databricks': {
    url: 'https://www.databricks.com/company/careers/open-positions',
    selector: '.job-listing',
    jobTitleSelector: '.job-title',
    jobDescriptionSelector: '.job-description',
    jobLocationSelector: '.job-location',
    jobApplySelector: 'a[href*="apply"]',
    baseUrl: 'https://www.databricks.com'
  },
  'snowflake': {
    url: 'https://careers.snowflake.com/us/en/search-results',
    selector: '.job-card',
    jobTitleSelector: 'h3',
    jobDescriptionSelector: '.job-description',
    jobLocationSelector: '.location',
    jobApplySelector: 'a[href*="apply"]',
    baseUrl: 'https://careers.snowflake.com'
  },
  'palantir': {
    url: 'https://www.palantir.com/careers/openings/',
    selector: '.job-listing',
    jobTitleSelector: '.job-title',
    jobDescriptionSelector: '.job-description',
    jobLocationSelector: '.job-location',
    jobApplySelector: 'a[href*="apply"]',
    baseUrl: 'https://www.palantir.com'
  },

  // Product/Design Companies
  'figma': {
    url: 'https://www.figma.com/careers/',
    selector: '.job-listing',
    jobTitleSelector: '.job-title',
    jobDescriptionSelector: '.job-description',
    jobLocationSelector: '.job-location',
    jobApplySelector: 'a[href*="apply"]',
    baseUrl: 'https://www.figma.com'
  },
  'notion': {
    url: 'https://www.notion.so/careers',
    selector: '.job-card',
    jobTitleSelector: 'h3',
    jobDescriptionSelector: '.job-description',
    jobLocationSelector: '.location',
    jobApplySelector: 'a[href*="apply"]',
    baseUrl: 'https://www.notion.so'
  },
  'linear': {
    url: 'https://linear.app/careers',
    selector: '.job-listing',
    jobTitleSelector: '.job-title',
    jobDescriptionSelector: '.job-description',
    jobLocationSelector: '.job-location',
    jobApplySelector: 'a[href*="apply"]',
    baseUrl: 'https://linear.app'
  },
  'vercel': {
    url: 'https://vercel.com/careers',
    selector: '.job-card',
    jobTitleSelector: 'h3',
    jobDescriptionSelector: '.job-description',
    jobLocationSelector: '.location',
    jobApplySelector: 'a[href*="apply"]',
    baseUrl: 'https://vercel.com'
  },

  // Finance/Fintech
  'goldman-sachs': {
    url: 'https://www.goldmansachs.com/careers/students.html',
    selector: '.job-listing',
    jobTitleSelector: '.job-title',
    jobDescriptionSelector: '.job-description',
    jobLocationSelector: '.job-location',
    jobApplySelector: 'a[href*="apply"]',
    baseUrl: 'https://www.goldmansachs.com'
  },
  'jpmorgan': {
    url: 'https://careers.jpmorgan.com/us/en/students',
    selector: '.job-card',
    jobTitleSelector: 'h3',
    jobDescriptionSelector: '.job-description',
    jobLocationSelector: '.location',
    jobApplySelector: 'a[href*="apply"]',
    baseUrl: 'https://careers.jpmorgan.com'
  },
  'morgan-stanley': {
    url: 'https://www.morganstanley.com/careers/students',
    selector: '.job-listing',
    jobTitleSelector: '.job-title',
    jobDescriptionSelector: '.job-description',
    jobLocationSelector: '.job-location',
    jobApplySelector: 'a[href*="apply"]',
    baseUrl: 'https://www.morganstanley.com'
  },
  'blackstone': {
    url: 'https://www.blackstone.com/careers/students',
    selector: '.job-card',
    jobTitleSelector: 'h3',
    jobDescriptionSelector: '.job-description',
    jobLocationSelector: '.location',
    jobApplySelector: 'a[href*="apply"]',
    baseUrl: 'https://www.blackstone.com'
  }
};

// ChatGPT-like loading phrases
const LOADING_PHRASES = [
  "🔍 Scanning company career pages for relevant opportunities...",
  "🧠 Analyzing job requirements against your profile...",
  "⚡ Identifying high-potential matches in real-time...",
  "🎯 Cross-referencing with our company database...",
  "📊 Calculating compatibility scores for each role...",
  "🚀 Prioritizing opportunities by match quality...",
  "💎 Filtering for roles that align with your values...",
  "🎨 Personalizing job descriptions for your interests...",
  "📈 Evaluating growth potential and company trajectory...",
  "✨ Finalizing your personalized career recommendations..."
];

export const enhancedJobSearchTool = tool({
  description: 'Enhanced job search that scrapes company career pages directly and provides ChatGPT-like UX with detailed progress tracking',
  inputSchema: z.object({
    companies: z.array(z.string()).optional().describe('Specific companies to search'),
    query: z.string().optional().describe('Job search query or role type'),
    location: z.string().optional().describe('Job location preference'),
    jobType: z.enum(['full-time', 'part-time', 'internship', 'contract']).optional(),
    experienceLevel: z.enum(['entry', 'mid', 'senior', 'lead', 'executive']).optional(),
    domain: z.enum(['ENGINEERS', 'SOFTWARE', 'FINANCE']).optional(),
    limit: z.number().optional().default(20),
    includeProgress: z.boolean().optional().default(true)
  }),
  execute: async ({ 
    companies = [], 
    query, 
    location, 
    jobType, 
    experienceLevel, 
    domain,
    limit = 20,
    includeProgress = true 
  }) => {
    const startTime = Date.now();
    const allJobs: JobListing[] = [];
    const progressSteps: SearchProgress[] = [];
    
    // Initialize progress tracking
    if (includeProgress) {
      progressSteps.push({
        step: "Initializing search",
        status: "processing",
        details: "Setting up search parameters and company targets",
        duration: 0
      });
    }

    try {
      // Step 1: Analyze search parameters
      if (includeProgress) {
        progressSteps.push({
          step: "Analyzing search parameters",
          status: "completed",
          details: `Searching for ${jobType || 'all types'} ${experienceLevel || 'all levels'} roles`,
          duration: 200
        });
      }

      // Step 2: Determine target companies
      const targetCompanies = companies.length > 0 
        ? companies.map(c => c.toLowerCase().replace(/\s+/g, '-'))
        : getDefaultCompaniesForDomain(domain);

      if (includeProgress) {
        progressSteps.push({
          step: "Identifying target companies",
          status: "completed",
          details: `Found ${targetCompanies.length} companies to search`,
          duration: 300
        });
      }

      // Step 3: Scrape each company's career page
      const searchPromises = targetCompanies.map(async (company, index) => {
        if (includeProgress) {
          progressSteps.push({
            step: `Scraping ${company} careers`,
            status: "processing",
            details: LOADING_PHRASES[index % LOADING_PHRASES.length],
            duration: 0
          });
        }

        try {
          const companyJobs = await scrapeCompanyCareers(company, {
            query,
            location,
            jobType,
            experienceLevel
          });

          if (includeProgress) {
            progressSteps.push({
              step: `Scraping ${company} careers`,
              status: "completed",
              details: `Found ${companyJobs.length} opportunities`,
              duration: 800 + Math.random() * 400,
              resultsCount: companyJobs.length
            });
          }

          return companyJobs;
        } catch (error) {
          console.error(`Error scraping ${company}:`, error);
          if (includeProgress) {
            progressSteps.push({
              step: `Scraping ${company} careers`,
              status: "error",
              details: `Failed to scrape ${company} careers page`,
              duration: 1000
            });
          }
          return [];
        }
      });

      // Execute all searches in parallel
      const results = await Promise.all(searchPromises);
      for (const jobList of results) {
        allJobs.push(...jobList);
      }

      // Step 4: Process and rank results
      if (includeProgress) {
        progressSteps.push({
          step: "Processing results",
          status: "processing",
          details: "Analyzing job descriptions and calculating match scores",
          duration: 0
        });
      }

      // Filter and sort results
      let filteredJobs = [...allJobs];
      
      if (jobType) {
        filteredJobs = filteredJobs.filter(job => job.type === jobType);
      }
      
      if (experienceLevel) {
        filteredJobs = filteredJobs.filter(job => job.level === experienceLevel);
      }

      // Sort by relevance and limit results
      filteredJobs.sort((a, b) => {
        // Prioritize by match score if available
        if (a.matchScore && b.matchScore) {
          return b.matchScore - a.matchScore;
        }
        // Otherwise sort by company reputation and recency
        return 0;
      });

      const finalResults = filteredJobs.slice(0, limit);

      if (includeProgress) {
        progressSteps.push({
          step: "Processing results",
          status: "completed",
          details: `Found ${finalResults.length} high-quality matches`,
          duration: 500
        });
      }

      const totalDuration = Date.now() - startTime;

      // Format results like Perplexity sources
      const formattedJobs = finalResults.map((job, index) => ({
        id: job.id,
        title: job.title,
        company: job.company,
        location: job.location,
        type: job.type,
        level: job.level,
        description: job.description,
        requirements: job.requirements,
        responsibilities: job.responsibilities,
        benefits: job.benefits,
        salary: job.salary,
        applyUrl: job.applyUrl,
        source: job.source,
        companyLogo: job.companyLogo,
        team: job.team,
        culture: job.culture,
        mission: job.mission,
        urgency: job.urgency,
        matchScore: job.matchScore,
        postedDate: job.postedDate,
        // Perplexity-style source formatting
        sourceInfo: {
          company: job.company,
          logo: job.companyLogo,
          url: job.applyUrl,
          domain: new URL(job.applyUrl).hostname,
          type: 'Job Opportunity'
        }
      }));

      return {
        jobs: formattedJobs,
        sources: formattedJobs.map(job => ({
          title: `${job.title} at ${job.company}`,
          url: job.applyUrl,
          domain: job.sourceInfo.domain,
          logo: job.companyLogo,
          snippet: job.description.substring(0, 200) + '...',
          type: 'Job Opportunity',
          company: job.company,
          location: job.location,
          matchScore: job.matchScore
        })),
        metadata: {
          totalFound: allJobs.length,
          filteredCount: finalResults.length,
          companiesSearched: targetCompanies.length,
          searchDuration: totalDuration,
          progressSteps: includeProgress ? progressSteps : undefined,
          loadingPhrases: includeProgress ? LOADING_PHRASES : undefined
        }
      };

    } catch (error) {
      console.error('Enhanced job search error:', error);
      return {
        jobs: [],
        metadata: {
          error: 'Search failed',
          searchDuration: Date.now() - startTime,
          progressSteps: includeProgress ? progressSteps : undefined
        }
      };
    }
  }
});

// Helper function to scrape individual company career pages
async function scrapeCompanyCareers(
  company: string, 
  filters: {
    query?: string;
    location?: string;
    jobType?: string;
    experienceLevel?: string;
  }
): Promise<JobListing[]> {
  const companyConfig = CAREER_PAGES[company];
  if (!companyConfig) {
    return [];
  }

  try {
    const response = await fetch(companyConfig.url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
      }
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }

    const html = await response.text();
    const $ = cheerio.load(html);
    const jobs: JobListing[] = [];

    $(companyConfig.selector).each((index, element) => {
      try {
        const $job = $(element);
        
        const title = $job.find(companyConfig.jobTitleSelector).text().trim();
        const description = $job.find(companyConfig.jobDescriptionSelector).text().trim();
        const location = $job.find(companyConfig.jobLocationSelector).text().trim();
        const applyUrl = $job.find(companyConfig.jobApplySelector).attr('href');

        if (!title || !description) return;

        // Filter by query if provided
        if (filters.query && !title.toLowerCase().includes(filters.query.toLowerCase()) && 
            !description.toLowerCase().includes(filters.query.toLowerCase())) {
          return;
        }

        // Filter by location if provided
        if (filters.location && !location.toLowerCase().includes(filters.location.toLowerCase())) {
          return;
        }

        // Determine job type and level from title/description
        const jobType = determineJobType(title, description);
        const level = determineExperienceLevel(title, description);

        // Filter by job type if specified
        if (filters.jobType && jobType !== filters.jobType) {
          return;
        }

        // Filter by experience level if specified
        if (filters.experienceLevel && level !== filters.experienceLevel) {
          return;
        }

        // Extract more detailed information
        const fullDescription = $job.find(companyConfig.jobDescriptionSelector).html() || description;
        const detailedRequirements = extractDetailedRequirements(fullDescription);
        const detailedResponsibilities = extractDetailedResponsibilities(fullDescription);
        const detailedBenefits = extractDetailedBenefits(fullDescription);
        const teamInfo = extractDetailedTeamInfo(fullDescription);
        const cultureInfo = extractDetailedCultureInfo(fullDescription);
        const missionInfo = extractDetailedMissionInfo(fullDescription);
        const salaryInfo = extractDetailedSalary(fullDescription);
        const workArrangement = extractWorkArrangement(fullDescription);

        const job: JobListing = {
          id: `${company}-${index}-${Date.now()}`,
          title,
          company: company.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
          companyId: company,
          location: location || 'Not specified',
          description: cleanDescription(description),
          requirements: detailedRequirements,
          responsibilities: detailedResponsibilities,
          benefits: detailedBenefits,
          salary: salaryInfo,
          type: jobType,
          level,
          postedDate: extractPostedDate($job),
          applyUrl: applyUrl ? (applyUrl.startsWith('http') ? applyUrl : `${companyConfig.baseUrl}${applyUrl}`) : companyConfig.url,
          source: 'Company Career Page',
          companyLogo: getCompanyLogo(company),
          team: teamInfo,
          culture: cultureInfo,
          mission: missionInfo,
          urgency: determineUrgency(title, description),
          matchScore: calculateMatchScore(title, description, filters)
        };

        jobs.push(job);
      } catch (error) {
        console.error(`Error parsing job ${index} for ${company}:`, error);
      }
    });

    return jobs;
  } catch (error) {
    console.error(`Error scraping ${company}:`, error);
    return [];
  }
}

// Helper functions
function getDefaultCompaniesForDomain(domain?: string): string[] {
  const defaultCompanies = {
    ENGINEERS: ['openai', 'anthropic', 'google', 'microsoft', 'stripe', 'databricks', 'palantir'],
    SOFTWARE: ['figma', 'notion', 'linear', 'vercel', 'stripe', 'databricks'],
    FINANCE: ['goldman-sachs', 'jpmorgan', 'morgan-stanley', 'blackstone', 'stripe']
  };

  return domain ? defaultCompanies[domain] || defaultCompanies.ENGINEERS : defaultCompanies.ENGINEERS;
}

function determineJobType(title: string, description: string): 'full-time' | 'part-time' | 'internship' | 'contract' {
  const text = `${title} ${description}`.toLowerCase();
  
  if (text.includes('intern') || text.includes('internship')) return 'internship';
  if (text.includes('part-time') || text.includes('part time')) return 'part-time';
  if (text.includes('contract') || text.includes('freelance')) return 'contract';
  return 'full-time';
}

function determineExperienceLevel(title: string, description: string): 'entry' | 'mid' | 'senior' | 'lead' | 'executive' {
  const text = `${title} ${description}`.toLowerCase();
  
  if (text.includes('senior') || text.includes('sr.')) return 'senior';
  if (text.includes('lead') || text.includes('principal')) return 'lead';
  if (text.includes('director') || text.includes('vp') || text.includes('c-level')) return 'executive';
  if (text.includes('junior') || text.includes('entry') || text.includes('new grad')) return 'entry';
  return 'mid';
}

function extractRequirements(description: string): string[] {
  const requirements: string[] = [];
  const lines = description.split('\n');
  
  for (const line of lines) {
    if (line.toLowerCase().includes('required') || 
        line.toLowerCase().includes('must have') ||
        line.toLowerCase().includes('qualifications')) {
      requirements.push(line.trim());
    }
  }
  
  return requirements.slice(0, 5); // Limit to 5 requirements
}

function extractResponsibilities(description: string): string[] {
  const responsibilities: string[] = [];
  const lines = description.split('\n');
  
  for (const line of lines) {
    if (line.toLowerCase().includes('responsibilities') || 
        line.toLowerCase().includes('you will') ||
        line.toLowerCase().includes('duties')) {
      responsibilities.push(line.trim());
    }
  }
  
  return responsibilities.slice(0, 5);
}

function extractBenefits(description: string): string[] {
  const benefits: string[] = [];
  const text = description.toLowerCase();
  
  const benefitKeywords = [
    'health insurance', 'dental', 'vision', '401k', 'retirement',
    'unlimited pto', 'vacation', 'flexible hours', 'remote work',
    'equity', 'stock options', 'bonus', 'learning budget'
  ];
  
  for (const benefit of benefitKeywords) {
    if (text.includes(benefit)) {
      benefits.push(benefit);
    }
  }
  
  return benefits;
}

function extractSalary(description: string): string | undefined {
  const salaryMatch = description.match(/\$[\d,]+(?:k|K)?(?:\s*-\s*\$[\d,]+(?:k|K)?)?/);
  return salaryMatch ? salaryMatch[0] : undefined;
}

function extractPostedDate($job: cheerio.Cheerio): string | undefined {
  const dateText = $job.find('.date, .posted, .created').text().trim();
  return dateText || undefined;
}

function getCompanyLogo(company: string): string {
  const logos: Record<string, string> = {
    'openai': 'https://openai.com/favicon.ico',
    'anthropic': 'https://www.anthropic.com/favicon.ico',
    'google': 'https://www.google.com/favicon.ico',
    'microsoft': 'https://www.microsoft.com/favicon.ico',
    'meta': 'https://www.meta.com/favicon.ico',
    'apple': 'https://www.apple.com/favicon.ico',
    'amazon': 'https://www.amazon.com/favicon.ico',
    'stripe': 'https://stripe.com/favicon.ico',
    'figma': 'https://www.figma.com/favicon.ico',
    'notion': 'https://www.notion.so/favicon.ico',
  };
  
  return logos[company] || '';
}

function extractTeamInfo(description: string): string {
  const teamMatch = description.match(/team[^.]*\./i);
  return teamMatch ? teamMatch[0] : 'Join our collaborative team';
}

function extractCultureInfo(description: string): string {
  const cultureMatch = description.match(/culture[^.]*\./i);
  return cultureMatch ? cultureMatch[0] : 'Innovative and collaborative environment';
}

function extractMissionInfo(description: string): string {
  const missionMatch = description.match(/mission[^.]*\./i);
  return missionMatch ? missionMatch[0] : 'Help us build the future';
}

function determineUrgency(title: string, description: string): 'closing-soon' | 'just-opened' | 'high-demand' | 'normal' {
  const text = `${title} ${description}`.toLowerCase();
  
  if (text.includes('urgent') || text.includes('immediate')) return 'closing-soon';
  if (text.includes('new') || text.includes('recently posted')) return 'just-opened';
  if (text.includes('high demand') || text.includes('competitive')) return 'high-demand';
  return 'normal';
}

function calculateMatchScore(title: string, description: string, filters: any): number {
  let score = 50; // Base score
  
  // Boost score for exact matches
  if (filters.query && title.toLowerCase().includes(filters.query.toLowerCase())) {
    score += 20;
  }
  
  if (filters.location && description.toLowerCase().includes(filters.location.toLowerCase())) {
    score += 15;
  }
  
  // Boost for high-demand keywords
  const highDemandKeywords = ['ai', 'ml', 'machine learning', 'blockchain', 'crypto'];
  for (const keyword of highDemandKeywords) {
    if (description.toLowerCase().includes(keyword)) {
      score += 10;
      break;
    }
  }
  
  return Math.min(100, score);
}

// Enhanced extraction functions for more detailed job information
function extractDetailedRequirements(html: string): string[] {
  const requirements: string[] = [];
  const $ = cheerio.load(html);
  
  // Look for requirement sections
  $('li, p').each((_, element) => {
    const text = $(element).text().trim();
    if (text.toLowerCase().includes('required') || 
        text.toLowerCase().includes('must have') ||
        text.toLowerCase().includes('qualifications') ||
        text.toLowerCase().includes('experience with')) {
      if (text.length > 10 && text.length < 200) {
        requirements.push(text);
      }
    }
  });
  
  return requirements.slice(0, 8); // More requirements
}

function extractDetailedResponsibilities(html: string): string[] {
  const responsibilities: string[] = [];
  const $ = cheerio.load(html);
  
  $('li, p').each((_, element) => {
    const text = $(element).text().trim();
    if (text.toLowerCase().includes('responsibilities') || 
        text.toLowerCase().includes('you will') ||
        text.toLowerCase().includes('duties') ||
        text.toLowerCase().includes('develop') ||
        text.toLowerCase().includes('build')) {
      if (text.length > 10 && text.length < 200) {
        responsibilities.push(text);
      }
    }
  });
  
  return responsibilities.slice(0, 8);
}

function extractDetailedBenefits(html: string): string[] {
  const benefits: string[] = [];
  const $ = cheerio.load(html);
  const text = $.text().toLowerCase();
  
  const benefitKeywords = [
    'health insurance', 'dental', 'vision', '401k', 'retirement',
    'unlimited pto', 'vacation', 'flexible hours', 'remote work',
    'equity', 'stock options', 'bonus', 'learning budget',
    'gym membership', 'catered meals', 'transportation', 'childcare'
  ];
  
  for (const benefit of benefitKeywords) {
    if (text.includes(benefit)) {
      benefits.push(benefit);
    }
  }
  
  return benefits;
}

function extractDetailedTeamInfo(html: string): string {
  const $ = cheerio.load(html);
  const text = $.text();
  
  const teamMatch = text.match(/team[^.]*\./i);
  if (teamMatch) return teamMatch[0];
  
  const collaborationMatch = text.match(/collaborat[^.]*\./i);
  if (collaborationMatch) return collaborationMatch[0];
  
  return 'Join our collaborative team';
}

function extractDetailedCultureInfo(html: string): string {
  const $ = cheerio.load(html);
  const text = $.text();
  
  const cultureMatch = text.match(/culture[^.]*\./i);
  if (cultureMatch) return cultureMatch[0];
  
  const environmentMatch = text.match(/environment[^.]*\./i);
  if (environmentMatch) return environmentMatch[0];
  
  return 'Innovative and collaborative environment';
}

function extractDetailedMissionInfo(html: string): string {
  const $ = cheerio.load(html);
  const text = $.text();
  
  const missionMatch = text.match(/mission[^.]*\./i);
  if (missionMatch) return missionMatch[0];
  
  const impactMatch = text.match(/impact[^.]*\./i);
  if (impactMatch) return impactMatch[0];
  
  return 'Help us build the future';
}

function extractDetailedSalary(html: string): string | undefined {
  const $ = cheerio.load(html);
  const text = $.text();
  
  // Look for various salary patterns
  const salaryPatterns = [
    /\$[\d,]+(?:k|K)?(?:\s*-\s*\$[\d,]+(?:k|K)?)?/g,
    /salary[^$]*\$[\d,]+(?:k|K)?/gi,
    /compensation[^$]*\$[\d,]+(?:k|K)?/gi,
    /pay[^$]*\$[\d,]+(?:k|K)?/gi
  ];
  
  for (const pattern of salaryPatterns) {
    const match = text.match(pattern);
    if (match) {
      return match[0];
    }
  }
  
  return undefined;
}

function extractWorkArrangement(html: string): string {
  const $ = cheerio.load(html);
  const text = $.text().toLowerCase();
  
  if (text.includes('remote') && text.includes('hybrid')) return 'Hybrid';
  if (text.includes('remote')) return 'Remote';
  if (text.includes('on-site') || text.includes('onsite')) return 'On-site';
  return 'Not specified';
}

function cleanDescription(description: string): string {
  // Remove HTML tags and clean up text
  return description
    .replace(/<[^>]*>/g, '')
    .replace(/\s+/g, ' ')
    .trim()
    .substring(0, 500); // Limit length
}
