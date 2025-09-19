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
  private getTargetCompanies(query: string, profile?: any): string[] {
    const companies = [];

    // Silicon Valley giants
    if (query.toLowerCase().includes('silicon valley') || query.toLowerCase().includes('bay area')) {
      companies.push('Google', 'Meta', 'Apple', 'Netflix', 'Adobe', 'Salesforce', 'Oracle', 'Intel', 'NVIDIA');
    }

    // Based on values
    if (profile?.values?.includes('intellectual_challenge')) {
      companies.push('OpenAI', 'Anthropic', 'DeepMind', 'Google Research', 'Microsoft Research');
    }
    if (profile?.values?.includes('high_earning_potential')) {
      companies.push('Jane Street', 'Two Sigma', 'Citadel', 'Goldman Sachs', 'Stripe', 'Databricks');
    }
    if (profile?.values?.includes('social_impact')) {
      companies.push('Microsoft', 'Salesforce', 'Khan Academy', 'Duolingo', 'Coursera');
    }

    // High-growth startups
    companies.push('Stripe', 'Databricks', 'Scale AI', 'Ramp', 'Notion', 'Figma', 'Canva');

    // Always include top tech
    companies.push('Amazon', 'Microsoft', 'Tesla', 'SpaceX', 'Uber', 'Airbnb');

    // Dedupe and return top companies
    return [...new Set(companies)].slice(0, 12);
  }

  private getCompanyDomain(company: string): string {
    const domainMap: Record<string, string> = {
      'Google': 'careers.google.com',
      'Meta': 'metacareers.com',
      'Apple': 'jobs.apple.com',
      'Microsoft': 'careers.microsoft.com',
      'Amazon': 'amazon.jobs',
      'Netflix': 'jobs.netflix.com',
      'OpenAI': 'openai.com/careers',
      'Anthropic': 'anthropic.com/careers',
      'Stripe': 'stripe.com/jobs',
      'Databricks': 'databricks.com/company/careers',
      'Goldman Sachs': 'goldmansachs.com/careers',
      'Jane Street': 'janestreet.com/join-jane-street',
    };
    return domainMap[company] || `${company.toLowerCase().replace(' ', '')}.com/careers`;
  }

  private getCurrentSeason(): string {
    const month = new Date().getMonth();
    if (month >= 8 || month <= 1) return 'summer';
    if (month >= 2 && month <= 4) return 'fall';
    return 'spring';
  }

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
      // Determine if this is an internship search
      const isInternship = userQuery.toLowerCase().includes('internship') ||
                           userProfile?.immediateGoal?.includes('internship') ||
                           (userProfile?.classYear && parseInt(userProfile.classYear) >= new Date().getFullYear());

      // Build a comprehensive list of target companies based on profile
      const targetCompanies = this.getTargetCompanies(userQuery, userProfile);
      const currentYear = new Date().getFullYear();
      const nextYear = currentYear + 1;
      const season = this.getCurrentSeason();

      // Generate specific queries
      const queries: string[] = [];

      // Add company-specific searches
      targetCompanies.forEach(company => {
        if (isInternship) {
          queries.push(`${company} internship ${nextYear}`);
          queries.push(`${company} summer internship ${season} ${nextYear}`);
          queries.push(`${company} engineering intern`);
          queries.push(`site:${this.getCompanyDomain(company)} internship`);
        } else {
          queries.push(`${company} software engineer`);
          queries.push(`${company} careers engineering`);
          queries.push(`site:${this.getCompanyDomain(company)} careers`);
        }
      });

      // Add specific program searches if internship
      if (isInternship) {
        queries.push('Google STEP internship');
        queries.push('Meta University internship');
        queries.push('Microsoft Explore program');
        queries.push('Amazon Future Engineer');
        queries.push('Apple internship program');
      }

      // Add location-based searches
      if (userQuery.toLowerCase().includes('silicon valley') || userQuery.toLowerCase().includes('bay area')) {
        queries.push(`software engineering internship Silicon Valley ${nextYear}`);
        queries.push(`tech internship Bay Area summer ${nextYear}`);
        queries.push(`Palo Alto internship computer science`);
        queries.push(`Mountain View software intern`);
      }

      // Add general but specific searches
      queries.push(`software engineering internship ${nextYear}`);
      queries.push(`computer science internship summer ${nextYear}`);
      queries.push(`SWE intern ${season} ${nextYear}`);

      // Limit and dedupe
      const uniqueQueries = [...new Set(queries)].slice(0, 15);

      console.log('🎯 Generated queries:', uniqueQueries);
      return uniqueQueries;
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

// Tavily API client (fallback)
class TavilyClient {
  private apiKey: string;

  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

  async search(query: string): Promise<SerperSearchResult> {
    try {
      const response = await fetch('https://api.tavily.com/search', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'api-key': this.apiKey
        },
        body: JSON.stringify({
          query,
          search_depth: 'advanced',
          include_raw_content: false,
          max_results: 20,
          include_domains: [
            'careers.google.com', 'metacareers.com', 'jobs.apple.com',
            'amazon.jobs', 'stripe.com/jobs', 'openai.com/careers',
            'linkedin.com', 'indeed.com', 'glassdoor.com'
          ]
        })
      });

      if (!response.ok) {
        throw new Error(`Tavily API error: ${response.statusText}`);
      }

      const data = await response.json();

      // Convert Tavily format to Serper format
      return {
        organic: data.results?.map((result: any) => ({
          title: result.title,
          link: result.url,
          snippet: result.content || result.snippet,
          date: result.published_date
        })) || [],
        answerBox: data.answer ? {
          answer: data.answer,
          snippet: data.answer,
          title: 'Answer'
        } : undefined,
        knowledgeGraph: undefined
      };
    } catch (error) {
      console.error('Tavily search error:', error);
      throw error;
    }
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
  userProfile?: any,
  searchQueries?: string[]
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

  // Extract target companies from queries
  if (searchQueries && searchQueries.length > 0) {
    const companies = new Set<string>();
    const companyNames = ['Google', 'Meta', 'Apple', 'Microsoft', 'Amazon', 'Netflix', 'Uber',
                          'Stripe', 'OpenAI', 'Anthropic', 'Goldman Sachs', 'Jane Street',
                          'Databricks', 'Scale AI', 'Airbnb', 'Tesla', 'SpaceX', 'Adobe',
                          'Salesforce', 'Oracle', 'Intel', 'NVIDIA', 'Two Sigma', 'Citadel',
                          'Ramp', 'Notion', 'Figma', 'Canva', 'DeepMind', 'Duolingo'];

    searchQueries.forEach(q => {
      companyNames.forEach(company => {
        if (q.toLowerCase().includes(company.toLowerCase())) {
          companies.add(company);
        }
      });
    });

    if (companies.size > 0) {
      strategy += `\n**🏢 Target Companies:**\n`;
      const companyList = Array.from(companies);
      // Display in rows of 6 companies
      const rows = [];
      for (let i = 0; i < companyList.length; i += 6) {
        rows.push(companyList.slice(i, i + 6).join(' • '));
      }
      strategy += rows.join('\n') + '\n';
    }

    strategy += `\n**📊 Search Details:**\n`;
    strategy += `  • ${searchQueries.length} targeted search queries\n`;
    strategy += `  • Covering company career pages + job boards\n`;
    strategy += `  • Including ${query.toLowerCase().includes('internship') ? 'internship programs' : 'full-time positions'}\n`;
  }

  strategy += `\n**⚡ Executing searches...**`;
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
  const tavilyApiKey = process.env.TAVILY_API_KEY;

  if (!serperApiKey && !tavilyApiKey) {
    throw new Error('Either SERPER_API_KEY or TAVILY_API_KEY environment variable is required');
  }

  const queryBuilder = new IntelligentQueryBuilder();
  const processor = new JobResultProcessor();

  try {
    // Generate intelligent search queries first
    const searchQueries = await queryBuilder.buildSearchQueries(query, options.userProfile);

    // Generate search strategy with the queries
    const searchStrategy = await generateSearchStrategy(query, options.userProfile, searchQueries);

    console.log('🔍 Searching with queries:', searchQueries);

    // Execute searches with fallback
    let searchResults: SerperSearchResult[] = [];

    if (serperApiKey) {
      try {
        const serperClient = new SerperClient(serperApiKey);
        const searchPromises = searchQueries.map(q => serperClient.searchJobs(q));
        searchResults = await Promise.all(searchPromises);
      } catch (error: any) {
        console.log('Serper API failed:', error.message);
        if (error.message?.includes('Too Many Requests') && tavilyApiKey) {
          console.log('Falling back to Tavily API...');
          const tavilyClient = new TavilyClient(tavilyApiKey);
          const searchPromises = searchQueries.map(q => tavilyClient.search(q));
          searchResults = await Promise.all(searchPromises);
        } else if (!tavilyApiKey) {
          throw new Error('Serper API rate limit hit and no Tavily API key configured as fallback');
        } else {
          throw error;
        }
      }
    } else if (tavilyApiKey) {
      console.log('Using Tavily API (Serper not configured)...');
      const tavilyClient = new TavilyClient(tavilyApiKey);
      const searchPromises = searchQueries.map(q => tavilyClient.search(q));
      searchResults = await Promise.all(searchPromises);
    }

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