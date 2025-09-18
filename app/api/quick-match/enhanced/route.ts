import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/app/(auth)/auth';
import { getCompaniesByDomain } from '@/lib/db/queries/companies';
import { AdvancedCareerMatcher } from '@/lib/ai/matching/advanced-matcher';
import { OnboardingData } from '@/app/(auth)/onboarding/page';

export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { domainType, filters } = await request.json();

    if (!domainType || !['ENGINEERS', 'SOFTWARE', 'FINANCE'].includes(domainType)) {
      return NextResponse.json({ error: 'Invalid domain type' }, { status: 400 });
    }

    // Get user profile from database
    const userResponse = await fetch(`${process.env.NEXTAUTH_URL}/api/user/profile`, {
      headers: {
        'Cookie': request.headers.get('cookie') || '',
      },
    });

    if (!userResponse.ok) {
      return NextResponse.json({ error: 'Failed to fetch user profile' }, { status: 500 });
    }

    const userProfile: OnboardingData = await userResponse.json();

    // Get companies for the domain
    const companies = await getCompaniesByDomain({
      domainType,
      limit: 100,
    });

    if (companies.length === 0) {
      return NextResponse.json({ error: 'No companies found for this domain' }, { status: 404 });
    }

    // Create matcher and generate matches
    const matcher = new AdvancedCareerMatcher(companies, userProfile);
    const matches = await matcher.generateMatches(domainType);

    // Apply filters if provided
    let filteredMatches = matches;
    if (filters) {
      filteredMatches = matches.filter(match => {
        if (filters.minScore && match.matchScore.total < filters.minScore) return false;
        if (filters.jobType && filters.jobType !== 'all' && match.type !== filters.jobType) return false;
        if (filters.experience && filters.experience !== 'all' && match.level !== filters.experience) return false;
        if (filters.location && filters.location !== 'all') {
          if (filters.location === 'remote' && !match.metrics.remote) return false;
          if (filters.location === 'onsite' && match.metrics.remote) return false;
        }
        return true;
      });
    }

    // Sort by match score
    filteredMatches.sort((a, b) => b.matchScore.total - a.matchScore.total);

    return NextResponse.json({
      matches: filteredMatches,
      total: filteredMatches.length,
      domainType,
      userProfile: {
        name: userProfile.name,
        classYear: userProfile.classYear,
        major: userProfile.major,
        energyProfile: userProfile.energyProfile,
        values: userProfile.values,
        constraints: userProfile.constraints,
      },
      metadata: {
        companiesAnalyzed: companies.length,
        processingTime: Date.now(),
        confidence: filteredMatches.length > 0 ? 
          filteredMatches[0].matchScore.confidence : 'low',
      },
    });

  } catch (error) {
    console.error('Enhanced Quick Match API Error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const domainType = searchParams.get('domainType') as 'ENGINEERS' | 'SOFTWARE' | 'FINANCE';

    if (!domainType || !['ENGINEERS', 'SOFTWARE', 'FINANCE'].includes(domainType)) {
      return NextResponse.json({ error: 'Invalid domain type' }, { status: 400 });
    }

    // Get companies for the domain
    const companies = await getCompaniesByDomain({
      domainType,
      limit: 50,
    });

    return NextResponse.json({
      domainType,
      companiesCount: companies.length,
      companies: companies.map(company => ({
        id: company.id,
        name: company.name,
        description: company.description,
        industry: company.industry,
        valuation: company.valuation,
        employees: company.employees,
        location: company.location,
        logoUrl: company.logoUrl,
        trending: company.trending,
        featured: company.featured,
      })),
    });

  } catch (error) {
    console.error('Enhanced Quick Match GET Error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
