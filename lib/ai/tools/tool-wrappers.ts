// Tool wrappers that automatically inject user profile data
import { webJobSearchTool as originalWebJobSearchTool } from './web-job-search';
import { peopleSearchTool as originalPeopleSearchTool } from './people-search';
import { tool } from 'ai';
import { z } from 'zod';

// Create wrapped versions that automatically include user profile
export function createWebJobSearchTool(userData: any) {
  return tool({
    description: originalWebJobSearchTool.description || 'Search for jobs across the web',
    inputSchema: z.object({
      query: z.string().describe('The job search query'),
      limit: z.number().optional().default(20),
      includeRemote: z.boolean().optional().default(true),
      experienceLevel: z.enum(['entry', 'mid', 'senior', 'any']).optional().default('any'),
    }),
    execute: async (params, options) => {
      // Automatically inject user profile
      return originalWebJobSearchTool.execute!({
        ...params,
        userProfile: userData,
      }, options);
    },
  });
}

export function createPeopleSearchTool(userData: any) {
  return tool({
    description: originalPeopleSearchTool.description || 'Search for people and networking connections',
    inputSchema: z.object({
      query: z.string().describe('The search query for people/alumni'),
    }),
    execute: async (params, options) => {
      // Automatically inject user profile
      return originalPeopleSearchTool.execute!({
        ...params,
        userProfile: userData,
      }, options);
    },
  });
}