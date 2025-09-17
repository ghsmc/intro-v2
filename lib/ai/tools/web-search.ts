// lib/ai/tools/web-search.ts
import { z } from 'zod';
import { tool } from 'ai';
import { processSearchResults, type CitationSource } from '@/lib/citations/utils';

const SERPER_API_KEY = process.env.SERPER_API_KEY;

export const webSearchTool = tool({
  description: 'Search the web for current information using Google',
  inputSchema: z.object({
    query: z.string().describe('The search query'),
    num: z.number().optional().default(5).describe('Number of results to return'),
    type: z.enum(['search', 'news', 'images', 'places', 'shopping']).optional().default('search'),
  }),
  execute: async ({ query, num = 5, type = 'search' }) => {
    console.log('Serper search:', { query, num, type });

    if (!SERPER_API_KEY) {
      return {
        query,
        results: [],
        error: 'Search API not configured',
      };
    }

    try {
      const response = await fetch('https://google.serper.dev/search', {
        method: 'POST',
        headers: {
          'X-API-KEY': SERPER_API_KEY,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          q: query,
          num,
          type,
          hl: 'en',
          gl: 'us'
        }),
      });

      if (!response.ok) {
        throw new Error(`Search API error: ${response.status}`);
      }

      const data = await response.json();

      const results = (data.organic || []).map((item: any) => ({
        title: item.title || 'Untitled',
        link: item.link || '#',
        snippet: item.snippet || '',
        date: item.date,
        source: item.source || new URL(item.link || '').hostname.replace('www.', '')
      }));

      return {
        query,
        results,
        num,
        type
      };

    } catch (error) {
      console.error('Search error:', error);
      return {
        query,
        results: [],
        error: error instanceof Error ? error.message : 'Search failed',
      };
    }
  },
});

export const newsSearchTool = tool({
  description: 'Search for recent news articles',
  inputSchema: z.object({
    query: z.string().describe('The news search query'),
    num: z.number().optional().default(5).describe('Number of results to return'),
  }),
  execute: async ({ query, num = 5 }) => {
    console.log('News search:', { query, num });

    if (!SERPER_API_KEY) {
      return {
        query,
        results: [],
        error: 'Search API not configured',
      };
    }

    try {
      const response = await fetch('https://google.serper.dev/news', {
        method: 'POST',
        headers: {
          'X-API-KEY': SERPER_API_KEY,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          q: query,
          num,
          hl: 'en',
          gl: 'us'
        }),
      });

      if (!response.ok) {
        throw new Error(`News API error: ${response.status}`);
      }

      const data = await response.json();

      const results = (data.news || []).map((item: any) => ({
        title: item.title || 'Untitled',
        link: item.link || '#',
        snippet: item.snippet || '',
        date: item.date,
        source: item.source || new URL(item.link || '').hostname.replace('www.', '')
      }));

      return {
        query,
        results,
        num
      };

    } catch (error) {
      console.error('News search error:', error);
      return {
        query,
        results: [],
        error: error instanceof Error ? error.message : 'News search failed',
      };
    }
  },
});

export const jobSearchTool = tool({
  description: 'Search for job opportunities',
  inputSchema: z.object({
    query: z.string().describe('Job search query (e.g., "software engineer", "internship")'),
    location: z.string().optional().describe('Location filter (e.g., "San Francisco", "Remote")'),
    num: z.number().optional().default(10).describe('Number of results to return'),
  }),
  execute: async ({ query, location, num = 10 }) => {
    console.log('Job search:', { query, location, num });

    // Check for API key configuration
    if (!SERPER_API_KEY) {
      console.warn('SERPER_API_KEY is not configured - job search will not work')
    }

    if (!SERPER_API_KEY) {
      return {
        query,
        results: [],
        error: 'Search API not configured',
      };
    }

    try {
      // Build job search query
      const jobQuery = location ? `${query} jobs ${location}` : `${query} jobs`;

      const response = await fetch('https://google.serper.dev/search', {
        method: 'POST',
        headers: {
          'X-API-KEY': SERPER_API_KEY,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          q: jobQuery,
          num,
          hl: 'en',
          gl: 'us'
        }),
      });

      if (!response.ok) {
        throw new Error(`Job search API error: ${response.status}`);
      }

      const data = await response.json();

      const results = (data.organic || []).map((item: any) => ({
        title: item.title || 'Untitled',
        link: item.link || '#',
        snippet: item.snippet || '',
        date: item.date,
        source: item.source || new URL(item.link || '').hostname.replace('www.', '')
      }));

      return {
        query: jobQuery,
        results,
        location,
        num
      };

    } catch (error) {
      console.error('Job search error:', error);
      return {
        query,
        results: [],
        location,
        error: error instanceof Error ? error.message : 'Job search failed',
      };
    }
  },
});