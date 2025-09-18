'use client';

import type { OnboardingData } from '@/app/(auth)/onboarding/page';
import { Button } from '@/components/ui/button';

interface ResultsScreenProps {
  data: OnboardingData;
  onComplete: () => void;
}

export function ResultsScreen({ data, onComplete }: ResultsScreenProps) {
  return (
    <div className="flex flex-col gap-6 overflow-hidden rounded-2xl">
      <div className="flex flex-col items-center justify-center gap-4 px-4 text-center sm:px-16">
        <div className='mb-2 flex items-center gap-2'>
          <div className='flex h-6 w-6 items-center justify-center rounded-sm border border-red-700 bg-red-600 font-bold text-white text-xs shadow-sm'>
            人
          </div>
          <span className='font-sans font-semibold text-gray-900 text-lg uppercase tracking-tight dark:text-gray-100'>
            MILO
          </span>
        </div>
        <h3 className="font-semibold text-xl dark:text-zinc-50">All Set!</h3>
        <p className="text-muted-foreground text-sm dark:text-zinc-400">
          Your career discovery profile has been saved. You can now start exploring opportunities and chatting with Milo.
        </p>
      </div>

      <div className="flex flex-col gap-4 px-4 sm:px-16">
        <div className='rounded-lg bg-muted p-4'>
          <p className='text-muted-foreground text-sm'>
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
