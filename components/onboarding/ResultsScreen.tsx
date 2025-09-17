'use client';

import { OnboardingData } from '@/app/(auth)/onboarding/page';
import { Button } from '@/components/ui/button';

interface ResultsScreenProps {
  data: OnboardingData;
  onComplete: () => void;
}

export function ResultsScreen({ data, onComplete }: ResultsScreenProps) {
  return (
    <div className="flex flex-col gap-6 overflow-hidden rounded-2xl">
      <div className="flex flex-col items-center justify-center gap-4 px-4 text-center sm:px-16">
        <div className="flex items-center gap-2 mb-2">
          <div className="w-6 h-6 bg-red-600 flex items-center justify-center text-white text-xs font-bold shadow-sm border border-red-700 rounded-sm">
            人
          </div>
          <span className="font-sans font-semibold text-lg tracking-tight text-gray-900 dark:text-gray-100 uppercase">
            MILO
          </span>
        </div>
        <h3 className="font-semibold text-xl dark:text-zinc-50">All Set!</h3>
        <p className="text-muted-foreground text-sm dark:text-zinc-400">
          Your career discovery profile has been saved. You can now start exploring opportunities and chatting with Milo.
        </p>
      </div>

      <div className="flex flex-col gap-4 px-4 sm:px-16">
        <div className="bg-muted rounded-lg p-4">
          <p className="text-sm text-muted-foreground">
            ✓ Energy profile saved<br/>
            ✓ Values and constraints recorded<br/>
            ✓ Goals and preferences stored
          </p>
        </div>
      </div>

      <div className="px-4 sm:px-16">
        <Button
          onClick={onComplete}
          className="w-full"
        >
          Start Using Milo
        </Button>
      </div>
    </div>
  );
}
