'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { JobCard } from './JobCard';
import { JobSearchLoader } from './JobSearchLoader';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Search, 
  Filter, 
  MapPin, 
  Clock, 
  Building, 
  Users, 
  TrendingUp,
  ExternalLink,
  Star,
  Zap,
  Target,
  Brain,
  Database,
  CheckCircle,
  AlertCircle,
  RefreshCw
} from 'lucide-react';
import { useDomain } from '@/components/domain-provider';

interface JobSearchFilters {
  query: string;
  location: string;
  jobType: string;
  experienceLevel: string;
  domain: string;
  minScore: number;
}

interface SearchStep {
  step: string;
  status: 'pending' | 'processing' | 'completed' | 'error';
  details: string;
  duration?: number;
  resultsCount?: number;
}

interface JobResult {
  id: string;
  title: string;
  company: string;
  companyId: string;
  location: string;
  description: string;
  requirements: string[];
  responsibilities: string[];
  benefits: string[];
  salary?: string;
  type: 'full-time' | 'part-time' | 'internship' | 'contract';
  level: 'entry' | 'mid' | 'senior' | 'lead' | 'executive';
  postedDate?: string;
  applyUrl: string;
  source: string;
  companyLogo?: string;
  team?: string;
  culture?: string;
  mission?: string;
  urgency: 'closing-soon' | 'just-opened' | 'high-demand' | 'normal';
  matchScore?: number;
}

interface EnhancedJobSearchProps {
  isDark?: boolean;
}

export function EnhancedJobSearch({ isDark = false }: EnhancedJobSearchProps) {
  const { selectedDomain } = useDomain();
  const [isSearching, setIsSearching] = useState(false);
  const [jobs, setJobs] = useState<JobResult[]>([]);
  const [filters, setFilters] = useState<JobSearchFilters>({
    query: '',
    location: '',
    jobType: 'all',
    experienceLevel: 'all',
    domain: selectedDomain,
    minScore: 70
  });
  const [searchSteps, setSearchSteps] = useState<SearchStep[]>([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [searchStats, setSearchStats] = useState({
    totalDuration: 0,
    companiesSearched: 0,
    totalFound: 0
  });
  const [sortBy, setSortBy] = useState<'relevance' | 'salary' | 'company' | 'date'>('relevance');
  const [expandedJob, setExpandedJob] = useState<string | null>(null);

  const performSearch = async () => {
    setIsSearching(true);
    setJobs([]);
    setSearchSteps([]);
    setCurrentStep(0);
    setSearchStats({ totalDuration: 0, companiesSearched: 0, totalFound: 0 });

    const startTime = Date.now();
    
    // Initialize search steps
    const steps: SearchStep[] = [
      {
        step: "Initializing search parameters",
        status: "processing",
        details: "Setting up search criteria and target companies",
        duration: 0
      },
      {
        step: "Scanning company career pages",
        status: "pending",
        details: "Accessing direct company career sites",
        duration: 0
      },
      {
        step: "Analyzing job descriptions",
        status: "pending",
        details: "Extracting requirements and responsibilities",
        duration: 0
      },
      {
        step: "Calculating match scores",
        status: "pending",
        details: "Evaluating compatibility with your profile",
        duration: 0
      },
      {
        step: "Ranking and filtering results",
        status: "pending",
        details: "Sorting by relevance and quality",
        duration: 0
      }
    ];

    setSearchSteps(steps);

    try {
      // Step 1: Initialize
      await new Promise(resolve => setTimeout(resolve, 500));
      setSearchSteps(prev => prev.map((step, i) => 
        i === 0 ? { ...step, status: 'completed', duration: 500 } : step
      ));
      setCurrentStep(1);

      // Step 2: Scan companies
      setSearchSteps(prev => prev.map((step, i) => 
        i === 1 ? { ...step, status: 'processing' } : step
      ));
      await new Promise(resolve => setTimeout(resolve, 1200));

      // Step 3: Analyze descriptions
      setSearchSteps(prev => prev.map((step, i) => 
        i === 1 ? { ...step, status: 'completed', duration: 1200, resultsCount: 15 } :
        i === 2 ? { ...step, status: 'processing' } : step
      ));
      setCurrentStep(2);
      await new Promise(resolve => setTimeout(resolve, 800));

      // Step 4: Calculate scores
      setSearchSteps(prev => prev.map((step, i) => 
        i === 2 ? { ...step, status: 'completed', duration: 800 } :
        i === 3 ? { ...step, status: 'processing' } : step
      ));
      setCurrentStep(3);
      await new Promise(resolve => setTimeout(resolve, 600));

      // Step 5: Finalize results
      setSearchSteps(prev => prev.map((step, i) => 
        i === 3 ? { ...step, status: 'completed', duration: 600 } :
        i === 4 ? { ...step, status: 'processing' } : step
      ));
      setCurrentStep(4);
      await new Promise(resolve => setTimeout(resolve, 400));

      // Generate mock results (replace with actual API call)
      const mockJobs: JobResult[] = generateMockJobs(filters);
      
      setSearchSteps(prev => prev.map((step, i) => 
        i === 4 ? { ...step, status: 'completed', duration: 400, resultsCount: mockJobs.length } : step
      ));

      const totalDuration = Date.now() - startTime;
      setSearchStats({
        totalDuration,
        companiesSearched: 8,
        totalFound: mockJobs.length
      });

      setJobs(mockJobs);
    } catch (error) {
      console.error('Search error:', error);
      setSearchSteps(prev => prev.map(step => 
        step.status === 'processing' ? { ...step, status: 'error' } : step
      ));
    } finally {
      setIsSearching(false);
    }
  };

  const generateMockJobs = (filters: JobSearchFilters): JobResult[] => {
    const companies = [
      { name: 'OpenAI', logo: 'https://openai.com/favicon.ico', id: 'openai' },
      { name: 'Anthropic', logo: 'https://www.anthropic.com/favicon.ico', id: 'anthropic' },
      { name: 'Stripe', logo: 'https://stripe.com/favicon.ico', id: 'stripe' },
      { name: 'Databricks', logo: 'https://www.databricks.com/favicon.ico', id: 'databricks' },
      { name: 'Figma', logo: 'https://www.figma.com/favicon.ico', id: 'figma' },
      { name: 'Notion', logo: 'https://www.notion.so/favicon.ico', id: 'notion' },
      { name: 'Linear', logo: 'https://linear.app/favicon.ico', id: 'linear' },
      { name: 'Vercel', logo: 'https://vercel.com/favicon.ico', id: 'vercel' }
    ];

    const jobTitles = [
      'Software Engineer', 'ML Engineer', 'Product Manager', 'UX Designer',
      'Data Scientist', 'DevOps Engineer', 'Frontend Engineer', 'Backend Engineer',
      'Full Stack Engineer', 'AI Research Engineer', 'Product Designer', 'Technical Writer'
    ];

    return companies.slice(0, 6).map((company, index) => ({
      id: `${company.id}-${index}`,
      title: jobTitles[index % jobTitles.length],
      company: company.name,
      companyId: company.id,
      location: ['San Francisco', 'New York', 'Remote', 'Seattle'][index % 4],
      description: `Join ${company.name} to work on cutting-edge technology and build products that millions of users love. We're looking for passionate individuals who want to make a real impact.`,
      requirements: [
        'Bachelor\'s degree in Computer Science or related field',
        '2+ years of relevant experience',
        'Strong problem-solving skills',
        'Experience with modern development tools'
      ],
      responsibilities: [
        'Design and implement scalable solutions',
        'Collaborate with cross-functional teams',
        'Write clean, maintainable code',
        'Participate in code reviews'
      ],
      benefits: ['Health Insurance', 'Dental', 'Vision', '401k', 'Equity', 'Unlimited PTO'],
      salary: ['$120k-180k', '$150k-250k', '$100k-160k', '$130k-200k'][index % 4],
      type: 'full-time' as const,
      level: 'mid' as const,
      postedDate: '2 days ago',
      applyUrl: `https://${company.id}.com/careers`,
      source: 'Company Career Page',
      companyLogo: company.logo,
      team: `Join our collaborative ${company.name} team`,
      culture: 'Innovative and fast-paced environment',
      mission: `Help ${company.name} achieve its mission`,
      urgency: ['normal', 'high-demand', 'just-opened', 'normal'][index % 4] as any,
      matchScore: 85 + Math.random() * 15
    }));
  };

  const filteredJobs = jobs.filter(job => {
    if (filters.query && !job.title.toLowerCase().includes(filters.query.toLowerCase()) && 
        !job.description.toLowerCase().includes(filters.query.toLowerCase())) {
      return false;
    }
    if (filters.location && !job.location.toLowerCase().includes(filters.location.toLowerCase())) {
      return false;
    }
    if (filters.jobType !== 'all' && job.type !== filters.jobType) {
      return false;
    }
    if (filters.experienceLevel !== 'all' && job.level !== filters.experienceLevel) {
      return false;
    }
    if (job.matchScore && job.matchScore < filters.minScore) {
      return false;
    }
    return true;
  }).sort((a, b) => {
    switch (sortBy) {
      case 'relevance':
        return (b.matchScore || 0) - (a.matchScore || 0);
      case 'salary':
        return (b.salary || '').localeCompare(a.salary || '');
      case 'company':
        return a.company.localeCompare(b.company);
      case 'date':
        return (b.postedDate || '').localeCompare(a.postedDate || '');
      default:
        return 0;
    }
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center space-y-2">
        <h2 className="text-3xl font-bold text-foreground">🔍 Enhanced Job Search</h2>
        <p className="text-muted-foreground">
          Direct access to company career pages - no middlemen, just real opportunities
        </p>
      </div>

      {/* Search Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Search Filters
          </CardTitle>
          <CardDescription>
            Find opportunities directly from company career pages
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="query">Job Title or Keywords</Label>
              <Input
                id="query"
                placeholder="e.g. Software Engineer, Product Manager"
                value={filters.query}
                onChange={(e) => setFilters(prev => ({ ...prev, query: e.target.value }))}
              />
            </div>
            
            <div>
              <Label htmlFor="location">Location</Label>
              <Input
                id="location"
                placeholder="e.g. San Francisco, Remote"
                value={filters.location}
                onChange={(e) => setFilters(prev => ({ ...prev, location: e.target.value }))}
              />
            </div>
            
            <div>
              <Label htmlFor="jobType">Job Type</Label>
              <Select value={filters.jobType} onValueChange={(value) => setFilters(prev => ({ ...prev, jobType: value }))}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="full-time">Full-time</SelectItem>
                  <SelectItem value="part-time">Part-time</SelectItem>
                  <SelectItem value="internship">Internship</SelectItem>
                  <SelectItem value="contract">Contract</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label htmlFor="experienceLevel">Experience Level</Label>
              <Select value={filters.experienceLevel} onValueChange={(value) => setFilters(prev => ({ ...prev, experienceLevel: value }))}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Levels</SelectItem>
                  <SelectItem value="entry">Entry Level</SelectItem>
                  <SelectItem value="mid">Mid Level</SelectItem>
                  <SelectItem value="senior">Senior Level</SelectItem>
                  <SelectItem value="lead">Lead Level</SelectItem>
                  <SelectItem value="executive">Executive</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label htmlFor="minScore">Min Match Score</Label>
              <div className="flex items-center gap-2">
                <input
                  type="range"
                  min="50"
                  max="100"
                  value={filters.minScore}
                  onChange={(e) => setFilters(prev => ({ ...prev, minScore: parseInt(e.target.value) }))}
                  className="flex-1"
                />
                <span className="text-sm font-medium w-12">{filters.minScore}%</span>
              </div>
            </div>
            
            <div className="flex items-end">
              <Button 
                onClick={performSearch} 
                disabled={isSearching}
                className="w-full"
              >
                {isSearching ? (
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                ) : (
                  <Search className="h-4 w-4 mr-2" />
                )}
                {isSearching ? 'Searching...' : 'Search Jobs'}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Loading State */}
      <JobSearchLoader
        isVisible={isSearching}
        steps={searchSteps}
        currentStep={currentStep}
        totalDuration={searchStats.totalDuration}
        companiesSearched={searchStats.companiesSearched}
        totalFound={searchStats.totalFound}
        isDark={isDark}
      />

      {/* Results */}
      {!isSearching && jobs.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xl font-semibold">
                {filteredJobs.length} Jobs Found
              </h3>
              <p className="text-sm text-muted-foreground">
                Direct from company career pages
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Label htmlFor="sortBy">Sort by:</Label>
              <Select value={sortBy} onValueChange={(value: any) => setSortBy(value)}>
                <SelectTrigger className="w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="relevance">Relevance</SelectItem>
                  <SelectItem value="salary">Salary</SelectItem>
                  <SelectItem value="company">Company</SelectItem>
                  <SelectItem value="date">Date Posted</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-4">
            {filteredJobs.map((job, index) => (
              <motion.div
                key={job.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
              >
                <JobCard
                  job={{
                    id: job.id,
                    title: job.title,
                    link: job.applyUrl,
                    snippet: job.description,
                    date: job.postedDate,
                    source: job.source,
                    company: job.company,
                    companyLogo: job.companyLogo,
                    location: job.location,
                    type: job.type,
                    level: job.level,
                    skills: job.requirements.slice(0, 3),
                    metrics: {
                      matchScore: job.matchScore || 0,
                      salary: job.salary,
                      experience: job.level,
                      remote: job.location.toLowerCase().includes('remote'),
                      benefits: job.benefits,
                      growth: 'High' as const,
                      companySize: 'Medium',
                      funding: 'Well-funded',
                      lastRaised: '6 months ago',
                      age: '5 years',
                      employees: '500-1000',
                      openJobs: Math.floor(Math.random() * 10) + 1
                    },
                    badges: {
                      unicorn: job.company === 'OpenAI' || job.company === 'Anthropic',
                      remote: job.location.toLowerCase().includes('remote'),
                      equity: true,
                      fastGrowing: job.urgency === 'high-demand',
                      wellFunded: true,
                      topTier: job.company === 'OpenAI' || job.company === 'Stripe'
                    },
                    description: job.description,
                    requirements: job.requirements,
                    benefits: job.benefits,
                    culture: job.culture,
                    team: job.team,
                    mission: job.mission
                  }}
                  index={index}
                  isDark={isDark}
                  showExpanded={expandedJob === job.id}
                  onToggleExpanded={(id) => setExpandedJob(expandedJob === id ? null : id)}
                  onApply={(id) => console.log('Applied to:', id)}
                  onSave={(id) => console.log('Saved:', id)}
                  onShare={(id) => console.log('Shared:', id)}
                />
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* Empty State */}
      {!isSearching && jobs.length === 0 && (
        <Card>
          <CardContent className="text-center py-12">
            <Search className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Ready to Find Your Next Opportunity?</h3>
            <p className="text-muted-foreground mb-4">
              Search directly from company career pages - no job board middlemen
            </p>
            <Button onClick={performSearch}>
              <Search className="h-4 w-4 mr-2" />
              Start Search
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
