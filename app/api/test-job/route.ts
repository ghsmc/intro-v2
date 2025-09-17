import { jobSearchTool } from '@/lib/ai/tools/web-search';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get('q') || 'software engineer internship';
  
  try {
    const results = await jobSearchTool.execute({
      query,
      location: 'San Francisco',
      recency: 'week',
      studentFocused: true,
    });
    
    return Response.json({
      success: true,
      query: results.query,
      parsed: results.parsedQuery,
      found: results.totalFound,
      topJobs: results.results.slice(0, 5),
      strategy: results.searchStrategy,
    });
  } catch (error) {
    return Response.json({ 
      error: error instanceof Error ? error.message : 'Job search failed' 
    }, { status: 500 });
  }
}
