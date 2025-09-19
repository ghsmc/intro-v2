import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/app/(auth)/auth';
import { getUser } from '@/lib/db/queries';
import { generateUUID } from '@/lib/utils';

export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { userId, domain } = await request.json();

    // Get user profile data by email
    const userResults = await getUser(session.user.email || '');
    if (!userResults || userResults.length === 0) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }
    const user = userResults[0];
    
    // Debug: Log user data
    console.log('Retrieved user data:', {
      name: user.name,
      classYear: user.classYear,
      major: user.major,
      values: user.values,
      immediateGoal: user.immediateGoal
    });

    // Create session with existing profile data
    const sessionData = {
      id: generateUUID(),
      userId,
      domain,
      profile: {
        name: user.name || '',
        classYear: user.classYear || '',
        major: user.major || '',
        energyProfile: user.energyProfile || {},
        values: user.values || [],
        peakMoment: user.peakMoment || '',
        constraints: user.constraints || { geography: '', salary_minimum: '' },
        immediateGoal: user.immediateGoal || '',
        skills: [],
        interests: [],
        workStyle: '',
        careerGoals: [],
        dealBreakers: [],
        mustHaves: [],
        locationPreferences: [],
        timeline: ''
      },
      conversation: [],
      matches: [],
      currentStep: 0,
      completed: false
    };

    return NextResponse.json(sessionData);
  } catch (error) {
    console.error('Error initializing Quick Match session:', error);
    return NextResponse.json(
      { error: 'Failed to initialize session' },
      { status: 500 }
    );
  }
}
