import { type NextRequest, NextResponse } from 'next/server';
import { auth } from '@/app/(auth)/auth';
import { updateUserOnboarding } from '@/lib/db/queries';
import type { OnboardingData } from '@/app/(auth)/onboarding/page';

export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const onboardingData: OnboardingData = await request.json();

    // Update user with onboarding data
    await updateUserOnboarding(session.user.id, {
      energyProfile: onboardingData.energyProfile,
      peakMoment: onboardingData.peakMoment,
      values: onboardingData.values,
      constraints: onboardingData.constraints,
      immediateGoal: onboardingData.immediateGoal,
      resume: onboardingData.resume,
      onboardingCompleted: true,
      onboardingEngagement: onboardingData.engagement,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error saving onboarding data:', error);
    return NextResponse.json(
      { error: 'Failed to save onboarding data' },
      { status: 500 }
    );
  }
}
