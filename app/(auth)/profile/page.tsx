'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
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
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p className="text-lg font-semibold">Loading your profile...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-center">
          <p className="text-lg font-semibold text-red-600 mb-4">Error loading profile</p>
          <p className="text-muted-foreground mb-4">{error}</p>
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
          <p className="text-lg font-semibold">No profile data found</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4 max-w-4xl">
      {/* Header with Back Button and Milo Logo */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
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
            <div className="w-8 h-8 bg-red-600 flex items-center justify-center text-white text-sm font-bold shadow-sm border border-red-700 rounded-sm">
              人
            </div>
            <span className="font-sans font-semibold text-lg tracking-tight text-gray-900 dark:text-gray-100 uppercase">
              MILO
            </span>
          </div>
          <div className="w-16"></div> {/* Spacer for centering */}
        </div>
        <h1 className="text-2xl font-semibold text-center">Profile</h1>
        <p className="text-muted-foreground text-sm mt-1 text-center">
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
