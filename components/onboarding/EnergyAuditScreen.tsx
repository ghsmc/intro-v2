'use client';

import { OnboardingData } from '@/app/(auth)/onboarding/page';
import { Button } from '@/components/ui/button';

interface EnergyAuditScreenProps {
  data: OnboardingData;
  onNext: () => void;
  onPrev: () => void;
  onUpdate: (updates: Partial<OnboardingData>) => void;
}

const energyQuestions = [
  { key: 'solo_work', text: 'Working alone for deep focus' },
  { key: 'team_lead', text: 'Leading team discussions' },
  { key: 'data_analysis', text: 'Analyzing data & patterns' },
];

export function EnergyAuditScreen({ data, onNext, onPrev, onUpdate }: EnergyAuditScreenProps) {
  const updateEnergyRating = (key: keyof OnboardingData['energyProfile'], rating: number) => {
    onUpdate({
      energyProfile: {
        ...data.energyProfile,
        [key]: rating,
      },
    });
  };

  const isComplete = energyQuestions.every(question => 
    data.energyProfile[question.key as keyof OnboardingData['energyProfile']] > 0
  );

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
        <h3 className="font-semibold text-xl dark:text-zinc-50">Energy Audit</h3>
        <p className="text-muted-foreground text-sm dark:text-zinc-400">
          What actually energizes you? Rate from 1 (draining) to 5 (energizing):
        </p>
      </div>

      <div className="flex flex-col gap-4 px-4 sm:px-16">
        {energyQuestions.map((question) => (
          <div key={question.key} className="space-y-3">
            <p className="text-sm font-medium">
              {question.text}
            </p>
            <div className="flex items-center gap-2">
              {[1, 2, 3, 4, 5].map((rating) => (
                <button
                  key={rating}
                  onClick={() => updateEnergyRating(question.key as keyof OnboardingData['energyProfile'], rating)}
                  className={`w-8 h-8 rounded border transition-all ${
                    data.energyProfile[question.key as keyof OnboardingData['energyProfile']] === rating
                      ? 'bg-primary text-primary-foreground'
                      : 'border-input hover:bg-muted'
                  }`}
                >
                  <span className="text-sm">{rating}</span>
                </button>
              ))}
            </div>
          </div>
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
          Next
        </Button>
      </div>
    </div>
  );
}
