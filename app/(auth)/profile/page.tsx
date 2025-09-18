'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Loader2 } from 'lucide-react';
import { UserProfile } from '@/components/profile/UserProfile';
import { OnboardingDataDisplay } from '@/components/profile/OnboardingDataDisplay';
import { ResumeDataDisplay } from '@/components/profile/ResumeDataDisplay';
import { ChatHistoryDisplay } from '@/components/profile/ChatHistoryDisplay';

interface UserProfileData {
  id: string;
  email: string;
  name: string;
  classYear: string;
  major: string;
  energyProfile?: any;
  peakMoment?: string;
  values?: string[];
  constraints?: any;
  immediateGoal?: string;
  resume?: any;
  resumeData?: any;
  userSummary?: any;
  onboardingCompleted?: boolean;
  onboardingEngagement?: any;
}

export default function ProfilePage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [userData, setUserData] = useState<UserProfileData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (status === 'loading') return;
    
    if (!session) {
      router.push('/login');
      return;
    }

    const fetchUserData = async () => {
      try {
        const response = await fetch('/api/user/profile');
        if (!response.ok) {
          throw new Error('Failed to fetch user data');
        }
        const data = await response.json();
        setUserData(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [session, status, router]);

  if (status === 'loading' || loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-center">
          <Loader2 className='mx-auto mb-4 h-8 w-8 animate-spin' />
          <p className='font-semibold text-lg'>Loading your profile...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-center">
          <p className='mb-4 font-semibold text-lg text-red-600'>Error loading profile</p>
          <p className='mb-4 text-muted-foreground'>{error}</p>
          <Button onClick={() => window.location.reload()}>
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  if (!userData) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-center">
          <p className='font-semibold text-lg'>No profile data found</p>
        </div>
      </div>
    );
  }

  return (
    <div className='container mx-auto max-w-4xl px-4 py-8'>
      {/* Header with Back Button and Milo Logo */}
      <div className="mb-6">
        <div className='mb-4 flex items-center justify-between'>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => router.push('/')}
            className="flex items-center gap-2"
          >
            <span className="text-lg">←</span>
            Back
          </Button>
          <div className="flex items-center gap-2">
            <div className='flex h-8 w-8 items-center justify-center rounded-sm border border-red-700 bg-red-600 font-bold text-sm text-white shadow-sm'>
              人
            </div>
            <span className='font-sans font-semibold text-gray-900 text-lg uppercase tracking-tight dark:text-gray-100'>
              MILO
            </span>
          </div>
          <div className="w-16" /> {/* Spacer for centering */}
        </div>
        <h1 className='text-center font-semibold text-2xl'>Profile</h1>
        <p className='mt-1 text-center text-muted-foreground text-sm'>
          Your career discovery data and chat history
        </p>
      </div>

      {/* User Profile */}
      <UserProfile userData={userData} />

      <Separator className="my-6" />

      {/* Onboarding Data */}
      {userData.onboardingCompleted && (
        <>
          <OnboardingDataDisplay userData={userData} />
          <Separator className="my-6" />
        </>
      )}

      {/* Resume Data */}
      {userData.resume && (
        <>
          <ResumeDataDisplay userData={userData} />
          <Separator className="my-6" />
        </>
      )}

      {/* Chat History */}
      <ChatHistoryDisplay userId={userData.id} />

      {/* Actions */}
      <div className="mt-6 flex gap-3">
        {!userData.onboardingCompleted && (
          <Button size="sm" onClick={() => router.push('/onboarding')}>
            Complete Onboarding
          </Button>
        )}
        <Button size="sm" variant="outline" onClick={() => router.push('/')}>
          Back to Chat
        </Button>
      </div>
    </div>
  );
}
