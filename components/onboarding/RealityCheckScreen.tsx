'use client';

import type { OnboardingData } from '@/app/(auth)/onboarding/page';
import { Button } from '@/components/ui/button';

interface RealityCheckScreenProps {
  data: OnboardingData;
  onNext: () => void;
  onPrev: () => void;
  onUpdate: (updates: Partial<OnboardingData>) => void;
}

const geographyOptions = [
  { value: 'anywhere', label: 'Moving anywhere for the right opportunity' },
  { value: 'northeast', label: 'Staying in Northeast corridor (NYC/Boston/DC)' },
  { value: 'home', label: 'Returning to home location' },
  { value: 'abroad', label: 'Going abroad' },
  { value: 'not_sure', label: 'Not sure yet' },
];

const salaryOptions = [
  { value: '40-60k', label: '$40-60k (can prioritize passion)' },
  { value: '60-80k', label: '$60-80k (comfortable start)' },
  { value: '80k+', label: '$80k+ (have loans/family obligations)' },
  { value: 'flexible', label: 'Money isn\'t the main factor' },
];

export function RealityCheckScreen({ data, onNext, onPrev, onUpdate }: RealityCheckScreenProps) {
  const updateGeography = (value: string) => {
    onUpdate({
      constraints: {
        ...data.constraints,
        geography: value,
      },
    });
  };

  const updateSalary = (value: string) => {
    onUpdate({
      constraints: {
        ...data.constraints,
        salary_minimum: value,
      },
    });
  };

  const isComplete = data.constraints.geography && data.constraints.salary_minimum;

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
        <h3 className="font-semibold text-xl dark:text-zinc-50">Reality Check</h3>
        <p className="text-muted-foreground text-sm dark:text-zinc-400">
          Let's be practical for a second:
        </p>
      </div>

      <div className="flex flex-col gap-4 px-4 sm:px-16">
        {/* Geography Question */}
        <div className="space-y-3">
          <h3 className='font-medium text-sm'>
            After Yale, I'm open to:
          </h3>
          <div className="space-y-2">
            {geographyOptions.map((option) => (
              <label
                key={option.value}
                className='flex cursor-pointer items-center gap-3 rounded border p-3 transition-all hover:bg-muted'
              >
                <input
                  type="radio"
                  name="geography"
                  value={option.value}
                  checked={data.constraints.geography === option.value}
                  onChange={(e) => updateGeography(e.target.value)}
                  className='h-4 w-4'
                />
                <span className="text-sm">{option.label}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Salary Question */}
        <div className="space-y-3">
          <h3 className='font-medium text-sm'>
            I need to earn at least:
          </h3>
          <div className="space-y-2">
            {salaryOptions.map((option) => (
              <label
                key={option.value}
                className='flex cursor-pointer items-center gap-3 rounded border p-3 transition-all hover:bg-muted'
              >
                <input
                  type="radio"
                  name="salary"
                  value={option.value}
                  checked={data.constraints.salary_minimum === option.value}
                  onChange={(e) => updateSalary(e.target.value)}
                  className='h-4 w-4'
                />
                <span className="text-sm">{option.label}</span>
              </label>
            ))}
          </div>
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
