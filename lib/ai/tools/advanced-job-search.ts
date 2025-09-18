// Advanced Job Search Tool with Real Web Scraping
import { z } from 'zod';
import { tool } from 'ai';
import * as cheerio from 'cheerio';

interface JobListing {
  title: string;
  company: string;
  location: string;
  description: string;
  requirements: string[];
  salary?: string;
  type: string;
  postedDate?: string;
  applyUrl: string;
  source: string;
}

// Company career page URLs mapping
const CAREER_PAGES: Record<string, { url: string; selector?: string }> = {
  // Engineering companies
  'openai': {
    url: 'https://openai.com/careers/search',
    selector: '.careers-listing'
  },
  'anthropic': {
    url: 'https://www.anthropic.com/careers',
    selector: '[data-job-listing]'
  },
  'tesla': {
    url: 'https://www.tesla.com/careers/search',
    selector: '.tds-card'
  },
  'spacex': {
    url: 'https://www.spacex.com/careers/list',
    selector: '.careers-item'
  },
  'stripe': {
    url: 'https://stripe.com/jobs/search',
    selector: '.JobListing'
  },

  // Software/Product companies
  'figma': {
    url: 'https://www.figma.com/careers/',
    selector: '.job-listing'
  },
  'notion': {
    url: 'https://www.notion.so/careers',
    selector: '.job-card'
  },
  'linear': {
    url: 'https://linear.app/careers',
    selector: '.careers-position'
  },

  // Finance companies
  'goldmansachs': {
    url: 'https://www.goldmansachs.com/careers/students/programs/',
    selector: '.careers-program'
  },
  'morganstanley': {
    url: 'https://www.morganstanley.com/careers/students-graduates',
    selector: '.career-opportunity'
  },
  'jpmorgan': {
    url: 'https://careers.jpmorgan.com/careers/programs/investment-banking-summer-analyst',
    selector: '.job-details'
  }
};

// Greenhouse ATS API endpoints (many tech companies use this)
const GREENHOUSE_APIS = {
  'databricks': 'https://boards-api.greenhouse.io/v1/boards/databricks/jobs',
  'coinbase': 'https://boards-api.greenhouse.io/v1/boards/coinbase/jobs',
  'docker': 'https://boards-api.greenhouse.io/v1/boards/docker/jobs',
  'reddit': 'https://boards-api.greenhouse.io/v1/boards/reddit/jobs',
  'medium': 'https://boards-api.greenhouse.io/v1/boards/medium/jobs',
};

// Lever ATS API endpoints
const LEVER_APIS = {
  'netflix': 'https://jobs.lever.co/netflix',
  'shopify': 'https://jobs.lever.co/shopify',
  'palantir': 'https://jobs.lever.co/palantir',
  'scale': 'https://jobs.lever.co/scaleai',
};

async function scrapeGreenhouseJobs(company: string): Promise<JobListing[]> {
  const apiUrl = GREENHOUSE_APIS[company as keyof typeof GREENHOUSE_APIS];
  if (!apiUrl) return [];

  try {
    const response = await fetch(apiUrl);
    if (!response.ok) return [];

    const data = await response.json();
    const jobs: JobListing[] = [];

    for (const job of data.jobs || []) {
      jobs.push({
        title: job.title,
        company: company.charAt(0).toUpperCase() + company.slice(1),
        location: job.location?.name || 'Remote',
        description: job.content || '',
        requirements: [],
        type: job.employment_type || 'Full-time',
        postedDate: job.updated_at,
        applyUrl: job.absolute_url,
        source: 'greenhouse'
      });
    }

    return jobs;
  } catch (error) {
    console.error(`Error fetching Greenhouse jobs for ${company}:`, error);
    return [];
  }
}

async function scrapeLeverJobs(company: string): Promise<JobListing[]> {
  const baseUrl = LEVER_APIS[company as keyof typeof LEVER_APIS];
  if (!baseUrl) return [];

  try {
    const response = await fetch(baseUrl);
    if (!response.ok) return [];

    const html = await response.text();
    const $ = cheerio.load(html);
    const jobs: JobListing[] = [];

    $('.posting').each((_, element) => {
      const $el = $(element);
      const title = $el.find('.posting-title h5').text().trim();
      const location = $el.find('.posting-categories .location').text().trim();
      const team = $el.find('.posting-categories .team').text().trim();
      const commitment = $el.find('.posting-categories .commitment').text().trim();
      const applyUrl = $el.find('a.posting-btn-submit').attr('href') || '';

      if (title) {
        jobs.push({
          title,
          company: company.charAt(0).toUpperCase() + company.slice(1),
          location: location || 'Not specified',
          description: team ? `Team: ${team}` : '',
          requirements: [],
          type: commitment || 'Full-time',
          applyUrl: applyUrl.startsWith('http') ? applyUrl : `${baseUrl}${applyUrl}`,
          source: 'lever'
        });
      }
    });

    return jobs;
  } catch (error) {
    console.error(`Error fetching Lever jobs for ${company}:`, error);
    return [];
  }
}

async function scrapeCompanyWebsite(company: string, url: string): Promise<JobListing[]> {
  try {
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      }
    });

    if (!response.ok) return [];

    const html = await response.text();
    const $ = cheerio.load(html);
    const jobs: JobListing[] = [];

    // Generic job listing selectors that work across many sites
    const selectors = [
      '.job-listing',
      '.career-opportunity',
      '.job-item',
      '.careers-position',
      '[data-job]',
      '.job-card',
      '.opportunity-card'
    ];

    for (const selector of selectors) {
      $(selector).each((_, element) => {
        const $el = $(element);
        const title = $el.find('h2, h3, h4, .title, .job-title').first().text().trim();
        const location = $el.find('.location, .job-location, [data-location]').first().text().trim();
        const description = $el.find('.description, .summary, p').first().text().trim();

        if (title) {
          jobs.push({
            title,
            company,
            location: location || 'Remote',
            description: description || 'See full description on company website',
            requirements: [],
            type: 'Full-time',
            applyUrl: url,
            source: 'company-website'
          });
        }
      });

      if (jobs.length > 0) break; // Stop if we found jobs with this selector
    }

    return jobs;
  } catch (error) {
    console.error(`Error scraping ${company} website:`, error);
    return [];
  }
}

async function searchIndeedAPI(query: string, location?: string): Promise<JobListing[]> {
  // Note: Indeed requires API key - this is a placeholder for the structure
  // You'd need to sign up for Indeed Publisher API
  const INDEED_API_KEY = process.env.INDEED_API_KEY;

  if (!INDEED_API_KEY) {
    console.log('Indeed API key not configured');
    return [];
  }

  try {
    const params = new URLSearchParams({
      q: query,
      l: location || 'United States',
      limit: '25',
      format: 'json',
      v: '2'
    });

    const response = await fetch(`https://api.indeed.com/ads/apisearch?${params}`, {
      headers: {
        'Authorization': `Bearer ${INDEED_API_KEY}`
      }
    });

    if (!response.ok) return [];

    const data = await response.json();
    const jobs: JobListing[] = [];

    for (const job of data.results || []) {
      jobs.push({
        title: job.jobtitle,
        company: job.company,
        location: job.formattedLocation,
        description: job.snippet,
        requirements: [],
        salary: job.salary,
        type: job.fullTime ? 'Full-time' : 'Part-time',
        postedDate: job.date,
        applyUrl: job.url,
        source: 'indeed'
      });
    }

    return jobs;
  } catch (error) {
    console.error('Error fetching Indeed jobs:', error);
    return [];
  }
}

export const advancedJobSearchTool = tool({
  description: 'Advanced job search that scrapes real job listings from company websites and job boards',
  inputSchema: z.object({
    companies: z.array(z.string()).optional().describe('Specific companies to search'),
    query: z.string().optional().describe('Job search query'),
    location: z.string().optional().describe('Job location'),
    jobType: z.enum(['internship', 'full-time', 'part-time', 'contract']).optional(),
    experienceLevel: z.enum(['entry', 'mid', 'senior', 'executive']).optional(),
    limit: z.number().optional().default(20)
  }),
  execute: async ({ companies = [], query, location, jobType, experienceLevel, limit = 20 }) => {
    console.log('Advanced job search:', { companies, query, location, jobType });

    const allJobs: JobListing[] = [];
    const searchPromises: Promise<JobListing[]>[] = [];

    // Search specific companies if provided
    if (companies.length > 0) {
      for (const company of companies) {
        const companyLower = company.toLowerCase().replace(/\s+/g, '');

        // Check if company uses Greenhouse
        if (GREENHOUSE_APIS[companyLower as keyof typeof GREENHOUSE_APIS]) {
          searchPromises.push(scrapeGreenhouseJobs(companyLower));
        }
        // Check if company uses Lever
        else if (LEVER_APIS[companyLower as keyof typeof LEVER_APIS]) {
          searchPromises.push(scrapeLeverJobs(companyLower));
        }
        // Check if we have a direct career page URL
        else if (CAREER_PAGES[companyLower]) {
          searchPromises.push(scrapeCompanyWebsite(company, CAREER_PAGES[companyLower].url));
        }
      }
    }

    // Also search Indeed if query is provided
    if (query) {
      searchPromises.push(searchIndeedAPI(query, location));
    }

    // Execute all searches in parallel
    const results = await Promise.all(searchPromises);
    for (const jobList of results) {
      allJobs.push(...jobList);
    }

    // Filter based on job type and experience level
    let filteredJobs = [...allJobs];

    if (jobType) {
      filteredJobs = filteredJobs.filter(job => {
        const jobTypeLower = job.type.toLowerCase();
        if (jobType === 'internship') return jobTypeLower.includes('intern');
        if (jobType === 'full-time') return jobTypeLower.includes('full');
        if (jobType === 'part-time') return jobTypeLower.includes('part');
        if (jobType === 'contract') return jobTypeLower.includes('contract');
        return true;
      });
    }

    if (experienceLevel) {
      filteredJobs = filteredJobs.filter(job => {
        const titleLower = job.title.toLowerCase();
        if (experienceLevel === 'entry') {
          return titleLower.includes('junior') || titleLower.includes('entry') ||
                 titleLower.includes('new grad') || titleLower.includes('associate');
        }
        if (experienceLevel === 'mid') {
          return !titleLower.includes('senior') && !titleLower.includes('principal') &&
                 !titleLower.includes('junior') && !titleLower.includes('intern');
        }
        if (experienceLevel === 'senior') {
          return titleLower.includes('senior') || titleLower.includes('lead') ||
                 titleLower.includes('principal') || titleLower.includes('staff');
        }
        if (experienceLevel === 'executive') {
          return titleLower.includes('director') || titleLower.includes('vp') ||
                 titleLower.includes('head of') || titleLower.includes('chief');
        }
        return true;
      });
    }

    // Limit results
    const finalJobs = filteredJobs.slice(0, limit);

    // Group by source for summary
    const jobsBySource = finalJobs.reduce((acc, job) => {
      acc[job.source] = (acc[job.source] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return {
      success: true,
      totalJobs: finalJobs.length,
      jobsBySource,
      jobs: finalJobs.map(job => ({
        ...job,
        // Clean up description for display
        description: job.description.substring(0, 200) + (job.description.length > 200 ? '...' : '')
      })),
      message: `Found ${finalJobs.length} real job listings from ${Object.keys(jobsBySource).length} sources`,
      sources: Object.keys(jobsBySource),
      searchCriteria: { companies, query, location, jobType, experienceLevel }
    };
  }
});