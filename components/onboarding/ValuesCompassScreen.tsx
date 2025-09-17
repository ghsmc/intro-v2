'use client';

import { OnboardingData } from '@/app/(auth)/onboarding/page';
import { Button } from '@/components/ui/button';

interface ValuesCompassScreenProps {
  data: OnboardingData;
  onNext: () => void;
  onPrev: () => void;
  onUpdate: (updates: Partial<OnboardingData>) => void;
}

const values = [
  'intellectual_challenge',
  'social_impact',
  'high_earning_potential',
  'work_life_balance',
  'creative_expression',
  'building_something_new',
];

const valueLabels: Record<string, string> = {
  intellectual_challenge: 'Intellectual challenge every day',
  social_impact: 'Direct social impact',
  high_earning_potential: 'High earning potential (>$100k)',
  work_life_balance: 'Work-life balance',
  creative_expression: 'Creative expression',
  building_something_new: 'Building something new',
};

export function ValuesCompassScreen({ data, onNext, onPrev, onUpdate }: ValuesCompassScreenProps) {
  const toggleValue = (value: string) => {
    const currentValues = data.values;
    if (currentValues.includes(value)) {
      onUpdate({ values: currentValues.filter(v => v !== value) });
    } else if (currentValues.length < 3) {
      onUpdate({ values: [...currentValues, value] });
    }
  };

  const isComplete = data.values.length === 3;

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
        <h3 className="font-semibold text-xl dark:text-zinc-50">Values Compass</h3>
        <p className="text-muted-foreground text-sm dark:text-zinc-400">
          What matters most in your future work? Pick your TOP 3:
        </p>
      </div>

      <div className="flex flex-col gap-4 px-4 sm:px-16">
        <div className="grid grid-cols-1 gap-3">
          {values.map((value) => {
            const isSelected = data.values.includes(value);
            const canSelect = data.values.length < 3 || isSelected;
            
            return (
              <button
                key={value}
                onClick={() => toggleValue(value)}
                disabled={!canSelect}
                className={`p-3 rounded border text-left transition-all ${
                  isSelected
                    ? 'border-primary bg-primary/10'
                    : canSelect
                    ? 'border-input hover:bg-muted'
                    : 'border-input bg-muted text-muted-foreground cursor-not-allowed'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-4 h-4 rounded border flex items-center justify-center ${
                    isSelected
                      ? 'border-primary bg-primary'
                      : 'border-input'
                  }`}>
                    {isSelected && (
                      <span className="text-primary-foreground text-xs">✓</span>
                    )}
                  </div>
                  <span className="text-sm">{valueLabels[value]}</span>
                </div>
              </button>
            );
          })}
        </div>

        <p className="text-xs text-muted-foreground">
          Selected: {data.values.length}/3 values
        </p>
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
