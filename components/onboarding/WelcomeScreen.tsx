'use client';

import { OnboardingData } from '@/app/(auth)/onboarding/page';
import { Button } from '@/components/ui/button';

interface WelcomeScreenProps {
  data: OnboardingData;
  onNext: () => void;
  onUpdate: (updates: Partial<OnboardingData>) => void;
}

export function WelcomeScreen({ data, onNext }: WelcomeScreenProps) {
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
        <h3 className="font-semibold text-xl dark:text-zinc-50">Welcome, {data.name}!</h3>
        <p className="text-muted-foreground text-sm dark:text-zinc-400">
          Let's help you discover careers you'll love.
        </p>
        <p className="text-sm text-muted-foreground">
          Yale Class of {data.classYear} • {data.major}
        </p>
      </div>

      <div className="flex flex-col gap-4 px-4 sm:px-16">
        <p className="text-sm text-muted-foreground mb-4">This takes just 5 minutes and gets you:</p>
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="text-sm">✓</span>
            <span className="text-sm">Personalized career matches</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm">✓</span>
            <span className="text-sm">Yale-specific opportunities</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm">✓</span>
            <span className="text-sm">Your first networking template</span>
          </div>
        </div>
      </div>

      <div className="px-4 sm:px-16">
        <Button
          onClick={onNext}
          className="w-full"
        >
          Continue
        </Button>
      </div>
    </div>
  );
}
