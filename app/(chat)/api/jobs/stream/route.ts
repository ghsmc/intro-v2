// Streaming API for intelligent job search with Server-Sent Events
import type { NextRequest } from 'next/server';
import { searchJobs, type JobSearchParams } from '@/lib/db/queries/jobs';
import { getCompanies } from '@/lib/db/queries/companies';

// Use Node.js runtime to support database queries
export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const query = searchParams.get('q') || '';
  const location = searchParams.get('location') || undefined;
  const remote = searchParams.get('remote') === 'true';
  const experienceLevel = searchParams.get('level') || undefined;
  const limit = Number.parseInt(searchParams.get('limit') || '20');

  if (!query) {
    return new Response('Query parameter required', { status: 400 });
  }

  // Create a TransformStream for SSE
  const encoder = new TextEncoder();
  const stream = new TransformStream();
  const writer = stream.writable.getWriter();

  // Start the search in background
  (async () => {
    try {
      console.log('Starting job search for:', query);

      // Send initial progress
      await writer.write(encoder.encode(`data: ${JSON.stringify({
        type: 'progress',
        message: 'Searching jobs...',
        status: 'searching'
      })}\n\n`));

      // Build search parameters
      const params: JobSearchParams = {
        query,
        locations: location ? [location] : undefined,
        remoteTypes: remote ? ['remote', 'hybrid'] : undefined,
        levels: experienceLevel ? [experienceLevel] : undefined,
        limit,
        sortBy: 'postedAt',
        sortOrder: 'desc'
      };

      // Execute search
      const jobs = await searchJobs(params);

      // Get company details
      const companyIds = [...new Set(jobs.map(job => job.companyId))];
      const companies = companyIds.length > 0 ? await getCompanies() : [];
      const companyMap = new Map(companies.map(c => [c.id, c]));

      // Transform and send results
      const results = jobs.map(job => {
        const company = companyMap.get(job.companyId);
        return {
          id: job.id,
          title: job.title,
          company: company?.name || 'Unknown Company',
          location: job.location,
          locationCity: job.locationCity,
          remoteType: job.remoteType,
          url: job.applicationUrl || company?.jobsUrl,
          description: job.description,
          salary: job.salaryMin && job.salaryMax
            ? `$${job.salaryMin.toLocaleString()} - $${job.salaryMax.toLocaleString()}`
            : null,
          posted: job.postedAt.toISOString(),
          skills: job.skills || [],
          requirements: job.requirements || [],
          benefits: job.benefits || [],
          level: job.level,
          type: job.type
        };
      });

      // Send complete results
      await writer.write(encoder.encode(`data: ${JSON.stringify({
        type: 'complete',
        results,
        totalCount: results.length
      })}\n\n`));

      // Send completion signal
      await writer.write(encoder.encode('data: [DONE]\n\n'));
    } catch (error) {
      console.error('Search stream error:', error);
      const errorMessage = JSON.stringify({
        type: 'error',
        message: error instanceof Error ? error.message : 'Search failed'
      });
      await writer.write(encoder.encode(`data: ${errorMessage}\n\n`));
    } finally {
      await writer.close();
    }
  })();

  // Return SSE response
  return new Response(stream.readable, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache, no-transform',
      'Connection': 'keep-alive',
      'X-Accel-Buffering': 'no', // Disable Nginx buffering
    },
  });
}

// POST endpoint for more complex searches
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { query, filters, userId } = body;

    // Create response stream
    const encoder = new TextEncoder();
    const stream = new TransformStream();
    const writer = stream.writable.getWriter();

    // Enhanced search
    (async () => {
      try {
        // Send initial progress
        await writer.write(encoder.encode(`data: ${JSON.stringify({
          type: 'progress',
          message: 'Processing search...',
          status: 'searching'
        })}\n\n`));

        // Build search parameters from filters
        const params: JobSearchParams = {
          query: query || '',
          locations: filters?.locations,
          remoteTypes: filters?.remoteTypes,
          levels: filters?.levels,
          types: filters?.jobTypes,
          departments: filters?.departments,
          skills: filters?.skills,
          salaryMin: filters?.salaryMin,
          salaryMax: filters?.salaryMax,
          limit: filters?.limit || 50,
          sortBy: filters?.sortBy || 'relevance',
          sortOrder: filters?.sortOrder || 'desc'
        };

        // Execute search
        const jobs = await searchJobs(params);

        // Get company details
        const companyIds = [...new Set(jobs.map(job => job.companyId))];
        const companies = companyIds.length > 0 ? await getCompanies() : [];
        const companyMap = new Map(companies.map(c => [c.id, c]));

        // Transform results
        const results = jobs.map(job => {
          const company = companyMap.get(job.companyId);
          return {
            id: job.id,
            title: job.title,
            company: company?.name || 'Unknown Company',
            companyId: job.companyId,
            location: job.location,
            locationCity: job.locationCity,
            remoteType: job.remoteType,
            url: job.applicationUrl || company?.jobsUrl,
            description: job.description,
            salary: job.salaryMin && job.salaryMax
              ? `$${job.salaryMin.toLocaleString()} - $${job.salaryMax.toLocaleString()}`
              : null,
            posted: job.postedAt.toISOString(),
            skills: job.skills || [],
            requirements: job.requirements || [],
            benefits: job.benefits || [],
            level: job.level,
            type: job.type
          };
        });

        // Send complete results
        await writer.write(encoder.encode(`data: ${JSON.stringify({
          type: 'complete',
          results,
          totalCount: results.length,
          companies: companies.filter(c => results.some(j => j.companyId === c.id))
        })}\n\n`));

        await writer.write(encoder.encode('data: [DONE]\n\n'));
      } catch (error) {
        console.error('Enhanced search error:', error);
        const errorData = JSON.stringify({
          type: 'error',
          message: 'Search failed'
        });
        await writer.write(encoder.encode(`data: ${errorData}\n\n`));
      } finally {
        await writer.close();
      }
    })();

    return new Response(stream.readable, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
      },
    });
  } catch (error) {
    return new Response('Invalid request', { status: 400 });
  }
}