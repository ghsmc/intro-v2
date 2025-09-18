'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { 
  Briefcase, 
  Users, 
  Target, 
  Calendar, 
  TrendingUp, 
  ExternalLink,
  Star,
  Clock,
  DollarSign,
  Settings,
  Search,
  Brain,
  Database,
  Zap,
  CheckCircle,
  Loader2,
  AlertCircle
} from 'lucide-react';

interface CareerPath {
  title: string;
  description: string;
  fitScore: number;
  reasoning: string;
  requiredSkills: string[];
  skillGaps: string[];
  timeToReady: string;
  averageSalary: string;
  growthPotential: string;
}

interface JobOpportunity {
  title: string;
  link: string;
  snippet: string;
  source: string;
  careerPath: string;
  relevanceScore: number;
  date?: string;
}

interface AlumniMatch {
  name: string;
  role: string;
  company: string;
  linkedInUrl: string;
  relevanceScore: number;
  connectionPath: string;
  outreachTemplate: string;
}

interface ActionPlan {
  immediate: Array<{
    action: string;
    deadline: string;
    priority: 'High' | 'Medium' | 'Low';
    effort: string;
  }>;
  thisWeek: string[];
  thisMonth: string[];
  skillDevelopment: Array<{
    skill: string;
    resource: string;
    timeCommitment: string;
  }>;
  milestones: Array<{
    milestone: string;
    targetDate: string;
    success_metric: string;
  }>;
}

interface CareerAutopilotResultsProps {
  results: {
    careerPaths: CareerPath[];
    jobOpportunities: JobOpportunity[];
    alumniMatches: AlumniMatch[];
    actionPlan: ActionPlan;
    networkingStrategy: any;
    applicationStrategy: any;
    debugInfo?: {
      processingSteps: Array<{
        step: string;
        status: 'completed' | 'processing' | 'pending';
        duration?: number;
        details?: string;
        searchQueries?: string[];
        resultsCount?: number;
      }>;
      performanceMetrics: {
        totalDuration: number;
        aiCalls: number;
        webSearches: number;
        jobSearches: number;
      };
    };
  };
}

export function CareerAutopilotResults({ results }: CareerAutopilotResultsProps) {
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set(['career-paths']));

  const toggleSection = (section: string) => {
    const newExpanded = new Set(expandedSections);
    if (newExpanded.has(section)) {
      newExpanded.delete(section);
    } else {
      newExpanded.add(section);
    }
    setExpandedSections(newExpanded);
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'High': return 'bg-red-100 text-red-800 border-red-200';
      case 'Medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'Low': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getGrowthPotentialColor = (potential: string) => {
    switch (potential) {
      case 'High': return 'text-green-600';
      case 'Medium': return 'text-yellow-600';
      case 'Low': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className='space-y-2 text-center'>
        <h2 className='font-bold text-2xl text-foreground'>🚀 Career Autopilot Results</h2>
        <p className="text-muted-foreground">
          Your personalized career strategy is ready! Here's your comprehensive action plan.
        </p>
      </div>

      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="careers">Career Paths</TabsTrigger>
          <TabsTrigger value="jobs">Job Opportunities</TabsTrigger>
          <TabsTrigger value="network">Networking</TabsTrigger>
          <TabsTrigger value="debug">Under the Hood</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          {/* Quick Stats */}
          <div className='grid grid-cols-1 gap-4 md:grid-cols-4'>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center space-x-2">
                  <Target className="h-5 w-5 text-blue-600" />
                  <div>
                    <p className='font-medium text-sm'>Career Paths</p>
                    <p className='font-bold text-2xl'>{results.careerPaths.length}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center space-x-2">
                  <Briefcase className="h-5 w-5 text-green-600" />
                  <div>
                    <p className='font-medium text-sm'>Job Opportunities</p>
                    <p className='font-bold text-2xl'>{results.jobOpportunities.length}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center space-x-2">
                  <Users className="h-5 w-5 text-purple-600" />
                  <div>
                    <p className='font-medium text-sm'>Alumni Connections</p>
                    <p className='font-bold text-2xl'>{results.alumniMatches.length}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center space-x-2">
                  <Calendar className="h-5 w-5 text-orange-600" />
                  <div>
                    <p className='font-medium text-sm'>Action Items</p>
                    <p className='font-bold text-2xl'>{results.actionPlan.immediate?.length || 0}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Top Career Paths Preview */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Target className="h-5 w-5" />
                <span>Top Career Paths</span>
              </CardTitle>
              <CardDescription>
                Your highest-scoring career opportunities
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {results.careerPaths.slice(0, 3).map((path, index) => (
                  <div key={index} className='flex items-center justify-between rounded-lg border p-4'>
                    <div className="flex-1">
                      <h4 className="font-semibold">{path.title}</h4>
                      <p className='line-clamp-2 text-muted-foreground text-sm'>{path.description}</p>
                      <div className='mt-2 flex items-center space-x-4'>
                        <div className="flex items-center space-x-1">
                          <Star className="h-4 w-4 text-yellow-500" />
                          <span className='font-medium text-sm'>{path.fitScore}% fit</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Clock className="h-4 w-4 text-blue-500" />
                          <span className="text-sm">{path.timeToReady}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <DollarSign className="h-4 w-4 text-green-500" />
                          <span className="text-sm">{path.averageSalary}</span>
                        </div>
                      </div>
                    </div>
                    <div className="ml-4">
                      <Progress value={path.fitScore} className="w-20" />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Immediate Actions */}
          {results.actionPlan.immediate && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Calendar className="h-5 w-5" />
                  <span>Immediate Actions (Next 48 Hours)</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {results.actionPlan.immediate.slice(0, 5).map((action, index) => (
                    <div key={index} className='flex items-center justify-between rounded-lg bg-muted/50 p-3'>
                      <div className="flex-1">
                        <p className="font-medium">{action.action}</p>
                        <p className='text-muted-foreground text-sm'>Due: {action.deadline}</p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge className={getPriorityColor(action.priority)}>
                          {action.priority}
                        </Badge>
                        <span className='text-muted-foreground text-sm'>{action.effort}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* Career Paths Tab */}
        <TabsContent value="careers" className="space-y-6">
          {results.careerPaths.map((path, index) => (
            <Card key={index}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="flex items-center space-x-2">
                      <Target className="h-5 w-5" />
                      <span>{path.title}</span>
                    </CardTitle>
                    <CardDescription className="mt-2">{path.description}</CardDescription>
                  </div>
                  <div className="text-right">
                    <div className='font-bold text-2xl text-blue-600'>{path.fitScore}%</div>
                    <div className='text-muted-foreground text-sm'>Fit Score</div>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className='grid grid-cols-1 gap-4 md:grid-cols-3'>
                  <div className="flex items-center space-x-2">
                    <Clock className="h-4 w-4 text-blue-500" />
                    <div>
                      <p className='font-medium text-sm'>Time to Ready</p>
                      <p className='text-muted-foreground text-sm'>{path.timeToReady}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <DollarSign className="h-4 w-4 text-green-500" />
                    <div>
                      <p className='font-medium text-sm'>Average Salary</p>
                      <p className='text-muted-foreground text-sm'>{path.averageSalary}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <TrendingUp className={`h-4 w-4 ${getGrowthPotentialColor(path.growthPotential)}`} />
                    <div>
                      <p className='font-medium text-sm'>Growth Potential</p>
                      <p className={`font-medium text-sm ${getGrowthPotentialColor(path.growthPotential)}`}>
                        {path.growthPotential}
                      </p>
                    </div>
                  </div>
                </div>

                <Separator />

                <div>
                  <h4 className='mb-2 font-semibold'>Why This Path Fits You</h4>
                  <p className='text-muted-foreground text-sm'>{path.reasoning}</p>
                </div>

                <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
                  <div>
                    <h4 className='mb-2 font-semibold'>Required Skills</h4>
                    <div className="flex flex-wrap gap-1">
                      {path.requiredSkills.map((skill, skillIndex) => (
                        <Badge key={skillIndex} variant="secondary">{skill}</Badge>
                      ))}
                    </div>
                  </div>
                  <div>
                    <h4 className='mb-2 font-semibold'>Skill Gaps to Address</h4>
                    <div className="flex flex-wrap gap-1">
                      {path.skillGaps.map((gap, gapIndex) => (
                        <Badge key={gapIndex} variant="outline" className='border-orange-200 text-orange-600'>
                          {gap}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        {/* Job Opportunities Tab */}
        <TabsContent value="jobs" className="space-y-6">
          <div className="space-y-4">
            {results.jobOpportunities.map((job, index) => (
              <Card key={index}>
                <CardContent className="p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h4 className="font-semibold text-lg">{job.title}</h4>
                      <div className='mt-1 flex items-center space-x-4'>
                        <span className='text-muted-foreground text-sm'>{job.source}</span>
                        <Badge variant="outline">{job.careerPath}</Badge>
                        <div className="flex items-center space-x-1">
                          <Star className="h-4 w-4 text-yellow-500" />
                          <span className='font-medium text-sm'>{job.relevanceScore}% match</span>
                        </div>
                      </div>
                      <p className='mt-2 line-clamp-2 text-muted-foreground text-sm'>{job.snippet}</p>
                    </div>
                    <div className="ml-4">
                      <Button asChild size="sm">
                        <a href={job.link} target="_blank" rel="noopener noreferrer">
                          Apply <ExternalLink className='ml-1 h-4 w-4' />
                        </a>
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Networking Tab */}
        <TabsContent value="network" className="space-y-6">
          <div className="space-y-4">
            {results.alumniMatches.map((alum, index) => (
              <Card key={index}>
                <CardContent className="p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h4 className="font-semibold text-lg">{alum.name}</h4>
                      <p className='text-muted-foreground text-sm'>{alum.role} at {alum.company}</p>
                      <div className='mt-2 flex items-center space-x-4'>
                        <div className="flex items-center space-x-1">
                          <Star className="h-4 w-4 text-yellow-500" />
                          <span className='font-medium text-sm'>{alum.relevanceScore}% relevance</span>
                        </div>
                        <Badge variant="outline">{alum.connectionPath}</Badge>
                      </div>
                      <div className='mt-3 rounded-lg bg-muted/50 p-3'>
                        <h5 className='mb-1 font-medium text-sm'>Suggested Outreach Message:</h5>
                        <p className='text-muted-foreground text-sm'>{alum.outreachTemplate}</p>
                      </div>
                    </div>
                    <div className="ml-4">
                      <Button asChild size="sm" variant="outline">
                        <a href={alum.linkedInUrl} target="_blank" rel="noopener noreferrer">
                          Connect <ExternalLink className='ml-1 h-4 w-4' />
                        </a>
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Debug Tab - Under the Hood */}
        <TabsContent value="debug" className="space-y-6">
          <div className="space-y-6">
            {/* Performance Metrics */}
            {results.debugInfo?.performanceMetrics && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Zap className="h-5 w-5" />
                    <span>Performance Metrics</span>
                  </CardTitle>
                  <CardDescription>
                    Real-time performance data from the career autopilot engine
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className='grid grid-cols-2 gap-4 md:grid-cols-4'>
                    <div className='rounded-lg bg-muted/50 p-4 text-center'>
                      <div className='font-bold text-2xl text-blue-600'>
                        {Math.round(results.debugInfo.performanceMetrics.totalDuration / 1000)}s
                      </div>
                      <div className='text-muted-foreground text-sm'>Total Duration</div>
                    </div>
                    <div className='rounded-lg bg-muted/50 p-4 text-center'>
                      <div className='font-bold text-2xl text-purple-600'>
                        {results.debugInfo.performanceMetrics.aiCalls}
                      </div>
                      <div className='text-muted-foreground text-sm'>AI Model Calls</div>
                    </div>
                    <div className='rounded-lg bg-muted/50 p-4 text-center'>
                      <div className='font-bold text-2xl text-green-600'>
                        {results.debugInfo.performanceMetrics.webSearches}
                      </div>
                      <div className='text-muted-foreground text-sm'>Web Searches</div>
                    </div>
                    <div className='rounded-lg bg-muted/50 p-4 text-center'>
                      <div className='font-bold text-2xl text-orange-600'>
                        {results.debugInfo.performanceMetrics.jobSearches}
                      </div>
                      <div className='text-muted-foreground text-sm'>Job Searches</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Processing Steps */}
            {results.debugInfo?.processingSteps && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Settings className="h-5 w-5" />
                    <span>Processing Steps</span>
                  </CardTitle>
                  <CardDescription>
                    Detailed breakdown of each step in the career autopilot process
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {results.debugInfo.processingSteps.map((step, index) => (
                      <div key={index} className='flex items-start space-x-3 rounded-lg border p-4'>
                        <div className='mt-1 flex-shrink-0'>
                          {step.status === 'completed' && (
                            <CheckCircle className="h-5 w-5 text-green-600" />
                          )}
                          {step.status === 'processing' && (
                            <Loader2 className='h-5 w-5 animate-spin text-blue-600' />
                          )}
                          {step.status === 'pending' && (
                            <AlertCircle className="h-5 w-5 text-gray-400" />
                          )}
                        </div>
                        <div className='min-w-0 flex-1'>
                          <div className="flex items-center justify-between">
                            <h4 className="font-semibold">{step.step}</h4>
                            {step.duration && (
                              <span className='text-muted-foreground text-sm'>
                                {step.duration}ms
                              </span>
                            )}
                          </div>
                          {step.details && (
                            <p className='mt-1 text-muted-foreground text-sm'>
                              {step.details}
                            </p>
                          )}
                          {step.searchQueries && step.searchQueries.length > 0 && (
                            <div className="mt-2">
                              <div className='mb-1 flex items-center space-x-1'>
                                <Search className="h-4 w-4 text-blue-500" />
                                <span className='font-medium text-sm'>Search Queries:</span>
                              </div>
                              <div className="flex flex-wrap gap-1">
                                {step.searchQueries.map((query, queryIndex) => (
                                  <Badge key={queryIndex} variant="outline" className="text-xs">
                                    {query}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                          )}
                          {step.resultsCount !== undefined && (
                            <div className="mt-2 flex items-center space-x-1">
                              <Database className="h-4 w-4 text-green-500" />
                              <span className='text-muted-foreground text-sm'>
                                Found {step.resultsCount} results
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* AI Model Insights */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Brain className="h-5 w-5" />
                  <span>AI Model Insights</span>
                </CardTitle>
                <CardDescription>
                  How the AI analyzed your profile and generated recommendations
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className='rounded-lg bg-muted/50 p-4'>
                    <h4 className='mb-2 font-semibold'>Career Path Analysis</h4>
                    <p className='text-muted-foreground text-sm'>
                      The AI analyzed your resume data, interests, and values to generate personalized career paths. 
                      Each path was scored based on skill alignment (40%), interest alignment (30%), value alignment (20%), and market opportunity (10%).
                    </p>
                  </div>
                  <div className='rounded-lg bg-muted/50 p-4'>
                    <h4 className='mb-2 font-semibold'>Job Search Strategy</h4>
                    <p className='text-muted-foreground text-sm'>
                      Multiple search strategies were employed: direct role searches, entry-level variants, and company-specific searches. 
                      Jobs were scored for relevance and deduplicated to ensure quality results.
                    </p>
                  </div>
                  <div className='rounded-lg bg-muted/50 p-4'>
                    <h4 className='mb-2 font-semibold'>Alumni Network Analysis</h4>
                    <p className='text-muted-foreground text-sm'>
                      Web searches identified Yale alumni in your target fields, with relevance scoring based on career alignment, 
                      seniority level, and company relevance. Personalized outreach templates were generated for each connection.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Data Sources */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Database className="h-5 w-5" />
                  <span>Data Sources & APIs</span>
                </CardTitle>
                <CardDescription>
                  External services and data sources used in the analysis
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
                  <div className='rounded-lg border p-4'>
                    <h4 className='mb-2 font-semibold'>Job Search APIs</h4>
                    <ul className='space-y-1 text-muted-foreground text-sm'>
                      <li>• Real-time job postings</li>
                      <li>• Company information</li>
                      <li>• Salary data</li>
                      <li>• Application tracking</li>
                    </ul>
                  </div>
                  <div className='rounded-lg border p-4'>
                    <h4 className='mb-2 font-semibold'>Web Search</h4>
                    <ul className='space-y-1 text-muted-foreground text-sm'>
                      <li>• Alumni LinkedIn profiles</li>
                      <li>• Company research</li>
                      <li>• Industry trends</li>
                      <li>• Networking opportunities</li>
                    </ul>
                  </div>
                  <div className='rounded-lg border p-4'>
                    <h4 className='mb-2 font-semibold'>AI Models</h4>
                    <ul className='space-y-1 text-muted-foreground text-sm'>
                      <li>• Career path generation</li>
                      <li>• Resume analysis</li>
                      <li>• Outreach templates</li>
                      <li>• Action plan creation</li>
                    </ul>
                  </div>
                  <div className='rounded-lg border p-4'>
                    <h4 className='mb-2 font-semibold'>Yale Data</h4>
                    <ul className='space-y-1 text-muted-foreground text-sm'>
                      <li>• Alumni database</li>
                      <li>• Career services</li>
                      <li>• Student profiles</li>
                      <li>• Historical outcomes</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
