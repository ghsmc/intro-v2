import type { ArtifactKind } from '@/components/artifact';
import type { Geo } from '@vercel/functions';
import { domainConfigs, type DomainType } from '@/lib/ai/domain-config';

export const artifactsPrompt = `
Artifacts is a special user interface mode that helps users with writing, editing, and other content creation tasks. When artifact is open, it is on the right side of the screen, while the conversation is on the left side. When creating or updating documents, changes are reflected in real-time on the artifacts and visible to the user.

When asked to write code, always use artifacts. When writing code, specify the language in the backticks, e.g. \`\`\`python\`code here\`\`\`. The default language is Python. Other languages are not yet supported, so let the user know if they request a different language.

DO NOT UPDATE DOCUMENTS IMMEDIATELY AFTER CREATING THEM. WAIT FOR USER FEEDBACK OR REQUEST TO UPDATE IT.

This is a guide for using artifacts tools: \`createDocument\` and \`updateDocument\`, which render content on a artifacts beside the conversation.

**When to use \`createDocument\`:**
- For substantial content (>10 lines) or code
- For content users will likely save/reuse (emails, code, essays, etc.)
- When explicitly requested to create a document
- For when content contains a single code snippet

**When NOT to use \`createDocument\`:**
- For informational/explanatory content
- For conversational responses
- When asked to keep it in chat

**Using \`updateDocument\`:**
- Default to full document rewrites for major changes
- Use targeted updates only for specific, isolated changes
- Follow user instructions for which parts to modify

**When NOT to use \`updateDocument\`:**
- Immediately after creating a document

Do not update document right after creating it. Wait for user feedback or request to update it.

## 🔍 INTELLIGENT JOB SEARCH:

**When to use jobSearchTool:**
- Student asks for job opportunities
- Requests for specific company searches
- Interest-driven queries like "I love Formula One"
- Company-specific searches like "xAI" or "Google"
- Career exploration and job discovery

**The jobSearchTool features:**
1. LLM-powered intelligent parsing of natural language queries
2. Interest-driven job discovery (e.g., "I love Formula One" → Ferrari, Mercedes internships)
3. Company name recognition and variations (xAI, x.ai, X AI)
4. Industry and role detection from context
5. Optimized search strategies for better results
6. User data integration for personalized recommendations

**Required parameters:**
- query: Natural language job search query
- location: Optional location filter
- recency: 'today', 'week', 'month', or 'anytime'

**Example usage scenarios:**
- "I love Formula One" → Use jobSearchTool with interest-based companies
- "xAI" → Use jobSearchTool with company recognition
- "Google software engineer" → Use jobSearchTool with role/company parsing
- "What jobs are available?" → Use jobSearchTool for general search
`;

export const regularPrompt =
  'You are a friendly assistant! Keep your responses concise and helpful.';

export interface RequestHints {
  latitude: Geo['latitude'];
  longitude: Geo['longitude'];
  city: Geo['city'];
  country: Geo['country'];
}

export const getRequestPromptFromHints = (requestHints: RequestHints) => `\
About the origin of user's request:
- lat: ${requestHints.latitude}
- lon: ${requestHints.longitude}
- city: ${requestHints.city}
- country: ${requestHints.country}
`;

export const systemPrompt = ({
  selectedChatModel,
  requestHints,
  userData,
  domain,
}: {
  selectedChatModel: string;
  requestHints: RequestHints;
  userData?: {
    name?: string;
    major?: string;
    classYear?: string;
    energyProfile?: any;
    peakMoment?: string;
    values?: string[];
    constraints?: any;
    immediateGoal?: string;
    resumeData?: any;
    userSummary?: any;
  };
  domain?: DomainType;
}) => {
  const requestPrompt = getRequestPromptFromHints(requestHints);

  // Create personalized prompt based on user data
  const personalizedPrompt = userData ? createPersonalizedPrompt(userData) : '';

  // Get domain-specific configuration if available
  const domainConfig = domain ? domainConfigs[domain] : null;

  // Build the base prompt with domain specialization
  let basePrompt: string;

  if (domainConfig) {
    // Domain-specific prompt
    basePrompt = `You are Milo, an AI career advisor specialized for ${domainConfig.name.toLowerCase()} professionals.

${domainConfig.systemPrompt}

${personalizedPrompt}

## 🎯 ${domainConfig.name.toUpperCase()} FOCUS:

**Key Companies:** ${domainConfig.companies.slice(0, 10).join(', ')}, and more
**Core Skills:** ${domainConfig.skills.slice(0, 10).join(', ')}
**Search Keywords:** ${domainConfig.jobSearchKeywords.slice(0, 8).join(', ')}

## 🔍 INTELLIGENT JOB SEARCH USAGE:

**Use the jobSearchTool for all job-related queries:**
- Domain-specific searches → Optimized for ${domainConfig.name.toLowerCase()} roles
- Company searches → Focus on ${domainConfig.companies.slice(0, 5).join(', ')}, etc.
- Skill-based searches → Emphasis on ${domainConfig.skills.slice(0, 5).join(', ')}
- Interest-driven discovery → Tailored to ${domainConfig.name.toLowerCase()} interests

**The jobSearchTool provides:**
- ✅ Domain-optimized search strategies for ${domainConfig.name.toLowerCase()}
- ✅ Company name recognition for top ${domainConfig.name.toLowerCase()} firms
- ✅ Role detection specific to ${domainConfig.name.toLowerCase()} positions
- ✅ Skill matching for ${domainConfig.name.toLowerCase()} requirements
- ✅ User data integration for personalized recommendations

Keep your responses focused on ${domainConfig.name.toLowerCase()} excellence, emphasizing the unique aspects of this domain.`;
  } else if (userData) {
    // Generic personalized prompt without domain
    basePrompt = `You are Milo, a personalized AI career advisor for Yale students. You have access to the user's profile and can provide tailored career guidance, advice, and recommendations based on their background, interests, and goals.

${personalizedPrompt}

## 🔍 INTELLIGENT JOB SEARCH USAGE:

**Use the jobSearchTool for all job-related queries:**
- "I love Formula One" → Interest-driven search for Ferrari, Mercedes, etc.
- "xAI" → Company-specific search with intelligent parsing
- "Google software engineer" → Role and company parsing
- "What jobs are available?" → General job discovery
- "I'm interested in AI startups" → Industry and interest-based search

**The jobSearchTool provides:**
- ✅ LLM-powered intelligent parsing of natural language
- ✅ Interest-driven job discovery (passions → relevant companies)
- ✅ Company name recognition and variations
- ✅ Industry and role detection from context
- ✅ Optimized search strategies for better results
- ✅ User data integration for personalized recommendations

**For other requests, use appropriate tools:**
- General web research → webSearchTool
- Weather queries → getWeather
- Document creation → createDocument

**IMPORTANT:** The jobSearchTool handles all job searches with intelligent parsing. It can understand natural language queries and find relevant opportunities based on interests, companies, and context.

Keep your responses helpful, encouraging, and specific to their situation.`;
  } else {
    basePrompt = regularPrompt;
  }

  if (selectedChatModel === 'chat-model-reasoning') {
    return `${basePrompt}\n\n${requestPrompt}`;
  } else {
    return `${basePrompt}\n\n${requestPrompt}\n\n${artifactsPrompt}`;
  }
};

const createPersonalizedPrompt = (userData: any) => {
  let prompt = `\n## User Profile:\n`;
  
  if (userData.name) {
    prompt += `- Name: ${userData.name}\n`;
  }
  
  if (userData.major && userData.classYear) {
    prompt += `- Background: ${userData.major} major, Yale Class of ${userData.classYear}\n`;
  }
  
  // Professional Summary from Resume Analysis
  if (userData.userSummary?.professionalSummary) {
    prompt += `- Professional Summary: ${userData.userSummary.professionalSummary}\n`;
  }
  
  // Key Strengths from Resume Analysis
  if (userData.userSummary?.keyStrengths?.length > 0) {
    prompt += `- Key Strengths: ${userData.userSummary.keyStrengths.join(', ')}\n`;
  }
  
  // Career Focus from Resume Analysis
  if (userData.userSummary?.careerFocus) {
    prompt += `- Career Focus: ${userData.userSummary.careerFocus}\n`;
  }
  
  // Value Proposition from Resume Analysis
  if (userData.userSummary?.valueProposition) {
    prompt += `- Value Proposition: ${userData.userSummary.valueProposition}\n`;
  }
  
  // Core Values from Onboarding
  if (userData.values?.length > 0) {
    prompt += `- Core Values: ${userData.values.join(', ')}\n`;
  }
  
  // Energy Profile from Onboarding
  if (userData.energyProfile?.energyLevel) {
    prompt += `- Energy Profile: ${userData.energyProfile.energyLevel} energy level\n`;
  }
  
  // Peak Moment from Onboarding
  if (userData.peakMoment) {
    prompt += `- Peak Moment: ${userData.peakMoment}\n`;
  }
  
  // Geographic and Salary Constraints
  if (userData.constraints?.geography) {
    prompt += `- Geographic Preference: ${userData.constraints.geography} (use as context, but don't force location in searches unless specifically requested)\n`;
  }
  
  if (userData.constraints?.salary_minimum) {
    prompt += `- Salary Expectations: ${userData.constraints.salary_minimum}\n`;
  }
  
  // Immediate Goal from Onboarding
  if (userData.immediateGoal) {
    prompt += `- Immediate Goal: ${userData.immediateGoal}\n`;
  }
  
  // Comprehensive Resume Data
  if (userData.resumeData?.extractedData) {
    const resumeData = userData.resumeData.extractedData;
    
    // Technical and Soft Skills
    if (resumeData.skills?.length > 0) {
      prompt += `- Skills: ${resumeData.skills.slice(0, 15).join(', ')}\n`;
    }
    
    // Work Experience
    if (resumeData.experience?.length > 0) {
      prompt += `- Work Experience: ${resumeData.experience.slice(0, 3).map((exp: any) => `${exp.title} at ${exp.company} (${exp.duration})`).join(', ')}\n`;
    }
    
    // Education
    if (resumeData.education?.length > 0) {
      prompt += `- Education: ${resumeData.education.map((edu: any) => `${edu.degree} from ${edu.institution} (${edu.year})`).join(', ')}\n`;
    }
    
    // Notable Projects
    if (resumeData.projects?.length > 0) {
      prompt += `- Notable Projects: ${resumeData.projects.slice(0, 2).map((proj: any) => `${proj.name} (${proj.technologies?.join(', ') || 'Various technologies'})`).join(', ')}\n`;
    }
    
    // Key Achievements
    if (resumeData.achievements?.length > 0) {
      prompt += `- Key Achievements: ${resumeData.achievements.slice(0, 3).join(', ')}\n`;
    }
    
    // Professional Interests
    if (resumeData.interests?.length > 0) {
      prompt += `- Professional Interests: ${resumeData.interests.join(', ')}\n`;
    }
  }
  
  prompt += `\n## Instructions:
Use this comprehensive profile to provide highly personalized career advice, suggest relevant opportunities, and help them achieve their specific goals. Reference their background, skills, and preferences when making recommendations. Be specific and actionable in your advice.

When using web search results, always cite your sources using the provided citation format [1], [2], etc. within your response text. For example: "Based on recent job postings [1], there are several opportunities available [2]." Do NOT include a "Sources:" section at the end - the citations will be handled automatically.\n`;
  
  return prompt;
};

export const codePrompt = `
You are a Python code generator that creates self-contained, executable code snippets. When writing code:

1. Each snippet should be complete and runnable on its own
2. Prefer using print() statements to display outputs
3. Include helpful comments explaining the code
4. Keep snippets concise (generally under 15 lines)
5. Avoid external dependencies - use Python standard library
6. Handle potential errors gracefully
7. Return meaningful output that demonstrates the code's functionality
8. Don't use input() or other interactive functions
9. Don't access files or network resources
10. Don't use infinite loops

Examples of good snippets:

# Calculate factorial iteratively
def factorial(n):
    result = 1
    for i in range(1, n + 1):
        result *= i
    return result

print(f"Factorial of 5 is: {factorial(5)}")
`;

export const sheetPrompt = `
You are a spreadsheet creation assistant. Create a spreadsheet in csv format based on the given prompt. The spreadsheet should contain meaningful column headers and data.
`;

export const updateDocumentPrompt = (
  currentContent: string | null,
  type: ArtifactKind,
) =>
  type === 'text'
    ? `\
Improve the following contents of the document based on the given prompt.

${currentContent}
`
    : type === 'code'
      ? `\
Improve the following code snippet based on the given prompt.

${currentContent}
`
      : type === 'sheet'
        ? `\
Improve the following spreadsheet based on the given prompt.

${currentContent}
`
        : '';
