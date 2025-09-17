'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';

interface OnboardingDataDisplayProps {
  userData: {
    energyProfile?: any;
    peakMoment?: string;
    values?: string[];
    constraints?: any;
    immediateGoal?: string;
    onboardingEngagement?: any;
  };
}

const energyLabels: Record<string, string> = {
  solo_work: 'Working alone for deep focus',
  team_lead: 'Leading team discussions',
  data_analysis: 'Analyzing data & patterns',
  creative_problem_solving: 'Creative problem solving',
  helping_individuals: 'Helping individuals',
  building_making: 'Building and making things',
  public_speaking: 'Public speaking',
  writing_storytelling: 'Writing and storytelling',
};

const valueLabels: Record<string, string> = {
  intellectual_challenge: 'Intellectual challenge every day',
  social_impact: 'Direct social impact',
  high_earning_potential: 'High earning potential (>$100k)',
  work_life_balance: 'Work-life balance',
  creative_expression: 'Creative expression',
  building_something_new: 'Building something new',
};

const geographyLabels: Record<string, string> = {
  anywhere: 'Moving anywhere for the right opportunity',
  northeast: 'Staying in Northeast corridor (NYC/Boston/DC)',
  home_location: 'Returning to home location',
  abroad: 'Going abroad',
  not_sure: 'Not sure yet',
};

const salaryLabels: Record<string, string> = {
  '40000': '$40-60k (can prioritize passion)',
  '60000': '$60-80k (comfortable start)',
  '80000': '$80k+ (have loans/family obligations)',
  '0': 'Money isn\'t the main factor',
};

const goalLabels: Record<string, string> = {
  get_my_resume_reviewed: 'Get my resume reviewed',
  find_a_networking_contact: 'Find a networking contact',
  explore_internship_options: 'Explore internship options',
  identify_relevant_courses: 'Identify relevant courses',
};

export function OnboardingDataDisplay({ userData }: OnboardingDataDisplayProps) {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Career Discovery Profile</h3>
      
      {/* Energy Profile */}
      {userData.energyProfile && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Energy Profile</CardTitle>
            <p className="text-xs text-muted-foreground">
              What energizes you most (1 = draining, 5 = energizing)
            </p>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {Object.entries(userData.energyProfile).map(([key, value]) => (
                <div key={key} className="space-y-1">
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-medium">
                      {energyLabels[key] || key}
                    </span>
                    <Badge variant="outline" className="text-xs">{value}/5</Badge>
                  </div>
                  <Progress value={(value as number) * 20} className="h-1" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Peak Moment */}
      {userData.peakMoment && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Peak Moment</CardTitle>
            <p className="text-xs text-muted-foreground">
              A moment when you felt completely absorbed
            </p>
          </CardHeader>
          <CardContent>
            <p className="text-xs leading-relaxed">{userData.peakMoment}</p>
          </CardContent>
        </Card>
      )}

      {/* Values */}
      {userData.values && userData.values.length > 0 && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Core Values</CardTitle>
            <p className="text-xs text-muted-foreground">
              Your top 3 non-negotiable values
            </p>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-1">
              {userData.values.map((value) => (
                <Badge key={value} variant="secondary" className="text-xs">
                  {valueLabels[value] || value}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Constraints */}
      {userData.constraints && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Career Constraints</CardTitle>
            <p className="text-xs text-muted-foreground">
              Your practical considerations
            </p>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {userData.constraints.geography && (
                <div>
                  <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Location Preference</label>
                  <p className="text-xs">{geographyLabels[userData.constraints.geography] || userData.constraints.geography}</p>
                </div>
              )}
              {userData.constraints.salary_minimum && userData.constraints.salary_minimum !== '0' && (
                <div>
                  <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Salary Minimum</label>
                  <p className="text-xs">{salaryLabels[userData.constraints.salary_minimum] || userData.constraints.salary_minimum}</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Immediate Goal */}
      {userData.immediateGoal && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Immediate Goal</CardTitle>
            <p className="text-xs text-muted-foreground">
              What you want to accomplish this week
            </p>
          </CardHeader>
          <CardContent>
            <Badge variant="default" className="text-xs">
              {goalLabels[userData.immediateGoal] || userData.immediateGoal}
            </Badge>
          </CardContent>
        </Card>
      )}

      {/* Engagement Stats */}
      {userData.onboardingEngagement && (
        <Card>
          <CardHeader>
            <CardTitle>Onboarding Stats</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {userData.onboardingEngagement.timeToComplete && (
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">
                    {Math.floor(userData.onboardingEngagement.timeToComplete / 60)}m
                  </div>
                  <p className="text-sm text-muted-foreground">Time to complete</p>
                </div>
              )}
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">
                  {userData.onboardingEngagement.clickedTemplates ? '✓' : '○'}
                </div>
                <p className="text-sm text-muted-foreground">Used templates</p>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">
                  {userData.onboardingEngagement.savedOpportunities?.length || 0}
                </div>
                <p className="text-sm text-muted-foreground">Saved opportunities</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
