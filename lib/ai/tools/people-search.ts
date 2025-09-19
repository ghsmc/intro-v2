// People Search Tool - Networking and Alumni connections via web search
import { z } from 'zod';
import { tool } from 'ai';

interface PersonProfile {
  name: string;
  title: string;
  company: string;
  location?: string;
  url: string;
  description: string;
  school?: string;
  degree?: string;
  graduationYear?: string;
  skills?: string[];
  experience?: string;
  connectionReason?: string;
  mutualConnections?: string[];
  source: string;
  sourceDomain?: string;
}

// Generate targeted search queries for networking
async function generateNetworkingQueries(
  query: string,
  userProfile?: any
): Promise<string[]> {
  const baseQueries = [];

  // Validate query parameter
  if (!query || typeof query !== 'string') {
    console.warn('Invalid query provided to generateNetworkingQueries:', query);
    return ['Yale alumni LinkedIn'];
  }

  // Parse intent from query
  const normalizedQuery = query.toLowerCase();

  // Build context-aware queries
  if (userProfile) {
    const school = userProfile.classYear ? `Yale ${userProfile.classYear}` : 'Yale';
    const major = userProfile.major || '';
    const skills = userProfile.resumeData?.extractedData?.skills?.slice(0, 3).join(' ') || '';
    const targetRole = userProfile.immediateGoal || '';

    // LinkedIn-focused queries
    baseQueries.push(`site:linkedin.com/in ${school} ${major} ${query}`);
    baseQueries.push(`site:linkedin.com/in Yale alumni ${query}`);

    // If searching for specific roles/companies
    if (query.includes('at') || query.includes('@')) {
      const parts = query.split(/at|@/);
      if (parts.length > 1) {
        const company = parts[1].trim();
        baseQueries.push(`site:linkedin.com/in Yale ${company}`);
        baseQueries.push(`site:linkedin.com/in ${school} ${company} ${major}`);
      }
    }

    // Skills-based networking
    if (skills) {
      baseQueries.push(`site:linkedin.com/in Yale ${skills.split(' ').slice(0, 2).join(' ')}`);
    }

    // Target role networking
    if (targetRole) {
      baseQueries.push(`site:linkedin.com/in Yale ${targetRole.split(' ').slice(0, 3).join(' ')}`);
    }
  } else {
    // Fallback queries without profile
    baseQueries.push(`site:linkedin.com/in ${query}`);
    baseQueries.push(`site:linkedin.com/in Yale ${query}`);
    baseQueries.push(`"Yale alumni" ${query} LinkedIn`);
  }

  // Add general professional networking queries
  baseQueries.push(`Yale alumni ${query} contact`);
  baseQueries.push(`Yale network ${query}`);

  // Deduplicate and limit
  return [...new Set(baseQueries)].slice(0, 5);
}

// Extract person information from search results
async function extractPersonProfiles(
  searchResults: any[],
  originalQuery: string,
  userProfile?: any
): Promise<PersonProfile[]> {
  const profiles: PersonProfile[] = [];

  for (const result of searchResults) {
    try {
      // Parse LinkedIn URLs specially
      const isLinkedIn = result.link.includes('linkedin.com/in/');

      // Extract name from title (LinkedIn format: "Name - Title - Company | LinkedIn")
      const name = result.title.split(' - ')[0].replace(' | LinkedIn', '').trim();
      const titleCompany = result.title.split(' - ').slice(1).join(' - ').replace(' | LinkedIn', '').trim();

      // Parse title and company
      let title = '';
      let company = '';
      if (titleCompany) {
        const parts = titleCompany.split(' - ');
        title = parts[0] || '';
        company = parts[1] || '';
      }

      // Extract school info from snippet
      let school = '';
      let degree = '';
      let graduationYear = '';

      if (result.snippet) {
        // Look for Yale mentions
        const yaleMatch = result.snippet.match(/Yale[^.]*(\d{4})/i);
        if (yaleMatch) {
          school = 'Yale University';
          graduationYear = yaleMatch[1];
        }

        // Look for degree information
        const degreeMatch = result.snippet.match(/\b(BA|BS|MA|MS|MBA|PhD|JD|MD)\b/i);
        if (degreeMatch) {
          degree = degreeMatch[1].toUpperCase();
        }
      }

      // Build connection reason based on user profile
      let connectionReason = '';
      if (userProfile) {
        const reasons = [];

        if (school === 'Yale University') {
          if (userProfile.classYear && graduationYear) {
            const yearDiff = Math.abs(Number.parseInt(userProfile.classYear) - Number.parseInt(graduationYear));
            if (yearDiff <= 2) {
              reasons.push(`Yale ${graduationYear} (near your class)`);
            } else {
              reasons.push(`Yale ${graduationYear} alum`);
            }
          } else {
            reasons.push('Yale alum');
          }
        }

        // Check for major/field overlap
        if (userProfile.major && result.snippet && result.snippet.toLowerCase().includes(userProfile.major.toLowerCase())) {
          reasons.push(`${userProfile.major} background`);
        }

        // Check for skill overlap
        if (userProfile.resumeData?.extractedData?.skills && result.snippet) {
          const skills = userProfile.resumeData.extractedData.skills;
          const matchedSkills = skills.filter((skill: string) =>
            skill && result.snippet.toLowerCase().includes(skill.toLowerCase())
          );
          if (matchedSkills.length > 0) {
            reasons.push(`Shares skills: ${matchedSkills.slice(0, 2).join(', ')}`);
          }
        }

        connectionReason = reasons.join(' • ');
      }

      // Ensure we have a valid URL before creating the profile
      if (!result.link) {
        console.warn('Skipping result without URL');
        continue;
      }

      profiles.push({
        name: name || 'Professional',
        title: title || 'Professional',
        company: company || 'Company',
        url: result.link,
        description: result.snippet || '',
        school,
        degree,
        graduationYear,
        connectionReason,
        source: result.title || '',
        sourceDomain: result.link ? new URL(result.link).hostname.replace('www.', '') : 'unknown'
      });
    } catch (error) {
      console.error('Error parsing person profile:', error);
    }
  }

  return profiles;
}

// Rank profiles by relevance to user
function rankProfilesByRelevance(
  profiles: PersonProfile[],
  userProfile?: any
): PersonProfile[] {
  if (!userProfile) return profiles;

  return profiles.map(profile => {
    let score = 0;

    // Yale connection is highest priority
    if (profile.school === 'Yale University') {
      score += 50;

      // Class year proximity
      if (profile.graduationYear && userProfile.classYear) {
        const yearDiff = Math.abs(Number.parseInt(userProfile.classYear) - Number.parseInt(profile.graduationYear));
        if (yearDiff === 0) score += 30;
        else if (yearDiff <= 2) score += 20;
        else if (yearDiff <= 5) score += 10;
      }
    }

    // Major/field match
    if (userProfile.major && profile.description && profile.description.toLowerCase().includes(userProfile.major.toLowerCase())) {
      score += 15;
    }

    // Company match with target companies
    if (userProfile.resumeData?.extractedData?.targetCompanies && profile.company) {
      const targetCompanies = userProfile.resumeData.extractedData.targetCompanies;
      if (targetCompanies.some((company: string) =>
        company && profile.company.toLowerCase().includes(company.toLowerCase())
      )) {
        score += 20;
      }
    }

    // LinkedIn profile (more accessible for networking)
    if (profile.sourceDomain === 'linkedin.com') {
      score += 10;
    }

    return { ...profile, relevanceScore: score };
  }).sort((a, b) => (b.relevanceScore || 0) - (a.relevanceScore || 0));
}

// Generate formatted response with networking advice
async function generateNetworkingResponse(
  profiles: PersonProfile[],
  query: string,
  userProfile: any
): Promise<string> {
  if (profiles.length === 0) {
    return 'No relevant profiles found. Try broadening your search or using different keywords.';
  }

  let response = '';

  // Add personalized intro if user profile exists
  if (userProfile?.name) {
    response = `${userProfile.name}, here are relevant connections for networking:\n\n`;
  } else {
    response = 'Here are relevant connections for networking:\n\n';
  }

  // Group profiles by connection type
  const yaleAlumni = profiles.filter(p => p.school === 'Yale University');
  const others = profiles.filter(p => p.school !== 'Yale University');

  if (yaleAlumni.length > 0) {
    response += '**Yale Alumni Connections:**\n\n';
    for (const profile of yaleAlumni.slice(0, 5)) {
      response += `**${profile.name}** <cite>${profile.sourceDomain}</cite>\n`;
      response += `${profile.title}${profile.company ? ` at ${profile.company}` : ''}\n`;
      if (profile.connectionReason) {
        response += `*Connection: ${profile.connectionReason}*\n`;
      }
      response += `${profile.description.slice(0, 150)}...\n`;
      response += `[View Profile](${profile.url})\n\n`;
    }
  }

  if (others.length > 0 && yaleAlumni.length < 5) {
    response += '\n**Other Relevant Professionals:**\n\n';
    for (const profile of others.slice(0, 5 - yaleAlumni.length)) {
      response += `**${profile.name}** <cite>${profile.sourceDomain}</cite>\n`;
      response += `${profile.title}${profile.company ? ` at ${profile.company}` : ''}\n`;
      response += `${profile.description.slice(0, 150)}...\n`;
      response += `[View Profile](${profile.url})\n\n`;
    }
  }

  // Generate personalized outreach template for top connections
  if (profiles.length > 0 && userProfile) {
    response += '\n**📧 Personalized Outreach Template:**\n\n';

    const topProfile = profiles[0];
    const isYaleAlum = topProfile.school === 'Yale University';

    response += '```\n';
    response += `Subject: ${isYaleAlum ? 'Yale Student' : 'Student'} - Quick Question about ${topProfile.company || 'Your Career Path'}\n\n`;
    response += `Hi ${topProfile.name?.split(' ')[0] || 'there'},\n\n`;

    if (isYaleAlum) {
      response += `I'm a ${userProfile.classYear || 'current'} Yale student studying ${userProfile.major || 'Computer Science'}`;
      if (topProfile.graduationYear) {
        response += ` (I saw you graduated in ${topProfile.graduationYear})`;
      }
      response += '. ';
    } else {
      response += `I'm a student at Yale studying ${userProfile.major || 'Computer Science'}. `;
    }

    response += `I came across your profile and was really impressed by your work`;
    if (topProfile.company) {
      response += ` at ${topProfile.company}`;
    }
    response += '.\n\n';

    if (userProfile.immediateGoal?.includes('internship')) {
      response += `I'm currently exploring internship opportunities and would love to learn about your experience `;
      response += `${topProfile.company ? `at ${topProfile.company}` : 'in the industry'}. `;
    } else {
      response += `I'm interested in learning more about ${topProfile.company ? `careers at ${topProfile.company}` : 'your career path'}. `;
    }

    response += `Would you have 15 minutes for a brief call or coffee chat in the next couple of weeks?\n\n`;

    response += `I'm particularly curious about:\n`;
    response += `• Your transition from ${isYaleAlum ? 'Yale' : 'school'} to ${topProfile.company || 'industry'}\n`;
    response += `• The day-to-day work in your role\n`;
    response += `• Any advice for someone looking to break into the field\n\n`;

    response += `Thanks so much for your time!\n\n`;
    response += `Best,\n${userProfile.name || '[Your Name]'}`;
    if (userProfile.classYear) {
      response += `\nYale '${userProfile.classYear.slice(2)}`;
    }
    response += '\n```\n';

    response += '\n**💡 Outreach Tips:**\n';
    response += '• Send connection request with personalized note on LinkedIn\n';
    response += '• Follow up after 1 week if no response\n';
    response += '• Keep initial message under 150 words\n';
    response += '• Suggest specific times for availability\n';
    response += '• Send thank you note after any conversation\n';
  } else {
    // Original tips if no personalized template
    response += '\n**Networking Tips:**\n';
    response += '• Mention your Yale connection in outreach messages\n';
    response += '• Reference specific shared experiences or interests\n';
    response += '• Request a brief informational interview (15-20 min)\n';
    response += '• Prepare specific questions about their career path\n';
  }

  return response;
}

// Main search function
async function performPeopleSearch(
  query: string,
  userProfile?: any
): Promise<PersonProfile[]> {
  // Validate query input
  if (!query || typeof query !== 'string') {
    console.error('Invalid query provided to performPeopleSearch:', query);
    return [];
  }

  if (!process.env.SERPER_API_KEY) {
    throw new Error('Serper API key not configured');
  }

  const queries = await generateNetworkingQueries(query, userProfile);
  const allProfiles: PersonProfile[] = [];

  for (const searchQuery of queries) {
    try {
      const response = await fetch('https://google.serper.dev/search', {
        method: 'POST',
        headers: {
          'X-API-KEY': process.env.SERPER_API_KEY,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          q: searchQuery,
          num: 10,
          gl: 'us',
          hl: 'en',
        }),
      });

      if (!response.ok) {
        console.error(`Serper API error: ${response.statusText}`);
        continue;
      }

      const data = await response.json() as SerperSearchResult;

      if (data.organic && data.organic.length > 0) {
        const profiles = await extractPersonProfiles(data.organic, query, userProfile);
        allProfiles.push(...profiles);
      }
    } catch (error) {
      console.error('Search query failed:', error);
    }
  }

  // Deduplicate by URL
  const uniqueProfiles = Array.from(
    new Map(allProfiles.map(p => [p.url, p])).values()
  );

  return rankProfilesByRelevance(uniqueProfiles, userProfile);
}

export const peopleSearchTool = tool({
  description: 'Search for people and professionals for networking, particularly Yale alumni and industry connections. Use this for finding mentors, alumni in specific companies, or professionals in target roles.',
  inputSchema: z.object({
    query: z.string().describe('The search query - can be a company name, role, industry, or combination like "Yale alumni at SpaceX" or "SpaceX engineers"'),
    userProfile: z.any().optional().describe('User profile data for personalized networking matches'),
  }),
  execute: async ({ query, userProfile }) => {
    try {
      // Validate query is provided
      if (!query) {
        return {
          success: false,
          message: 'Please provide a search query (e.g., "Yale alumni at SpaceX")',
          profiles: [],
        };
      }

      const profiles = await performPeopleSearch(query, userProfile);

      if (profiles.length === 0) {
        return {
          success: false,
          message: 'No profiles found. Try different search terms or broaden your criteria.',
          profiles: [],
        };
      }

      const formattedResponse = await generateNetworkingResponse(
        profiles.slice(0, 10),
        query,
        userProfile
      );

      return {
        success: true,
        message: formattedResponse,
        profiles: profiles.slice(0, 10),
        totalFound: profiles.length,
      };
    } catch (error) {
      console.error('People search error:', error);
      return {
        success: false,
        message: `Search failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
        profiles: [],
      };
    }
  },
});

interface SerperSearchResult {
  organic: Array<{
    title: string;
    link: string;
    snippet: string;
    date?: string;
  }>;
}