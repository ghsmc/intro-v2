import { NextResponse } from 'next/server';
import { auth } from '@/app/(auth)/auth';
import { getUser } from '@/lib/db/queries';

export async function GET() {
  try {
    const session = await auth();
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const users = await getUser(session.user.email!);
    
    if (users.length === 0) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const user = users[0];
    
    return NextResponse.json({
      id: user.id,
      email: user.email,
      name: user.name,
      classYear: user.classYear,
      major: user.major,
      // Onboarding data
      energyProfile: user.energyProfile,
      peakMoment: user.peakMoment,
      values: user.values,
      constraints: user.constraints,
      immediateGoal: user.immediateGoal,
      // Resume data
      resume: user.resume,
      resumeData: user.resumeData,
      userSummary: user.userSummary,
      // Onboarding status
      onboardingCompleted: user.onboardingCompleted,
      onboardingEngagement: user.onboardingEngagement,
    });
  } catch (error) {
    console.error('Error fetching user profile:', error);
    return NextResponse.json(
      { error: 'Failed to fetch user profile' },
      { status: 500 }
    );
  }
}
