'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { WelcomeScreen } from '@/components/onboarding/WelcomeScreen';
import { EnergyAuditScreen } from '@/components/onboarding/EnergyAuditScreen';
import { PeakMomentsScreen } from '@/components/onboarding/PeakMomentsScreen';
import { ValuesCompassScreen } from '@/components/onboarding/ValuesCompassScreen';
import { RealityCheckScreen } from '@/components/onboarding/RealityCheckScreen';
import { InstantWinScreen } from '@/components/onboarding/InstantWinScreen';
import { ResumeUploadScreen } from '@/components/onboarding/ResumeUploadScreen';
import { ResultsScreen } from '@/components/onboarding/ResultsScreen';

export interface OnboardingData {
  // User info
  name: string;
  classYear: string;
  major: string;
  
  // Energy profile (1-5 scale)
  energyProfile: {
    solo_work: number;
    team_lead: number;
    data_analysis: number;
    creative_problem_solving: number;
    helping_individuals: number;
    building_making: number;
    public_speaking: number;
    writing_storytelling: number;
  };
  
  // Peak moment
  peakMoment: string;
  
  // Values (top 3)
  values: string[];
  
  // Constraints
  constraints: {
    geography: string;
    salary_minimum: string;
  };
  
  // Immediate goal
  immediateGoal: string;
  
  // Resume
  resume?: {
    fileName: string;
    fileSize: number;
    uploadedAt: string;
    url: string;
  };
  
  // Engagement tracking
  engagement: {
    timeToComplete: number;
    droppedAtScreen: number | null;
    clickedTemplates: boolean;
    savedOpportunities: string[];
  };
}

export default function OnboardingPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [currentScreen, setCurrentScreen] = useState(1);
  const [onboardingData, setOnboardingData] = useState<OnboardingData>({
    name: '',
    classYear: '',
    major: '',
    energyProfile: {
      solo_work: 0,
      team_lead: 0,
      data_analysis: 0,
      creative_problem_solving: 0,
      helping_individuals: 0,
      building_making: 0,
      public_speaking: 0,
      writing_storytelling: 0,
    },
    peakMoment: '',
    values: [],
    constraints: {
      geography: '',
      salary_minimum: '',
    },
    immediateGoal: '',
    engagement: {
      timeToComplete: 0,
      droppedAtScreen: null,
      clickedTemplates: false,
      savedOpportunities: [],
    },
  });
  const [startTime, setStartTime] = useState<number>(Date.now());

  useEffect(() => {
    if (status === 'loading') return;
    
    if (!session) {
      router.push('/login');
      return;
    }

    // Fetch user data from API
    const fetchUserData = async () => {
      if (session.user?.email) {
        try {
          const response = await fetch('/api/user/profile');
          if (response.ok) {
            const user = await response.json();
            console.log('User data from API:', user);
            setOnboardingData(prev => ({
              ...prev,
              name: user.name || '',
              classYear: user.classYear || '',
              major: user.major || '',
            }));
          }
        } catch (error) {
          console.error('Error fetching user data:', error);
        }
      }
    };

    fetchUserData();
  }, [session, status, router]);

  const updateOnboardingData = (updates: Partial<OnboardingData>) => {
    setOnboardingData(prev => ({ ...prev, ...updates }));
  };

  const nextScreen = () => {
    if (currentScreen < 8) {
      setCurrentScreen(prev => prev + 1);
    }
  };

  const prevScreen = () => {
    if (currentScreen > 1) {
      setCurrentScreen(prev => prev - 1);
    }
  };

  const completeOnboarding = async () => {
    const timeToComplete = Math.floor((Date.now() - startTime) / 1000);
    const finalData = {
      ...onboardingData,
      engagement: {
        ...onboardingData.engagement,
        timeToComplete,
      },
    };
    
    try {
      // Save onboarding data to database
      const response = await fetch('/api/onboarding', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(finalData),
      });

      if (!response.ok) {
        throw new Error('Failed to save onboarding data');
      }

      console.log('Onboarding completed and saved:', finalData);
      
      // Redirect to main app
      router.push('/');
    } catch (error) {
      console.error('Error saving onboarding data:', error);
      // Still redirect to main app even if save fails
      router.push('/');
    }
  };

  if (status === 'loading') {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 bg-red-600 flex items-center justify-center text-white text-sm font-bold shadow-sm border border-red-700 rounded-sm mx-auto mb-4">
            人
          </div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!session) {
    return null;
  }

  const renderCurrentScreen = () => {
    switch (currentScreen) {
      case 1:
        return (
          <WelcomeScreen
            data={onboardingData}
            onNext={nextScreen}
            onUpdate={updateOnboardingData}
          />
        );
      case 2:
        return (
          <EnergyAuditScreen
            data={onboardingData}
            onNext={nextScreen}
            onPrev={prevScreen}
            onUpdate={updateOnboardingData}
          />
        );
      case 3:
        return (
          <PeakMomentsScreen
            data={onboardingData}
            onNext={nextScreen}
            onPrev={prevScreen}
            onUpdate={updateOnboardingData}
          />
        );
      case 4:
        return (
          <ValuesCompassScreen
            data={onboardingData}
            onNext={nextScreen}
            onPrev={prevScreen}
            onUpdate={updateOnboardingData}
          />
        );
      case 5:
        return (
          <RealityCheckScreen
            data={onboardingData}
            onNext={nextScreen}
            onPrev={prevScreen}
            onUpdate={updateOnboardingData}
          />
        );
      case 6:
        return (
          <InstantWinScreen
            data={onboardingData}
            onNext={nextScreen}
            onPrev={prevScreen}
            onUpdate={updateOnboardingData}
          />
        );
      case 7:
        return (
          <ResumeUploadScreen
            data={onboardingData}
            onNext={nextScreen}
            onPrev={prevScreen}
            onUpdate={updateOnboardingData}
          />
        );
      case 8:
        return (
          <ResultsScreen
            data={onboardingData}
            onComplete={completeOnboarding}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="flex h-dvh w-screen items-start justify-center bg-background pt-12 md:items-center md:pt-0">
      <div className="flex w-full max-w-2xl flex-col gap-4 overflow-hidden rounded-2xl">
        {/* Progress bar */}
        <div className="px-4 sm:px-16">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-muted-foreground">Step {currentScreen} of 8</span>
            <span className="text-sm text-muted-foreground">{Math.round((currentScreen / 8) * 100)}%</span>
          </div>
          <div className="w-full bg-muted rounded-full h-1">
            <div
              className="bg-primary h-1 rounded-full transition-all duration-300"
              style={{ width: `${(currentScreen / 8) * 100}%` }}
            />
          </div>
        </div>

        {/* Current screen */}
        {renderCurrentScreen()}
      </div>
    </div>
  );
}
