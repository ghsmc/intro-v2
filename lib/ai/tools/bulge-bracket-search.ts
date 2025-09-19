// lib/ai/tools/bulge-bracket-search.ts
import { z } from 'zod';
import { tool } from 'ai';
import { bulgeBracketPrograms } from '@/lib/data/bulge-bracket-programs';

export const bulgeBracketSearchTool = tool({
  description: 'Search investment banking summer analyst and internship programs from Bulge Bracket, Elite Boutique, and Middle Market banks',
  inputSchema: z.object({
    query: z.string().optional().describe('Search query for company name, location, or tier'),
    tier: z.enum(['Bulge Bracket', 'Elite Boutique', 'Middle Market', 'Specialized']).optional(),
    status: z.enum(['Open', 'Upcoming', 'Closing Soon', 'Closed']).optional(),
    location: z.string().optional().describe('Filter by location (e.g., New York, London)'),
    limit: z.number().optional().default(10).describe('Maximum number of results to return'),
  }),
  execute: async ({ query, tier, status, location, limit = 10 }) => {
    console.log('Bulge Bracket search:', { query, tier, status, location, limit });

    // Filter programs based on criteria
    let filteredPrograms = [...bulgeBracketPrograms];

    // Filter by tier
    if (tier) {
      filteredPrograms = filteredPrograms.filter(p => p.tier === tier);
    }

    // Filter by status
    if (status) {
      const today = new Date();
      filteredPrograms = filteredPrograms.filter(program => {
        const openDate = program.openingDate ? new Date(program.openingDate) : null;
        const closeDate = program.closingDate ? new Date(program.closingDate) : null;

        switch (status) {
          case 'Open':
            return openDate && openDate <= today && (!closeDate || closeDate >= today);
          case 'Upcoming':
            return openDate && openDate > today;
          case 'Closing Soon': {
            if (!closeDate) return false;
            const daysUntilClose = Math.ceil((closeDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
            return daysUntilClose >= 0 && daysUntilClose <= 7;
          }
          case 'Closed':
            return closeDate && closeDate < today;
          default:
            return true;
        }
      });
    }

    // Filter by location
    if (location) {
      const locationLower = location.toLowerCase();
      filteredPrograms = filteredPrograms.filter(p =>
        p.locations.some(loc => loc.toLowerCase().includes(locationLower))
      );
    }

    // Search by query
    if (query) {
      const queryLower = query.toLowerCase();
      filteredPrograms = filteredPrograms.filter(p =>
        p.company.toLowerCase().includes(queryLower) ||
        p.programName.toLowerCase().includes(queryLower) ||
        p.tier.toLowerCase().includes(queryLower) ||
        p.locations.some(loc => loc.toLowerCase().includes(queryLower))
      );
    }

    // Sort by status (Open first, then Upcoming, then Closed)
    const today = new Date();
    filteredPrograms.sort((a, b) => {
      const getStatusOrder = (program: typeof bulgeBracketPrograms[0]) => {
        const openDate = program.openingDate ? new Date(program.openingDate) : null;
        const closeDate = program.closingDate ? new Date(program.closingDate) : null;

        if (openDate && openDate <= today && (!closeDate || closeDate >= today)) return 0; // Open
        if (openDate && openDate > today) return 1; // Upcoming
        if (closeDate && closeDate < today) return 3; // Closed
        return 2; // Unknown
      };

      return getStatusOrder(a) - getStatusOrder(b);
    });

    // Limit results
    const results = filteredPrograms.slice(0, limit);

    // Format results for display
    const formattedResults = results.map(program => {
      const openDate = program.openingDate ? new Date(program.openingDate) : null;
      const closeDate = program.closingDate ? new Date(program.closingDate) : null;
      const today = new Date();

      let programStatus = 'Unknown';
      if (openDate && openDate <= today && (!closeDate || closeDate >= today)) {
        programStatus = 'Open';
      } else if (openDate && openDate > today) {
        programStatus = 'Upcoming';
      } else if (closeDate && closeDate < today) {
        programStatus = 'Closed';
      }

      return {
        company: program.company,
        program: program.programName,
        tier: program.tier,
        status: programStatus,
        openingDate: program.openingDate,
        closingDate: program.closingDate,
        locations: program.locations,
        requiresCV: program.requiresCV,
        requiresCoverLetter: program.requiresCoverLetter,
        compensation: program.compensationRange || 'Competitive',
        applicationUrl: program.applicationUrl,
        notes: program.notes,
      };
    });

    return {
      query,
      filters: { tier, status, location },
      totalResults: formattedResults.length,
      results: formattedResults,
      summary: `Found ${formattedResults.length} investment banking programs matching your criteria.`,
    };
  },
});