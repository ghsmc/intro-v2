// Enhanced Job Scraper Service with Puppeteer for Dynamic Sites
import puppeteer from 'puppeteer-core';
import chromium from '@sparticuz/chromium-min';
import * as cheerio from 'cheerio';

export interface FullJobDetails {
  id: string;
  title: string;
  company: string;
  location: string;
  department?: string;
  team?: string;
  description: string;
  responsibilities: string[];
  requirements: string[];
  qualifications: string[];
  salary?: {
    min?: number;
    max?: number;
    currency?: string;
    period?: string;
  };
  benefits?: string[];
  type: 'Full-time' | 'Part-time' | 'Contract' | 'Internship';
  level: 'Entry' | 'Mid' | 'Senior' | 'Staff' | 'Principal' | 'Executive';
  remote: 'Remote' | 'Hybrid' | 'On-site';
  postedDate: string;
  applicationDeadline?: string;
  applyUrl: string;
  sourceUrl: string;
  companyInfo?: {
    size?: string;
    industry?: string;
    headquarters?: string;
    website?: string;
  };
  extractedAt: string;
}

// Browser instance for reuse
let browserInstance: any = null;

async function getBrowser() {
  if (!browserInstance) {
    // Check if running locally or on Vercel
    const isLocal = process.env.NODE_ENV === 'development';

    if (isLocal) {
      // Use regular puppeteer in development
      const puppeteerFull = await import('puppeteer');
      browserInstance = await puppeteerFull.default.launch({
        headless: true,
        args: ['--no-sandbox', '--disable-setuid-sandbox']
      });
    } else {
      // Use chromium for production/Vercel
      browserInstance = await puppeteer.launch({
        args: chromium.args,
        defaultViewport: chromium.defaultViewport,
        executablePath: await chromium.executablePath(),
        headless: chromium.headless,
      });
    }
  }
  return browserInstance;
}

export async function scrapeJobListings(url: string): Promise<FullJobDetails[]> {
  const browser = await getBrowser();
  const page = await browser.newPage();

  try {
    // Set user agent to avoid detection
    await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36');

    // Navigate to the page
    await page.goto(url, { waitUntil: 'networkidle2', timeout: 30000 });

    // Wait for common job listing elements
    await page.waitForSelector('[data-job], .job-listing, .careers-position, .job-item', {
      timeout: 5000
    }).catch(() => console.log('No standard job selectors found'));

    // Extract all job URLs
    const jobUrls = await page.evaluate(() => {
      const links: string[] = [];
      const selectors = [
        'a[href*="/jobs/"]',
        'a[href*="/careers/"]',
        'a[href*="/positions/"]',
        'a.job-link',
        '.job-listing a',
        '[data-job] a'
      ];

      selectors.forEach(selector => {
        document.querySelectorAll(selector).forEach(link => {
          const href = (link as HTMLAnchorElement).href;
          if (href && !links.includes(href)) {
            links.push(href);
          }
        });
      });

      return links.slice(0, 20); // Limit to 20 jobs for performance
    });

    const jobs: FullJobDetails[] = [];

    // Visit each job page to extract full details
    for (const jobUrl of jobUrls) {
      try {
        const jobDetails = await scrapeJobDetails(page, jobUrl);
        if (jobDetails) {
          jobs.push(jobDetails);
        }
      } catch (error) {
        console.error(`Error scraping job at ${jobUrl}:`, error);
      }
    }

    return jobs;
  } catch (error) {
    console.error('Error scraping job listings:', error);
    return [];
  } finally {
    await page.close();
  }
}

async function scrapeJobDetails(page: any, url: string): Promise<FullJobDetails | null> {
  try {
    await page.goto(url, { waitUntil: 'networkidle2', timeout: 30000 });

    // Extract job details
    const jobData = await page.evaluate((sourceUrl: string) => {
      const getText = (selector: string): string => {
        const element = document.querySelector(selector);
        return element?.textContent?.trim() || '';
      };

      const getTexts = (selector: string): string[] => {
        const elements = document.querySelectorAll(selector);
        return Array.from(elements).map(el => el.textContent?.trim() || '').filter(Boolean);
      };

      // Common selectors for job details
      const title = getText('h1') || getText('.job-title') || getText('[data-job-title]');
      const company = getText('.company-name') || getText('[data-company]') || getText('.employer');
      const location = getText('.location') || getText('[data-location]') || getText('.job-location');

      // Extract description and requirements
      const descriptionElement = document.querySelector('.job-description, .description, [data-description], article');
      const description = descriptionElement?.textContent?.trim() || '';

      // Try to extract structured data
      const responsibilities = getTexts('.responsibilities li, .duties li, [data-responsibilities] li');
      const requirements = getTexts('.requirements li, .qualifications li, [data-requirements] li');

      // Extract salary if available
      const salaryText = getText('.salary, [data-salary], .compensation');
      const salaryMatch = salaryText.match(/\$?([\d,]+)k?\s*-\s*\$?([\d,]+)k?/i);

      let salary = undefined;
      if (salaryMatch) {
        salary = {
          min: parseInt(salaryMatch[1].replace(',', '')) * (salaryText.includes('k') ? 1000 : 1),
          max: parseInt(salaryMatch[2].replace(',', '')) * (salaryText.includes('k') ? 1000 : 1),
          currency: 'USD'
        };
      }

      // Determine job type
      const fullText = document.body.textContent?.toLowerCase() || '';
      let type = 'Full-time';
      if (fullText.includes('internship') || fullText.includes('intern')) type = 'Internship';
      else if (fullText.includes('part-time') || fullText.includes('part time')) type = 'Part-time';
      else if (fullText.includes('contract')) type = 'Contract';

      // Determine level
      let level = 'Mid';
      const titleLower = title.toLowerCase();
      if (titleLower.includes('senior') || titleLower.includes('sr.')) level = 'Senior';
      else if (titleLower.includes('principal')) level = 'Principal';
      else if (titleLower.includes('staff')) level = 'Staff';
      else if (titleLower.includes('junior') || titleLower.includes('entry')) level = 'Entry';
      else if (titleLower.includes('director') || titleLower.includes('vp')) level = 'Executive';

      // Determine remote status
      let remote = 'On-site';
      if (fullText.includes('remote') || location.toLowerCase().includes('remote')) remote = 'Remote';
      else if (fullText.includes('hybrid')) remote = 'Hybrid';

      return {
        title,
        company,
        location,
        description: description.substring(0, 2000),
        responsibilities,
        requirements,
        salary,
        type,
        level,
        remote,
        sourceUrl
      };
    }, url);

    if (!jobData.title || !jobData.company) {
      return null;
    }

    return {
      id: `${jobData.company}-${jobData.title}-${Date.now()}`.replace(/\s+/g, '-').toLowerCase(),
      ...jobData,
      qualifications: jobData.requirements,
      postedDate: new Date().toISOString(),
      applyUrl: url,
      extractedAt: new Date().toISOString()
    } as FullJobDetails;
  } catch (error) {
    console.error(`Error extracting job details from ${url}:`, error);
    return null;
  }
}

// Specific scrapers for major job boards
export async function scrapeLinkedInJobs(query: string, location?: string): Promise<FullJobDetails[]> {
  const searchUrl = `https://www.linkedin.com/jobs/search/?keywords=${encodeURIComponent(query)}${
    location ? `&location=${encodeURIComponent(location)}` : ''
  }`;

  const browser = await getBrowser();
  const page = await browser.newPage();

  try {
    await page.goto(searchUrl, { waitUntil: 'networkidle2' });

    // LinkedIn specific scraping
    const jobs = await page.evaluate(() => {
      const jobCards = document.querySelectorAll('.job-card-container');
      const jobList: any[] = [];

      jobCards.forEach((card: any) => {
        const title = card.querySelector('.job-card-list__title')?.textContent?.trim();
        const company = card.querySelector('.job-card-container__company-name')?.textContent?.trim();
        const location = card.querySelector('.job-card-container__metadata-item')?.textContent?.trim();
        const link = card.querySelector('a')?.href;

        if (title && company) {
          jobList.push({ title, company, location, link });
        }
      });

      return jobList;
    });

    // Get full details for each job
    const fullJobs: FullJobDetails[] = [];
    for (const job of jobs.slice(0, 10)) {
      if (job.link) {
        const details = await scrapeJobDetails(page, job.link);
        if (details) {
          fullJobs.push(details);
        }
      }
    }

    return fullJobs;
  } finally {
    await page.close();
  }
}

export async function scrapeAngelListJobs(query: string): Promise<FullJobDetails[]> {
  const searchUrl = `https://angel.co/jobs?q=${encodeURIComponent(query)}`;

  const browser = await getBrowser();
  const page = await browser.newPage();

  try {
    await page.goto(searchUrl, { waitUntil: 'networkidle2' });

    // AngelList specific scraping
    const jobs = await page.evaluate(() => {
      const jobCards = document.querySelectorAll('[data-test="JobListingCard"]');
      const jobList: any[] = [];

      jobCards.forEach((card: any) => {
        const title = card.querySelector('[data-test="job-title"]')?.textContent?.trim();
        const company = card.querySelector('[data-test="startup-link"]')?.textContent?.trim();
        const location = card.querySelector('[data-test="job-location"]')?.textContent?.trim();
        const salary = card.querySelector('[data-test="job-salary"]')?.textContent?.trim();
        const link = card.querySelector('a')?.href;

        if (title && company) {
          jobList.push({ title, company, location, salary, link });
        }
      });

      return jobList;
    });

    // Convert to FullJobDetails format
    return jobs.map(job => ({
      id: `angellist-${job.company}-${job.title}`.replace(/\s+/g, '-').toLowerCase(),
      title: job.title,
      company: job.company,
      location: job.location || 'Not specified',
      description: 'See full details on AngelList',
      responsibilities: [],
      requirements: [],
      qualifications: [],
      type: 'Full-time',
      level: 'Mid',
      remote: job.location?.includes('Remote') ? 'Remote' : 'On-site',
      postedDate: new Date().toISOString(),
      applyUrl: job.link,
      sourceUrl: job.link,
      extractedAt: new Date().toISOString()
    }));
  } finally {
    await page.close();
  }
}

// Close browser when done
export async function closeBrowser() {
  if (browserInstance) {
    await browserInstance.close();
    browserInstance = null;
  }
}

// Export default scraper
export default {
  scrapeJobListings,
  scrapeLinkedInJobs,
  scrapeAngelListJobs,
  closeBrowser
};