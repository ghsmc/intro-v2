// Intelligent Job Search Tool - Database-driven search with AI-powered matching
import { z } from 'zod';
import { tool } from 'ai';
import {
  searchJobs,
  getRecommendedJobs,
  trackJobInteraction,
  type JobSearchParams,
} from '@/lib/db/queries/jobs';
import { getCompanies } from '@/lib/db/queries/companies';

// Types
export interface JobResult {
  id: string;
  title: string;
  company: string;
  companyId: string;
  location: string | null;
  locationCity: string | null;
  remoteType: string | null;
  url: string | null;
  description: string;
  salary?: string | null;
  salaryMin?: number | null;
  salaryMax?: number | null;
  posted: string;
  source: string | null;
  matchScore?: number;
  requirements?: string[];
  responsibilities?: string[];
  skills?: string[];
  benefits?: string[];
  level?: string | null;
  type: string;
}

// Query expansion for intelligent searching
class QueryExpander {
  expand(query: string): string[] {
    // Handle empty or undefined query
    if (!query || typeof query !== 'string') {
      return [];
    }

    const queries = [query];

    // Company variations
    if (query.match(/\b(meta|facebook)\b/i)) {
      queries.push('Meta', 'Facebook', 'Meta Platforms');
    }
    if (query.match(/\b(google|alphabet)\b/i)) {
      queries.push('Google', 'Alphabet', 'Google LLC');
    }
    if (query.match(/\bopenai\b/i)) {
      queries.push('OpenAI', 'Open AI');
    }

    // Role variations
    if (query.match(/\b(swe|software engineer)\b/i)) {
      queries.push('software engineer', 'software developer', 'SDE', 'backend engineer', 'frontend engineer');
    }
    if (query.match(/\b(mle|ml engineer|machine learning)\b/i)) {
      queries.push('machine learning engineer', 'ML engineer', 'AI engineer', 'deep learning engineer');
    }
    if (query.match(/\b(pm|product manager)\b/i)) {
      queries.push('product manager', 'PM', 'senior PM', 'product owner');
    }
    if (query.match(/\b(data scientist|ds)\b/i)) {
      queries.push('data scientist', 'data analyst', 'analytics engineer', 'data engineer');
    }

    // Tech stack variations
    if (query.match(/\breact\b/i)) {
      queries.push('React', 'React.js', 'ReactJS', 'React Native');
    }
    if (query.match(/\bpython\b/i)) {
      queries.push('Python', 'Django', 'Flask', 'FastAPI');
    }
    if (query.match(/\bnode\b/i)) {
      queries.push('Node.js', 'NodeJS', 'Express', 'NestJS');
    }

    return [...new Set(queries)];
  }
}

// Skills extraction
class SkillsExtractor {
  private techSkills = new Set([
    'javascript', 'typescript', 'python', 'java', 'c++', 'go', 'rust',
    'react', 'angular', 'vue', 'svelte', 'next.js', 'node.js',
    'django', 'flask', 'fastapi', 'spring', 'express',
    'aws', 'azure', 'gcp', 'docker', 'kubernetes',
    'postgresql', 'mysql', 'mongodb', 'redis', 'elasticsearch',
    'machine learning', 'deep learning', 'nlp', 'computer vision',
    'tensorflow', 'pytorch', 'scikit-learn', 'pandas', 'numpy'
  ]);

  extract(query: string): string[] {
    if (!query || typeof query !== 'string') {
      return [];
    }

    const words = query.toLowerCase().split(/\s+/);
    const skills: string[] = [];

    for (const word of words) {
      if (this.techSkills.has(word)) {
        skills.push(word);
      }
    }

    // Check for multi-word skills
    const lowerQuery = query.toLowerCase();
    for (const skill of this.techSkills) {
      if (skill.includes(' ') && lowerQuery.includes(skill)) {
        skills.push(skill);
      }
    }

    return [...new Set(skills)];
  }
}

// Location parser
class LocationParser {
  parse(query: string): { locations: string[]; remote: boolean } {
    const locations: string[] = [];
    let remote = false;

    if (!query || typeof query !== 'string') {
      return { locations, remote };
    }

    // Check for remote work
    if (query.match(/\b(remote|wfh|work from home)\b/i)) {
      remote = true;
    }

    // Extract city names (simplified - in production, use a proper geocoding service)
    const cities = [
      'San Francisco', 'SF', 'Bay Area', 'Silicon Valley',
      'New York', 'NYC', 'Manhattan',
      'Seattle', 'Austin', 'Boston', 'Chicago',
      'Los Angeles', 'LA', 'Denver', 'Portland'
    ];

    for (const city of cities) {
      if (query.toLowerCase().includes(city.toLowerCase())) {
        locations.push(city);
      }
    }

    return { locations, remote };
  }
}

// Level detector
class LevelDetector {
  detect(query: string): string[] {
    const levels: string[] = [];

    if (!query || typeof query !== 'string') {
      return levels;
    }

    if (query.match(/\b(junior|jr|entry|intern)\b/i)) {
      levels.push('entry', 'junior', 'intern');
    }
    if (query.match(/\b(mid|middle)\b/i)) {
      levels.push('mid', 'middle');
    }
    if (query.match(/\b(senior|sr)\b/i)) {
      levels.push('senior', 'lead');
    }
    if (query.match(/\b(staff|principal|architect)\b/i)) {
      levels.push('staff', 'principal', 'architect');
    }
    if (query.match(/\b(manager|director|vp)\b/i)) {
      levels.push('manager', 'director', 'vp');
    }

    return levels;
  }
}

// Main job search handler
async function performJobSearch(
  query: string,
  filters: any,
  userId?: string
): Promise<{ jobs: JobResult[]; companies?: any[] }> {
  // Ensure query is a string
  const safeQuery = query || '';

  const expander = new QueryExpander();
  const skillsExtractor = new SkillsExtractor();
  const locationParser = new LocationParser();
  const levelDetector = new LevelDetector();

  // Parse the query
  const expandedQueries = expander.expand(safeQuery);
  const skills = skillsExtractor.extract(safeQuery);
  const { locations, remote } = locationParser.parse(safeQuery);
  const levels = levelDetector.detect(safeQuery);

  // Build search parameters
  const searchParams: JobSearchParams = {
    query: expandedQueries.length > 0 ? expandedQueries.join(' ') : safeQuery,
    skills: skills.length > 0 ? skills : undefined,
    locations: locations.length > 0 ? locations : filters.location ? [filters.location] : undefined,
    remoteTypes: remote ? ['remote', 'hybrid'] : filters.remoteTypes,
    levels: levels.length > 0 ? levels : filters.levels,
    types: filters.jobTypes,
    departments: filters.departments,
    salaryMin: filters.salaryMin,
    salaryMax: filters.salaryMax,
    status: 'active',
    limit: filters.limit || 20,
    sortBy: filters.sortBy || 'postedAt',
    sortOrder: filters.sortOrder || 'desc',
  };

  try {
    // Search jobs in database
    const jobs = await searchJobs(searchParams);

    // Get company details for the jobs
    const companyIds = [...new Set(jobs.map(job => job.companyId))];
    const companies = companyIds.length > 0 ? await getCompanies() : [];
    const companyMap = new Map(companies.map(c => [c.id, c]));

    // Transform results
    const results: JobResult[] = jobs.map(job => {
      const company = companyMap.get(job.companyId);

      return {
        id: job.id,
        title: job.title,
        company: company?.name || 'Unknown Company',
        companyId: job.companyId,
        location: job.location,
        locationCity: job.locationCity,
        remoteType: job.remoteType,
        url: job.applicationUrl || company?.jobsUrl || null,
        description: job.description,
        salary: job.salaryMin && job.salaryMax
          ? `$${job.salaryMin.toLocaleString()} - $${job.salaryMax.toLocaleString()}`
          : job.salaryMin
          ? `$${job.salaryMin.toLocaleString()}+`
          : job.salaryMax
          ? `Up to $${job.salaryMax.toLocaleString()}`
          : null,
        salaryMin: job.salaryMin,
        salaryMax: job.salaryMax,
        posted: job.postedAt.toISOString(),
        source: job.source,
        requirements: job.requirements as string[] || [],
        responsibilities: job.responsibilities as string[] || [],
        skills: job.skills as string[] || [],
        benefits: job.benefits as string[] || [],
        level: job.level,
        type: job.type,
        matchScore: calculateMatchScore(job, searchParams),
      };
    });

    // Track interactions if userId provided
    if (userId && results.length > 0) {
      // Track first 5 job views
      await Promise.all(
        results.slice(0, 5).map(job =>
          trackJobInteraction(userId, job.id, 'viewed', {
            query,
            filters,
          })
        )
      );
    }

    // Get recommended jobs if no results found
    if (results.length === 0 && userId) {
      const recommended = await getRecommendedJobs(userId, 10);
      const recommendedResults: JobResult[] = recommended.map(job => {
        const company = companyMap.get(job.companyId);

        return {
          id: job.id,
          title: job.title,
          company: company?.name || 'Unknown Company',
          companyId: job.companyId,
          location: job.location,
          locationCity: job.locationCity,
          remoteType: job.remoteType,
          url: job.applicationUrl || company?.jobsUrl || null,
          description: job.description,
          salary: job.salaryMin && job.salaryMax
            ? `$${job.salaryMin.toLocaleString()} - $${job.salaryMax.toLocaleString()}`
            : null,
          salaryMin: job.salaryMin,
          salaryMax: job.salaryMax,
          posted: job.postedAt.toISOString(),
          source: job.source,
          requirements: job.requirements as string[] || [],
          responsibilities: job.responsibilities as string[] || [],
          skills: job.skills as string[] || [],
          benefits: job.benefits as string[] || [],
          level: job.level,
          type: job.type,
          matchScore: 0,
        };
      });

      return {
        jobs: recommendedResults,
        companies: companies.filter(c => recommendedResults.some(j => j.companyId === c.id)),
      };
    }

    return {
      jobs: results.sort((a, b) => (b.matchScore || 0) - (a.matchScore || 0)),
      companies: companies.filter(c => results.some(j => j.companyId === c.id)),
    };
  } catch (error) {
    console.error('Job search error:', error);

    // Return empty results on error
    return {
      jobs: [],
      companies: [],
    };
  }
}

// Calculate match score based on search criteria
function calculateMatchScore(job: any, params: JobSearchParams): number {
  let score = 0;

  // Query match in title (highest weight)
  if (params.query && job.title.toLowerCase().includes(params.query.toLowerCase())) {
    score += 30;
  }

  // Query match in description
  if (params.query && job.description.toLowerCase().includes(params.query.toLowerCase())) {
    score += 10;
  }

  // Skills match
  if (params.skills && job.skills) {
    const jobSkills = (job.skills as string[]).map(s => s.toLowerCase());
    const matchedSkills = params.skills.filter(skill =>
      jobSkills.includes(skill.toLowerCase())
    );
    score += matchedSkills.length * 15;
  }

  // Location match
  if (params.locations && job.location) {
    const locationMatch = params.locations.some(loc =>
      job.location.toLowerCase().includes(loc.toLowerCase())
    );
    if (locationMatch) score += 20;
  }

  // Remote type match
  if (params.remoteTypes && job.remoteType) {
    if (params.remoteTypes.includes(job.remoteType)) {
      score += 15;
    }
  }

  // Level match
  if (params.levels && job.level) {
    if (params.levels.includes(job.level)) {
      score += 20;
    }
  }

  // Salary range match
  if (params.salaryMin && job.salaryMax && job.salaryMax >= params.salaryMin) {
    score += 10;
  }
  if (params.salaryMax && job.salaryMin && job.salaryMin <= params.salaryMax) {
    score += 10;
  }

  // Freshness bonus (posted recently)
  const daysAgo = (Date.now() - new Date(job.postedAt).getTime()) / (1000 * 60 * 60 * 24);
  if (daysAgo <= 1) score += 15;
  else if (daysAgo <= 3) score += 10;
  else if (daysAgo <= 7) score += 5;

  // Featured job bonus
  if (job.featured) score += 10;

  return Math.min(100, score);
}

// Export the tool
export const jobSearchTool = tool({
  description: `Search for job opportunities using advanced filtering and AI-powered matching.
  The tool searches through a comprehensive job database with intelligent query expansion and skill matching.

  Features:
  - Smart query understanding (automatically detects companies, roles, skills, locations)
  - Multi-criteria filtering (location, salary, level, remote options)
  - Skill-based matching
  - Real-time results from database
  - Match scoring to rank results by relevance`,

  inputSchema: z.object({
    query: z.string().describe('The job search query (e.g., "machine learning engineer at OpenAI", "remote React developer", "product manager in NYC")'),
    filters: z.object({
      location: z.string().optional().describe('Specific location to filter by'),
      remoteTypes: z.array(z.enum(['remote', 'hybrid', 'onsite'])).optional().describe('Remote work preferences'),
      salaryMin: z.number().optional().describe('Minimum salary expectation'),
      salaryMax: z.number().optional().describe('Maximum salary expectation'),
      jobTypes: z.array(z.enum(['full-time', 'part-time', 'contract', 'internship'])).optional().describe('Employment type preferences'),
      levels: z.array(z.enum(['entry', 'junior', 'mid', 'senior', 'lead', 'staff', 'principal', 'manager', 'director'])).optional().describe('Experience level filters'),
      departments: z.array(z.string()).optional().describe('Department preferences (engineering, product, design, etc.)'),
      limit: z.number().optional().default(20).describe('Maximum number of results to return'),
      sortBy: z.enum(['postedAt', 'salary', 'relevance']).optional().default('relevance').describe('How to sort results'),
      sortOrder: z.enum(['asc', 'desc']).optional().default('desc').describe('Sort order'),
    }).optional().default({}),
    userId: z.string().optional().describe('User ID for personalized results and interaction tracking'),
  }),

  execute: async ({ query, filters = {}, userId }) => {
    try {
      const results = await performJobSearch(query, filters, userId);

      // Format the response
      const response = {
        success: true,
        query,
        filters,
        totalResults: results.jobs.length,
        jobs: results.jobs,
        companies: results.companies,
        searchMetadata: {
          timestamp: new Date().toISOString(),
          hasMoreResults: results.jobs.length >= (filters.limit || 20),
        },
      };

      return response;
    } catch (error) {
      console.error('Job search tool error:', error);
      return {
        success: false,
        query,
        filters,
        totalResults: 0,
        jobs: [],
        companies: [],
        error: error instanceof Error ? error.message : 'An error occurred during job search',
      };
    }
  },
});