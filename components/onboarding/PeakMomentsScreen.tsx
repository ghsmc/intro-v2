'use client';

import type { OnboardingData } from '@/app/(auth)/onboarding/page';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';

interface PeakMomentsScreenProps {
  data: OnboardingData;
  onNext: () => void;
  onPrev: () => void;
  onUpdate: (updates: Partial<OnboardingData>) => void;
}

export function PeakMomentsScreen({ data, onNext, onPrev, onUpdate }: PeakMomentsScreenProps) {
  const updatePeakMoment = (value: string) => {
    onUpdate({ peakMoment: value });
  };

  const isComplete = data.peakMoment.trim().length > 20;

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
        <h3 className="font-semibold text-xl dark:text-zinc-50">Peak Moments</h3>
        <p className="text-muted-foreground text-sm dark:text-zinc-400">
          Tell us about ONE moment when you felt completely absorbed in what you were doing
        </p>
      </div>

      <div className="flex flex-col gap-4 px-4 sm:px-16">
        <div className="space-y-2">
          <p className='text-muted-foreground text-sm'>
            Could be in class, extracurricular, job, or personal project. When did time fly by?
          </p>
          <Textarea
            value={data.peakMoment}
            onChange={(e) => updatePeakMoment(e.target.value)}
            placeholder="Last week in my economics problem set, I spent 3 hours building a model to predict market trends. I completely lost track of time because I was so focused on finding the right variables and testing different scenarios..."
            className="min-h-[120px]"
          />
          <p className='text-muted-foreground text-xs'>
            {data.peakMoment.length} characters
          </p>
        </div>
      </div>

      <div className="flex justify-between px-4 sm:px-16">
        <Button
          onClick={onPrev}
          variant="outline"
        >
          Back
        </Button>
        <Button
          onClick={onNext}
          disabled={!isComplete}
        >
          Next
        </Button>
      </div>
    </div>
  );
}
