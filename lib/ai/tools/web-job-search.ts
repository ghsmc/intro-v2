// Web Job Search Tool - Real-time job search using Serper API and LLM intelligence
import { z } from 'zod';
import { tool } from 'ai';
import { generateText } from 'ai';
import { myProvider } from '@/lib/ai/providers';

// Types for Serper API
interface SerperSearchResult {
  organic: Array<{
    title: string;
    link: string;
    snippet: string;
    date?: string;
    sitelinks?: Array<{
      title: string;
      link: string;
    }>;
  }>;
  answerBox?: {
    answer: string;
    snippet: string;
    title: string;
  };
  knowledgeGraph?: {
    title: string;
    description: string;
    attributes?: Record<string, string>;
  };
}

interface JobListing {
  title: string;
  company: string;
  location: string;
  url: string;
  description: string;
  salary?: string;
  postedDate?: string;
  source: string;
  sourceDomain?: string;
  requirements?: string[];
  type?: string;
  experience?: string;
  remote?: boolean;
  matchReasons?: string[];
  relevanceScore?: number;
}

// LLM-powered query builder with deep profile integration
class IntelligentQueryBuilder {
  async buildSearchQueries(
    userQuery: string,
    userProfile?: {
      name?: string;
      skills?: string[];
      experience?: string;
      location?: string;
      preferences?: string[];
      major?: string;
      classYear?: string;
      values?: string[];
      immediateGoal?: string;
      resumeData?: any;
      energyProfile?: any;
    }
  ): Promise<string[]> {
    try {
      const { text } = await generateText({
        model: myProvider.languageModel('chat-model'),
        prompt: `You are a job search expert. Transform this user query into optimized search queries for finding relevant job listings.

User Query: "${userQuery}"
${userProfile ? `
User Profile:
- Name: ${userProfile.name || 'Not specified'}
- Major: ${userProfile.major || 'Not specified'}
- Class Year: ${userProfile.classYear || 'Not specified'}
- Skills: ${userProfile.skills?.join(', ') || 'Not specified'}
- Values: ${userProfile.values?.join(', ') || 'Not specified'}
- Immediate Goal: ${userProfile.immediateGoal || 'Not specified'}
- Energy Profile: ${userProfile.energyProfile ? JSON.stringify(userProfile.energyProfile) : 'Not specified'}
- Experience: ${userProfile.experience || 'Not specified'}
- Location: ${userProfile.location || 'Any'}
- Preferences: ${userProfile.preferences?.join(', ') || 'Not specified'}
${userProfile.resumeData ? `- Resume highlights: ${JSON.stringify(userProfile.resumeData).substring(0, 200)}` : ''}
` : ''}

Generate 3-5 different search queries that will find the most relevant job listings. Consider:
1. Direct job title searches
2. Company-specific searches if mentioned
3. Skill-based searches
4. Industry/domain searches
5. Location-specific searches if relevant

For ML/AI roles, include variations like "machine learning engineer", "ML engineer", "AI engineer", "deep learning", etc.
For specific companies like OpenAI, include "OpenAI careers", "OpenAI jobs", "jobs at OpenAI", etc.

Return ONLY the search queries, one per line, no numbering or bullets.`,
      });

      return text.split('\n').filter(q => q.trim().length > 0);
    } catch (error) {
      console.error('Error generating search queries:', error);
      // Fallback to basic query expansion
      return this.basicQueryExpansion(userQuery);
    }
  }

  private basicQueryExpansion(query: string): string[] {
    const queries = [query];

    // Company-specific expansions
    if (query.toLowerCase().includes('openai')) {
      queries.push(
        'OpenAI careers machine learning',
        'OpenAI jobs ML engineer',
        'jobs at OpenAI',
        'OpenAI hiring'
      );
    }

    // Role-specific expansions
    if (query.match(/\b(ml|machine learning)\b/i)) {
      queries.push(
        'machine learning engineer jobs',
        'ML engineer positions',
        'AI engineer openings',
        'deep learning engineer jobs'
      );
    }

    // Add job board searches
    queries.push(
      `site:linkedin.com/jobs ${query}`,
      `site:indeed.com ${query}`,
      `site:glassdoor.com ${query}`
    );

    return queries;
  }
}

// Serper API client
class SerperClient {
  private apiKey: string;

  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

  async search(query: string): Promise<SerperSearchResult> {
    try {
      const response = await fetch('https://google.serper.dev/search', {
        method: 'POST',
        headers: {
          'X-API-KEY': this.apiKey,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          q: query,
          gl: 'us',
          hl: 'en',
          num: 20,
          autocorrect: true,
        }),
      });

      if (!response.ok) {
        throw new Error(`Serper API error: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Serper search error:', error);
      throw error;
    }
  }

  async searchJobs(query: string): Promise<SerperSearchResult> {
    try {
      const response = await fetch('https://google.serper.dev/jobs', {
        method: 'POST',
        headers: {
          'X-API-KEY': this.apiKey,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          q: query,
          location: 'United States',
          gl: 'us',
          hl: 'en',
          num: 20,
        }),
      });

      if (!response.ok) {
        // Fallback to regular search if jobs endpoint fails
        return this.search(`${query} jobs hiring`);
      }

      return await response.json();
    } catch (error) {
      console.error('Serper jobs search error:', error);
      // Fallback to regular search
      return this.search(`${query} jobs hiring`);
    }
  }
}

// Job result processor with LLM
class JobResultProcessor {
  async processSearchResults(
    results: SerperSearchResult[],
    originalQuery: string
  ): Promise<JobListing[]> {
    const allResults: JobListing[] = [];

    for (const searchResult of results) {
      if (searchResult.organic) {
        for (const result of searchResult.organic) {
          // Check if this looks like a job listing
          if (this.isLikelyJobListing(result.title, result.snippet)) {
            const job = await this.extractJobInfo(result, originalQuery);
            if (job) {
              allResults.push(job);
            }
          }
        }
      }
    }

    // Deduplicate by URL
    const uniqueJobs = this.deduplicateJobs(allResults);

    // Rank jobs by relevance
    return this.rankJobsByRelevance(uniqueJobs, originalQuery);
  }

  private isLikelyJobListing(title: string, snippet: string): boolean {
    const jobKeywords = [
      'hiring', 'job', 'position', 'opening', 'career', 'opportunity',
      'engineer', 'developer', 'scientist', 'analyst', 'manager',
      'apply', 'join', 'seeking', 'looking for', 'we are hiring'
    ];

    const text = `${title} ${snippet}`.toLowerCase();
    return jobKeywords.some(keyword => text.includes(keyword));
  }

  private async extractJobInfo(
    result: any,
    query: string
  ): Promise<JobListing | null> {
    try {
      // Use LLM to extract structured job information
      const { text } = await generateText({
        model: myProvider.languageModel('chat-model'),
        prompt: `Extract job information from this search result. If it's not a job listing, return "NOT_A_JOB".

Title: ${result.title}
URL: ${result.link}
Snippet: ${result.snippet}
Query: ${query}

Extract and return in this exact format (use "Unknown" if not found):
COMPANY: [company name]
TITLE: [job title]
LOCATION: [location or "Remote"]
TYPE: [full-time/part-time/contract/internship]
EXPERIENCE: [entry/mid/senior/Unknown]
SALARY: [salary info or "Not specified"]
POSTED: [date or "Unknown"]

If this is not a job listing, just return: NOT_A_JOB`,
        temperature: 0.3,
      });

      if (text.includes('NOT_A_JOB')) {
        return null;
      }

      // Parse the LLM response
      const lines = text.split('\n');
      const extracted: any = {};

      lines.forEach(line => {
        const [key, value] = line.split(':').map(s => s.trim());
        if (key && value) {
          extracted[key.toLowerCase()] = value;
        }
      });

      const domain = new URL(result.link).hostname;
      return {
        title: extracted.title || result.title,
        company: extracted.company || 'Unknown',
        location: extracted.location || 'Not specified',
        url: result.link,
        description: result.snippet,
        salary: extracted.salary,
        postedDate: extracted.posted,
        source: domain,
        sourceDomain: domain.replace('www.', ''),
        type: extracted.type,
        experience: extracted.experience,
        remote: extracted.location?.toLowerCase().includes('remote') || false,
      };
    } catch (error) {
      console.error('Error extracting job info:', error);

      // Fallback to basic extraction
      return {
        title: result.title,
        company: this.extractCompanyFromTitle(result.title),
        location: 'Not specified',
        url: result.link,
        description: result.snippet,
        source: new URL(result.link).hostname,
      };
    }
  }

  private extractCompanyFromTitle(title: string): string {
    // Common patterns: "Job Title at Company" or "Company - Job Title"
    const atPattern = / at ([^-|]+)/i;
    const dashPattern = /^([^-|]+) - /;

    const atMatch = title.match(atPattern);
    if (atMatch) return atMatch[1].trim();

    const dashMatch = title.match(dashPattern);
    if (dashMatch) return dashMatch[1].trim();

    return 'Unknown';
  }

  private deduplicateJobs(jobs: JobListing[]): JobListing[] {
    const seen = new Set<string>();
    return jobs.filter(job => {
      const key = job.url;
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });
  }

  private async rankJobsByRelevance(
    jobs: JobListing[],
    query: string
  ): Promise<JobListing[]> {
    // Use LLM to score relevance
    try {
      const jobDescriptions = jobs.map((job, idx) =>
        `[${idx}] ${job.title} at ${job.company} - ${job.description.substring(0, 100)}`
      ).join('\n');

      const { text } = await generateText({
        model: myProvider.languageModel('chat-model'),
        prompt: `Rank these job listings by relevance to the query: "${query}"

${jobDescriptions}

Return just the indices in order of relevance (most relevant first), comma-separated.
For example: 2,0,4,1,3`,
        temperature: 0.3,
      });

      const order = text.split(',').map(s => Number.parseInt(s.trim())).filter(n => !Number.isNaN(n));

      if (order.length > 0) {
        const ranked: JobListing[] = [];
        order.forEach(idx => {
          if (jobs[idx]) ranked.push(jobs[idx]);
        });

        // Add any jobs that weren't ranked
        jobs.forEach((job, idx) => {
          if (!order.includes(idx)) {
            ranked.push(job);
          }
        });

        return ranked;
      }
    } catch (error) {
      console.error('Error ranking jobs:', error);
    }

    // Fallback: return as-is
    return jobs;
  }
}

// Generate formatted response with inline citations
async function generateFormattedResponse(
  jobs: JobListing[],
  query: string,
  userProfile: any
): Promise<string> {
  try {
    const topJobs = jobs.slice(0, 5);

    const { text } = await generateText({
      model: myProvider.languageModel('chat-model'),
      prompt: `Generate a personalized job search response for this user.

User Profile:
- Name: ${userProfile.name || 'the user'}
- Major: ${userProfile.major || 'Not specified'}
- Class Year: ${userProfile.classYear || 'Not specified'}
- Skills: ${userProfile.skills?.join(', ') || 'Not specified'}
- Values: ${userProfile.values?.join(', ') || 'Not specified'}
- Immediate Goal: ${userProfile.immediateGoal || 'Not specified'}

Query: "${query}"

Jobs Found:
${topJobs.map((job, idx) => `
${idx + 1}. ${job.title} at ${job.company}
   Location: ${job.location}
   Salary: ${job.salary || 'Not specified'}
   Source: ${job.sourceDomain}
   URL: ${job.url}
   Description: ${job.description}
`).join('\n')}

Generate a personalized response that:
1. Addresses the user by name if available
2. Explains why each job matches their profile (skills, values, goals)
3. Includes salary information when available
4. Uses inline citations in this format: **[Job Title](domain.com)**
5. Provides actionable next steps
6. Is encouraging and personalized

Keep the response concise but informative. Focus on the top 3-4 most relevant opportunities.`,
      temperature: 0.7,
    });

    // Format citations to ensure they're clickable
    let formattedText = text;

    // Replace markdown links with proper HTML-like format that the UI can parse
    topJobs.forEach(job => {
      const domain = job.sourceDomain || new URL(job.url).hostname.replace('www.', '');
      // Replace various citation formats with consistent inline citation
      formattedText = formattedText.replace(
        new RegExp(`\\*\\*\\[?${job.title.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\]?\\(?${domain}\\)?\\*\\*`, 'gi'),
        `**${job.title}** <cite>${domain}</cite>`
      );
      formattedText = formattedText.replace(
        new RegExp(`\\[${job.title.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\]\\(${domain}\\)`, 'gi'),
        `**${job.title}** <cite>${domain}</cite>`
      );
    });

    return formattedText;
  } catch (error) {
    console.error('Error generating formatted response:', error);

    // Fallback to a simple formatted list
    const topJobs = jobs.slice(0, 3);
    return `Based on your search for "${query}", here are the top opportunities:\n\n${
      topJobs.map(job =>
        `• **${job.title}** at ${job.company} <cite>${job.sourceDomain || 'source'}</cite>\n  ${job.location}${job.salary ? ` • ${job.salary}` : ''}`
      ).join('\n\n')
    }\n\nThese positions align with your background and goals. Would you like more details about any of these roles?`;
  }
}

// Generate search strategy reasoning
async function generateSearchStrategy(
  query: string,
  userProfile?: any
): Promise<string> {
  if (!userProfile) {
    return `Searching for: "${query}"`;
  }

  let strategy = "**Search Strategy:**\n\n";

  // Analyze user profile
  if (userProfile.classYear) {
    const year = parseInt(userProfile.classYear);
    const currentYear = new Date().getFullYear();
    const yearsUntilGraduation = year - currentYear;

    if (yearsUntilGraduation > 0) {
      strategy += `• **Student Status:** Currently enrolled, graduating ${year}\n`;
      if (yearsUntilGraduation >= 2) {
        strategy += `  → Focusing on summer internships and part-time opportunities\n`;
      } else {
        strategy += `  → Searching for new grad roles and final-year internships\n`;
      }
    }
  }

  if (userProfile.major) {
    strategy += `• **Academic Focus:** ${userProfile.major}\n`;
    strategy += `  → Prioritizing ${userProfile.major.toLowerCase()}-related positions\n`;
  }

  if (userProfile.skills && userProfile.skills.length > 0) {
    const topSkills = userProfile.skills.slice(0, 5).join(', ');
    strategy += `• **Technical Skills:** ${topSkills}\n`;
    strategy += `  → Matching roles requiring these competencies\n`;
  }

  if (userProfile.values && userProfile.values.length > 0) {
    strategy += `• **Values:** ${userProfile.values.slice(0, 3).join(', ')}\n`;
    strategy += `  → Identifying companies with aligned culture\n`;
  }

  if (userProfile.immediateGoal) {
    strategy += `• **Goal:** ${userProfile.immediateGoal}\n`;
    strategy += `  → Tailoring search to this objective\n`;
  }

  // Parse the query for specific intent
  const queryLower = query.toLowerCase();
  if (queryLower.includes('internship') || queryLower.includes('summer')) {
    strategy += `\n**Search Focus:** Summer internship programs\n`;
  } else if (queryLower.includes('part-time') || queryLower.includes('part time')) {
    strategy += `\n**Search Focus:** Part-time opportunities during academic term\n`;
  } else if (queryLower.includes('new grad') || queryLower.includes('entry level')) {
    strategy += `\n**Search Focus:** Entry-level and new graduate positions\n`;
  }

  strategy += `\nSearching now...`;
  return strategy;
}

// Main web job search function with enhanced profile matching
async function performWebJobSearch(
  query: string,
  options: {
    limit?: number;
    userProfile?: any;
    includeRemote?: boolean;
    experienceLevel?: string;
  } = {}
): Promise<{
  jobs: JobListing[];
  formattedResponse?: string;
  searchStrategy?: string;
  searchMetadata: {
    totalResults: number;
    queries: string[];
    sources: string[];
  };
}> {
  const serperApiKey = process.env.SERPER_API_KEY;

  if (!serperApiKey) {
    throw new Error('SERPER_API_KEY environment variable is required');
  }

  const queryBuilder = new IntelligentQueryBuilder();
  const serperClient = new SerperClient(serperApiKey);
  const processor = new JobResultProcessor();

  try {
    // Generate search strategy
    const searchStrategy = await generateSearchStrategy(query, options.userProfile);

    // Generate intelligent search queries
    const searchQueries = await queryBuilder.buildSearchQueries(query, options.userProfile);

    console.log('🔍 Searching with queries:', searchQueries);

    // Execute searches in parallel
    const searchPromises = searchQueries.map(q => serperClient.searchJobs(q));
    const searchResults = await Promise.all(searchPromises);

    // Process and extract job listings
    const jobs = await processor.processSearchResults(searchResults, query);

    // Apply filters if specified
    let filteredJobs = jobs;

    if (options.includeRemote === false) {
      filteredJobs = filteredJobs.filter(job => !job.remote);
    }

    if (options.experienceLevel) {
      filteredJobs = filteredJobs.filter(job =>
        !job.experience || job.experience.toLowerCase() === options.experienceLevel?.toLowerCase()
      );
    }

    // Limit results
    const limitedJobs = filteredJobs.slice(0, options.limit || 20);

    // Get unique sources
    const sources = [...new Set(limitedJobs.map(job => job.source))];

    // Generate formatted response with inline citations
    let formattedResponse = '';
    if (limitedJobs.length > 0 && options.userProfile) {
      formattedResponse = await generateFormattedResponse(limitedJobs, query, options.userProfile);
    }

    return {
      jobs: limitedJobs,
      formattedResponse,
      searchStrategy,
      searchMetadata: {
        totalResults: limitedJobs.length,
        queries: searchQueries,
        sources: sources,
      },
    };
  } catch (error) {
    console.error('Web job search error:', error);
    throw error;
  }
}

// Export the tool
export const webJobSearchTool = tool({
  description: `Advanced web-based job search using Serper API and LLM intelligence.

  This tool:
  - Uses AI to generate multiple optimized search queries
  - Searches across the entire web including job boards, company sites, and aggregators
  - Extracts structured job information using LLM
  - Ranks results by relevance
  - Provides real-time, up-to-date job listings

  Perfect for finding jobs at specific companies (like OpenAI) or in specific fields (like ML engineering).`,

  inputSchema: z.object({
    query: z.string().describe('The job search query (e.g., "ML engineer at OpenAI", "machine learning jobs San Francisco")'),
    limit: z.number().optional().default(20).describe('Maximum number of results to return'),
    includeRemote: z.boolean().optional().default(true).describe('Include remote positions'),
    experienceLevel: z.enum(['entry', 'mid', 'senior', 'any']).optional().default('any').describe('Filter by experience level'),
    userProfile: z.object({
      name: z.string().optional().describe('User name'),
      major: z.string().optional().describe('Academic major'),
      classYear: z.string().optional().describe('Graduation year'),
      skills: z.array(z.string()).optional().describe('User skills for better matching'),
      experience: z.string().optional().describe('Years of experience'),
      location: z.string().optional().describe('Preferred location'),
      preferences: z.array(z.string()).optional().describe('Job preferences'),
      values: z.array(z.string()).optional().describe('Personal values'),
      immediateGoal: z.string().optional().describe('Immediate career goal'),
      energyProfile: z.any().optional().describe('Energy and work style profile'),
      resumeData: z.any().optional().describe('Resume information'),
    }).optional().describe('User profile for personalized search'),
  }),

  execute: async ({ query, limit = 20, includeRemote = true, experienceLevel = 'any', userProfile }) => {
    try {
      const result = await performWebJobSearch(query, {
        limit,
        userProfile,
        includeRemote,
        experienceLevel: experienceLevel === 'any' ? undefined : experienceLevel,
      });

      // If we have a formatted response, return it as the message
      const message = result.formattedResponse ||
        `Found ${result.jobs.length} job opportunities matching "${query}"`;

      // Prepend the search strategy to the message if it exists
      const fullMessage = result.searchStrategy
        ? `${result.searchStrategy}\n\n---\n\n${message}`
        : message;

      return {
        success: true,
        ...result,
        message: fullMessage,
        reasoning: result.searchStrategy,
      };
    } catch (error) {
      console.error('Web job search tool error:', error);

      return {
        success: false,
        jobs: [],
        searchMetadata: {
          totalResults: 0,
          queries: [],
          sources: [],
        },
        error: error instanceof Error ? error.message : 'An error occurred during web job search',
      };
    }
  },
});

export default webJobSearchTool;