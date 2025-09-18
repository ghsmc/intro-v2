'use client';

import type { OnboardingData } from '@/app/(auth)/onboarding/page';
import { Button } from '@/components/ui/button';

interface InstantWinScreenProps {
  data: OnboardingData;
  onNext: () => void;
  onPrev: () => void;
  onUpdate: (updates: Partial<OnboardingData>) => void;
}

const immediateGoals = [
  { value: 'summer_internship', label: 'Find a summer internship opportunity' },
  { value: 'connect_alum', label: 'Connect with an alum in my field' },
  { value: 'discover_classes', label: 'Discover classes for next semester' },
  { value: 'research_lab', label: 'Find research/lab positions' },
  { value: 'explore_career', label: 'Explore a career I\'ve never considered' },
  { value: 'funding_opportunity', label: 'Get funding for an unpaid opportunity' },
];

export function InstantWinScreen({ data, onNext, onPrev, onUpdate }: InstantWinScreenProps) {
  const updateImmediateGoal = (value: string) => {
    onUpdate({ immediateGoal: value });
  };

  const isComplete = data.immediateGoal !== '';

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
        <h3 className="font-semibold text-xl dark:text-zinc-50">Instant Win</h3>
        <p className="text-muted-foreground text-sm dark:text-zinc-400">
          What would you like to accomplish THIS WEEK?
        </p>
      </div>

      <div className="flex flex-col gap-4 px-4 sm:px-16">
        {immediateGoals.map((goal) => (
          <label
            key={goal.value}
            className='flex cursor-pointer items-center gap-3 rounded border p-3 transition-all hover:bg-muted'
          >
            <input
              type="radio"
              name="immediateGoal"
              value={goal.value}
              checked={data.immediateGoal === goal.value}
              onChange={(e) => updateImmediateGoal(e.target.value)}
              className='h-4 w-4'
            />
            <span className="text-sm">{goal.label}</span>
          </label>
        ))}
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
          Generate My Career Map
        </Button>
      </div>
    </div>
  );
}
