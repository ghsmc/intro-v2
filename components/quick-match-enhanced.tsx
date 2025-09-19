'use client';

import { useState, useEffect, } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {Clock, TrendingUp, MapPin, Building2, Star, Heart,
  CheckCircle, XCircle, Sparkles, Briefcase, DollarSign,Trophy, Users, Globe, 
  ArrowRight, RefreshCw, Loader2, AlertTriangle, Info, Cpu
} from 'lucide-react';
import { useDomain } from '@/components/domain-provider';
import { domainConfigs } from '@/lib/ai/domain-config';
import { useSession } from 'next-auth/react';
import { cn } from '@/lib/utils';
import confetti from 'canvas-confetti';

// Enhanced types for better matching
interface EnhancedMatchResult {
  id: string;
  company: string;
  role: string;
  program?: string;
  matchScore: number;
  aiScore: number; // AI-calculated compatibility
  reasons: string[];
  strengths: string[];
  challenges: string[];
  urgency: 'closing-soon' | 'just-opened' | 'high-demand' | 'normal' | 'last-chance';
  locations: string[];
  remoteType?: 'remote' | 'hybrid' | 'onsite';
  deadline?: string;
  salary?: {
    min: number;
    max: number;
    currency: string;
    equity?: string;
  };
  type?: string;
  department?: string;
  teamSize?: string;
  techStack?: string[];
  benefits?: string[];
  growthPotential: 1 | 2 | 3 | 4 | 5;
  competitionLevel: 'low' | 'medium' | 'high' | 'extreme';
  applicationUrl?: string;
  companyLogo?: string;
  companyRating?: number;
  companySize?: string;
  industry?: string;
  requirements?: string[];
  niceToHaves?: string[];
  interviewProcess?: string[];
  timeToHire?: string;
  successProbability?: number; // ML-based probability of success
}

interface UserProfile {
  classYear: string;
  locations: string[];
  remotePreference: 'remote-only' | 'hybrid-ok' | 'onsite-ok' | 'any';
  experience: string;
  interests: string[];
  skills: string[];
  values: string[];
  salaryExpectation?: { min: number; max: number };
  companySize?: 'startup' | 'mid' | 'enterprise' | 'any';
  industries?: string[];
  dealBreakers?: string[];
  mustHaves?: string[];
  workStyle?: 'collaborative' | 'independent' | 'mixed';
  careerGoals?: string[];
}

interface MatchingWeights {
  location: number;
  salary: number;
  skills: number;
  culture: number;
  growth: number;
  workLife: number;
  mission: number;
  team: number;
}

// Smart matching algorithm
class SmartMatchEngine {
  private weights: MatchingWeights = {
    location: 0.15,
    salary: 0.20,
    skills: 0.25,
    culture: 0.10,
    growth: 0.10,
    workLife: 0.08,
    mission: 0.07,
    team: 0.05
  };

  calculateMatch(job: any, profile: UserProfile): {
    score: number;
    reasons: string[];
    strengths: string[];
    challenges: string[];
  } {
    let score = 0;
    const reasons: string[] = [];
    const strengths: string[] = [];
    const challenges: string[] = [];

    // Location matching
    const locationScore = this.calculateLocationScore(job, profile);
    score += locationScore * this.weights.location;
    if (locationScore > 0.8) {
      strengths.push('Perfect location match');
    } else if (locationScore < 0.3) {
      challenges.push('Location may require relocation');
    }

    // Skills matching with semantic similarity
    const skillsScore = this.calculateSkillsScore(job, profile);
    score += skillsScore * this.weights.skills;
    if (skillsScore > 0.7) {
      const matchedSkills = this.getMatchedSkills(job, profile);
      strengths.push(`Strong skills match (${matchedSkills.join(', ')})`);
    }

    // Salary alignment
    if (profile.salaryExpectation && job.salary) {
      const salaryScore = this.calculateSalaryScore(job.salary, profile.salaryExpectation);
      score += salaryScore * this.weights.salary;
      if (salaryScore > 0.8) {
        strengths.push('Excellent compensation package');
      }
    }

    // Growth potential
    const growthScore = (job.growthPotential || 3) / 5;
    score += growthScore * this.weights.growth;
    if (growthScore > 0.8) {
      strengths.push('High growth potential');
    }

    // Culture fit based on values
    if (profile.values && profile.values.length > 0) {
      const cultureScore = this.calculateCultureScore(job, profile);
      score += cultureScore * this.weights.culture;
      if (cultureScore > 0.7) {
        reasons.push('Strong culture fit');
      }
    }

    // Company size preference
    if (profile.companySize && profile.companySize !== 'any') {
      if (this.matchesCompanySize(job.companySize, profile.companySize)) {
        score += 0.05;
        reasons.push(`${profile.companySize} company as preferred`);
      }
    }

    // Remote work preference
    if (profile.remotePreference !== 'any') {
      if (this.matchesRemotePreference(job.remoteType, profile.remotePreference)) {
        score += 0.05;
        reasons.push('Matches remote work preference');
      } else {
        challenges.push('Different remote work setup');
      }
    }

    // Deal breakers check
    if (profile.dealBreakers) {
      const hasDealBreaker = this.checkDealBreakers(job, profile.dealBreakers);
      if (hasDealBreaker) {
        score *= 0.5; // Significant penalty
        challenges.push('Contains potential deal-breakers');
      }
    }

    // Must-haves check
    if (profile.mustHaves) {
      const hasMustHaves = this.checkMustHaves(job, profile.mustHaves);
      if (hasMustHaves) {
        score += 0.1;
        strengths.push('Has all must-have features');
      }
    }

    // Normalize score to 0-100
    const finalScore = Math.min(Math.round(score * 100), 99);

    // Generate intelligent reasons
    if (finalScore > 85) {
      reasons.unshift('🎯 Exceptional match for your profile');
    } else if (finalScore > 70) {
      reasons.unshift('✨ Strong alignment with goals');
    } else if (finalScore > 55) {
      reasons.unshift('💡 Good opportunity to explore');
    }

    return { score: finalScore, reasons, strengths, challenges };
  }

  private calculateLocationScore(job: any, profile: UserProfile): number {
    if (!job.locations || !profile.locations) return 0.5;

    // Check for exact matches
    for (const userLoc of profile.locations) {
      for (const jobLoc of job.locations) {
        if (jobLoc.toLowerCase().includes(userLoc.toLowerCase())) {
          return 1.0;
        }
      }
    }

    // Check for remote match
    if (job.remoteType === 'remote' && profile.locations.includes('Remote')) {
      return 0.9;
    }

    return 0.2;
  }

  private calculateSkillsScore(job: any, profile: UserProfile): number {
    if (!job.requirements || !profile.skills) return 0.3;

    const jobSkills = [...(job.requirements || []), ...(job.techStack || [])];
    const userSkills = profile.skills.map(s => s.toLowerCase());

    let matches = 0;
    for (const jobSkill of jobSkills) {
      if (userSkills.some(userSkill =>
        jobSkill.toLowerCase().includes(userSkill) ||
        userSkill.includes(jobSkill.toLowerCase())
      )) {
        matches++;
      }
    }

    return Math.min(matches / Math.max(jobSkills.length, 1), 1.0);
  }

  private getMatchedSkills(job: any, profile: UserProfile): string[] {
    if (!job.requirements || !profile.skills) return [];

    const jobSkills = [...(job.requirements || []), ...(job.techStack || [])];
    const matched: string[] = [];

    for (const userSkill of profile.skills) {
      if (jobSkills.some(jobSkill =>
        jobSkill.toLowerCase().includes(userSkill.toLowerCase()) ||
        userSkill.toLowerCase().includes(jobSkill.toLowerCase())
      )) {
        matched.push(userSkill);
      }
    }

    return matched.slice(0, 3);
  }

  private calculateSalaryScore(jobSalary: any, expectation: { min: number; max: number }): number {
    const jobMin = jobSalary.min || 0;
    const jobMax = jobSalary.max || jobMin;

    if (jobMin >= expectation.min && jobMax >= expectation.max) {
      return 1.0; // Exceeds expectations
    }
    if (jobMin >= expectation.min) {
      return 0.8; // Meets minimum
    }
    if (jobMax >= expectation.min) {
      return 0.6; // Partial match
    }
    return 0.3; // Below expectations
  }

  private calculateCultureScore(job: any, profile: UserProfile): number {
    // Simplified culture matching - in production, use NLP/embeddings
    const jobCulture = [job.department, job.type, ...(job.benefits || [])].join(' ').toLowerCase();
    const userValues = profile.values.join(' ').toLowerCase();

    let score = 0;
    for (const value of profile.values) {
      if (jobCulture.includes(value.toLowerCase())) {
        score += 1 / profile.values.length;
      }
    }

    return score;
  }

  private matchesCompanySize(jobSize: string | undefined, preference: string): boolean {
    if (!jobSize) return false;

    const sizeMap: Record<string, string[]> = {
      'startup': ['startup', '1-50', '50-200'],
      'mid': ['200-1000', '1000-5000'],
      'enterprise': ['5000+', 'enterprise', 'fortune']
    };

    return sizeMap[preference]?.some(size =>
      jobSize.toLowerCase().includes(size)
    ) || false;
  }

  private matchesRemotePreference(jobRemote: string | undefined, preference: string): boolean {
    if (!jobRemote) return false;

    switch (preference) {
      case 'remote-only':
        return jobRemote === 'remote';
      case 'hybrid-ok':
        return jobRemote === 'hybrid' || jobRemote === 'remote';
      case 'onsite-ok':
        return true;
      default:
        return true;
    }
  }

  private checkDealBreakers(job: any, dealBreakers: string[]): boolean {
    const jobText = JSON.stringify(job).toLowerCase();
    return dealBreakers.some(breaker =>
      jobText.includes(breaker.toLowerCase())
    );
  }

  private checkMustHaves(job: any, mustHaves: string[]): boolean {
    const jobText = JSON.stringify(job).toLowerCase();
    return mustHaves.every(must =>
      jobText.includes(must.toLowerCase())
    );
  }
}

// Main enhanced component
export function QuickMatchEnhanced() {
  const { selectedDomain } = useDomain();
  const { data: session } = useSession();
  const user = session?.user;
  const [step, setStep] = useState(0);
  const [profile, setProfile] = useState<UserProfile>({
    classYear: '',
    locations: [],
    remotePreference: 'any',
    experience: '',
    interests: [],
    skills: [],
    values: [],
    companySize: 'any',
    industries: [],
    workStyle: 'mixed'
  });
  const [matches, setMatches] = useState<EnhancedMatchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedMatch, setSelectedMatch] = useState<EnhancedMatchResult | null>(null);
  const [savedMatches, setSavedMatches] = useState<Set<string>>(new Set());
  const [rejectedMatches, setRejectedMatches] = useState<Set<string>>(new Set());
  const [currentMatchIndex, setCurrentMatchIndex] = useState(0);
  const [showDetails, setShowDetails] = useState(false);
  const [animatingCard, setAnimatingCard] = useState(false);
  const [matchEngine] = useState(() => new SmartMatchEngine());

  const domainConfig = domainConfigs[selectedDomain];

  // Celebrate on great match
  const celebrateMatch = () => {
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 }
    });
  };

  // Load real job data from database
  const loadJobsFromDatabase = async () => {
    try {
      // This would be replaced with actual API call
      const response = await fetch('/api/jobs/recommendations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          profile,
          domain: selectedDomain,
          limit: 20
        })
      });

      if (response.ok) {
        const data = await response.json();
        return data.jobs || [];
      }
    } catch (error) {
      console.error('Failed to load jobs:', error);
    }

    // Fallback to mock data for now
    return generateMockJobs();
  };

  // Generate mock jobs for demonstration
  const generateMockJobs = (): EnhancedMatchResult[] => {
    const mockJobs: EnhancedMatchResult[] = [];
    const companies = getCompaniesForDomain();

    companies.forEach((company, idx) => {
      company.roles.forEach((role, roleIdx) => {
        const mockJob: EnhancedMatchResult = {
          id: `${idx}-${roleIdx}`,
          company: company.name,
          role: role,
          matchScore: 0,
          aiScore: 0,
          reasons: [],
          strengths: [],
          challenges: [],
          urgency: getRandomUrgency(),
          locations: company.locations || ['San Francisco', 'Remote'],
          remoteType: company.remote || 'hybrid',
          salary: company.salary,
          type: company.type,
          department: company.department,
          teamSize: company.teamSize,
          techStack: company.techStack,
          benefits: company.benefits,
          growthPotential: company.growth || 3,
          competitionLevel: company.competition || 'medium',
          companyLogo: company.logo,
          companyRating: company.rating,
          companySize: company.size,
          industry: company.industry,
          requirements: role.includes('Senior') ?
            ['5+ years experience', ...profile.skills.slice(0, 3)] :
            ['Strong fundamentals', ...profile.skills.slice(0, 2)],
          timeToHire: company.timeToHire || '2-3 weeks',
          successProbability: 60 + Math.random() * 35
        };

        // Calculate match score using smart engine
        const matchResult = matchEngine.calculateMatch(mockJob, profile);
        mockJob.matchScore = matchResult.score;
        mockJob.aiScore = matchResult.score + Math.random() * 10 - 5;
        mockJob.reasons = matchResult.reasons;
        mockJob.strengths = matchResult.strengths;
        mockJob.challenges = matchResult.challenges;

        mockJobs.push(mockJob);
      });
    });

    return mockJobs;
  };

  const getCompaniesForDomain = () => {
    switch (selectedDomain) {
      case 'ENGINEERS':
        return [
          {
            name: 'OpenAI',
            roles: ['ML Engineer', 'Research Engineer', 'Infrastructure Engineer'],
            salary: { min: 200000, max: 400000, currency: 'USD', equity: '0.05-0.15%' },
            locations: ['San Francisco'],
            remote: 'hybrid' as const,
            type: 'AI Research',
            department: 'Engineering',
            teamSize: '10-20',
            techStack: ['Python', 'PyTorch', 'Kubernetes', 'React'],
            benefits: ['Unlimited PTO', 'Top-tier health', '$5k learning budget'],
            growth: 5 as const,
            competition: 'extreme' as const,
            logo: '🤖',
            rating: 4.8,
            size: '200-500',
            industry: 'AI',
            timeToHire: '1-2 weeks'
          },
          {
            name: 'Anthropic',
            roles: ['AI Safety Engineer', 'Systems Engineer', 'Frontend Engineer'],
            salary: { min: 250000, max: 500000, currency: 'USD', equity: '0.1-0.3%' },
            locations: ['San Francisco', 'Remote'],
            remote: 'remote' as const,
            type: 'AI Safety',
            department: 'Research & Engineering',
            teamSize: '5-10',
            techStack: ['Python', 'Rust', 'TypeScript', 'JAX'],
            benefits: ['Remote-first', '6 months parental', 'Wellness stipend'],
            growth: 5 as const,
            competition: 'high' as const,
            logo: '🛡️',
            rating: 4.9,
            size: '50-200',
            industry: 'AI',
            timeToHire: '2-3 weeks'
          },
          {
            name: 'Stripe',
            roles: ['Backend Engineer', 'Infrastructure Engineer', 'Security Engineer'],
            salary: { min: 180000, max: 380000, currency: 'USD', equity: '0.01-0.05%' },
            locations: ['San Francisco', 'New York', 'Seattle'],
            remote: 'hybrid' as const,
            type: 'Fintech Infrastructure',
            department: 'Engineering',
            teamSize: '20-50',
            techStack: ['Ruby', 'Go', 'TypeScript', 'AWS'],
            benefits: ['401k match', 'Gym membership', 'Commuter benefits'],
            growth: 4 as const,
            competition: 'high' as const,
            logo: '💳',
            rating: 4.5,
            size: '5000+',
            industry: 'Fintech',
            timeToHire: '3-4 weeks'
          },
          {
            name: 'Tesla',
            roles: ['Autopilot Engineer', 'Battery Engineer', 'Manufacturing Engineer'],
            salary: { min: 150000, max: 350000, currency: 'USD', equity: 'Stock options' },
            locations: ['Palo Alto', 'Austin', 'Fremont'],
            remote: 'onsite' as const,
            type: 'Automotive/Energy',
            department: 'Engineering',
            teamSize: '50-100',
            techStack: ['C++', 'Python', 'CUDA', 'ROS'],
            benefits: ['Employee discount', 'Stock purchase', 'Health insurance'],
            growth: 4 as const,
            competition: 'high' as const,
            logo: '🚗',
            rating: 3.9,
            size: '50000+',
            industry: 'Automotive',
            timeToHire: '4-6 weeks'
          },
          {
            name: 'Databricks',
            roles: ['Platform Engineer', 'ML Engineer', 'Data Engineer'],
            salary: { min: 170000, max: 350000, currency: 'USD', equity: '0.02-0.08%' },
            locations: ['San Francisco', 'Seattle', 'Amsterdam'],
            remote: 'hybrid' as const,
            type: 'Data Infrastructure',
            department: 'Engineering',
            teamSize: '15-30',
            techStack: ['Scala', 'Python', 'Spark', 'Kubernetes'],
            benefits: ['Flexible hours', 'Learning budget', 'Home office setup'],
            growth: 4 as const,
            competition: 'medium' as const,
            logo: '📊',
            rating: 4.4,
            size: '5000+',
            industry: 'Data & Analytics',
            timeToHire: '2-3 weeks'
          }
        ];

      case 'SOFTWARE':
        return [
          {
            name: 'Figma',
            roles: ['Product Manager', 'Product Designer', 'Design Engineer'],
            salary: { min: 140000, max: 280000, currency: 'USD', equity: '0.01-0.05%' },
            locations: ['San Francisco', 'New York'],
            remote: 'hybrid' as const,
            type: 'Design Tools',
            department: 'Product',
            teamSize: '8-15',
            techStack: ['Figma', 'React', 'TypeScript', 'WebGL'],
            benefits: ['Creative days', 'Sabbatical', 'Equipment budget'],
            growth: 4 as const,
            competition: 'high' as const,
            logo: '🎨',
            rating: 4.7,
            size: '500-1000',
            industry: 'Design Software',
            timeToHire: '2-3 weeks'
          },
          {
            name: 'Notion',
            roles: ['PM, Growth', 'Design Systems Lead', 'Technical PM'],
            salary: { min: 130000, max: 250000, currency: 'USD', equity: '0.02-0.1%' },
            locations: ['San Francisco', 'Remote'],
            remote: 'remote' as const,
            type: 'Productivity',
            department: 'Product',
            teamSize: '5-10',
            techStack: ['React', 'TypeScript', 'PostgreSQL', 'AWS'],
            benefits: ['Remote stipend', 'Co-working allowance', 'Health & wellness'],
            growth: 5 as const,
            competition: 'medium' as const,
            logo: '📝',
            rating: 4.6,
            size: '200-500',
            industry: 'Productivity Software',
            timeToHire: '1-2 weeks'
          },
          {
            name: 'Linear',
            roles: ['Product Designer', 'Frontend Engineer', 'Developer Advocate'],
            salary: { min: 120000, max: 240000, currency: 'USD', equity: '0.05-0.2%' },
            locations: ['San Francisco', 'Remote'],
            remote: 'remote' as const,
            type: 'Developer Tools',
            department: 'Product & Engineering',
            teamSize: '3-8',
            techStack: ['React', 'GraphQL', 'TypeScript', 'Rust'],
            benefits: ['Unlimited PTO', 'Conference budget', 'Top equipment'],
            growth: 5 as const,
            competition: 'low' as const,
            logo: '📐',
            rating: 4.8,
            size: '20-50',
            industry: 'Developer Tools',
            timeToHire: '1 week'
          }
        ];

      case 'FINANCE':
        return [
          {
            name: 'Goldman Sachs',
            roles: ['Investment Banking Analyst', 'Quantitative Analyst', 'Risk Analyst'],
            salary: { min: 95000, max: 130000, currency: 'USD', equity: 'Year-end bonus' },
            locations: ['New York', 'London', 'Hong Kong'],
            remote: 'onsite' as const,
            type: 'Investment Banking',
            department: 'IBD',
            teamSize: '20-40',
            techStack: ['Excel', 'Python', 'Bloomberg', 'SQL'],
            benefits: ['Gym membership', 'Meal allowance', 'Car service'],
            growth: 3 as const,
            competition: 'extreme' as const,
            logo: '🏦',
            rating: 3.8,
            size: '40000+',
            industry: 'Investment Banking',
            timeToHire: '6-8 weeks'
          },
          {
            name: 'Jane Street',
            roles: ['Trading Analyst', 'Quant Researcher', 'Software Engineer'],
            salary: { min: 175000, max: 300000, currency: 'USD', equity: 'Profit sharing' },
            locations: ['New York', 'London'],
            remote: 'onsite' as const,
            type: 'Proprietary Trading',
            department: 'Trading',
            teamSize: '5-15',
            techStack: ['OCaml', 'Python', 'C++', 'Linux'],
            benefits: ['Top compensation', 'Learning culture', 'Catered meals'],
            growth: 4 as const,
            competition: 'extreme' as const,
            logo: '📈',
            rating: 4.5,
            size: '1500+',
            industry: 'Quantitative Trading',
            timeToHire: '4-6 weeks'
          }
        ];

      default:
        return [];
    }
  };

  const getRandomUrgency = (): EnhancedMatchResult['urgency'] => {
    const random = Math.random();
    if (random > 0.85) return 'closing-soon';
    if (random > 0.7) return 'just-opened';
    if (random > 0.5) return 'high-demand';
    if (random > 0.3) return 'normal';
    return 'last-chance';
  };

  // Generate and load matches
  const generateMatches = async () => {
    setLoading(true);
    setAnimatingCard(true);

    try {
      // Load jobs from database or mock data
      const jobs = await loadJobsFromDatabase();

      // Sort by match score
      const sortedJobs = jobs.sort((a: EnhancedMatchResult, b: EnhancedMatchResult) => {
        // Prioritize urgency
        const urgencyOrder = { 'closing-soon': 5, 'last-chance': 4, 'high-demand': 3, 'just-opened': 2, 'normal': 1 };
        const urgencyDiff = (urgencyOrder[a.urgency] || 0) - (urgencyOrder[b.urgency] || 0);
        if (urgencyDiff !== 0) return -urgencyDiff;

        // Then by match score
        return b.matchScore - a.matchScore;
      });

      setMatches(sortedJobs.slice(0, 15));

      // Celebrate if top match is excellent
      if (sortedJobs[0]?.matchScore > 85) {
        setTimeout(celebrateMatch, 500);
      }

    } catch (error) {
      console.error('Failed to generate matches:', error);
      setMatches(generateMockJobs());
    } finally {
      setLoading(false);
      setAnimatingCard(false);
      setStep(4); // Go to results
    }
  };

  // Swipe actions
  const handleSwipe = (direction: 'left' | 'right') => {
    const currentMatch = matches[currentMatchIndex];
    if (!currentMatch) return;

    setAnimatingCard(true);

    if (direction === 'right') {
      setSavedMatches(prev => new Set(prev).add(currentMatch.id));
      if (currentMatch.matchScore > 85) {
        celebrateMatch();
      }
    } else {
      setRejectedMatches(prev => new Set(prev).add(currentMatch.id));
    }

    setTimeout(() => {
      setCurrentMatchIndex(prev => Math.min(prev + 1, matches.length - 1));
      setAnimatingCard(false);
    }, 300);
  };

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (step === 4 && !showDetails) {
        if (e.key === 'ArrowLeft') handleSwipe('left');
        if (e.key === 'ArrowRight') handleSwipe('right');
        if (e.key === ' ') setShowDetails(true);
        if (e.key === 'Escape') setShowDetails(false);
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [step, currentMatchIndex, showDetails]);

  // Progress indicator
  const renderProgress = () => (
    <div className="flex items-center gap-2">
      {[0, 1, 2, 3].map(i => (
        <div
          key={i}
          className={cn(
            "h-1.5 rounded-full transition-all",
            i <= step ? "w-8 bg-primary" : "w-4 bg-muted"
          )}
        />
      ))}
    </div>
  );

  // Get domain-specific configuration
  const getDomainConfig = () => {
    // Similar to original but with enhanced options
    return {
      title: `${domainConfig.name} Quick Match`,
      subtitle: 'AI-powered job matching tailored to you',
      icon: selectedDomain === 'ENGINEERS' ? <Cpu /> :
            selectedDomain === 'SOFTWARE' ? <Briefcase /> :
            <DollarSign />,
      gradient: domainConfig.theme.logoColor
    };
  };

  const config = getDomainConfig();

  return (
    <div className="flex h-full flex-col bg-gradient-to-b from-background to-muted/20">
      {/* Enhanced Header */}
      <div className='border-b bg-card/50 px-6 py-4 backdrop-blur-sm'>
        <div className="mx-auto max-w-5xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className={cn('rounded-lg bg-gradient-to-br p-2', config.gradient, "text-white")}>
                {config.icon}
              </div>
              <div>
                <h1 className='flex items-center gap-2 font-bold text-2xl'>
                  Quick Match
                  <span className='inline-flex items-center gap-1 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 px-2 py-0.5 text-white text-xs'>
                    <Sparkles className="size-3" />
                    AI Powered
                  </span>
                </h1>
                <p className="text-muted-foreground text-sm">
                  {config.subtitle}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              {renderProgress()}
              {step === 4 && (
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setStep(0)}
                    className="flex items-center gap-1 rounded-lg px-3 py-1.5 text-sm hover:bg-accent"
                  >
                    <RefreshCw className="size-3" />
                    Restart
                  </button>
                  <div className="flex items-center gap-1 rounded-lg bg-green-500/10 px-3 py-1.5 text-green-600 text-sm">
                    <Heart className="size-3" />
                    {savedMatches.size}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 overflow-hidden">
        <AnimatePresence mode="wait">
          {/* Step 0: Experience Level */}
          {step === 0 && (
            <motion.div
              key="step0"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className='flex h-full items-center justify-center p-6'
            >
              <div className='w-full max-w-3xl space-y-6'>
                <div className="text-center">
                  <h2 className='mb-2 font-bold text-3xl'>What's your experience level?</h2>
                  <p className="text-muted-foreground">This helps us calibrate opportunities to your career stage</p>
                </div>

                <div className='grid grid-cols-2 gap-4 sm:grid-cols-3'>
                  {[
                    { id: 'student', label: 'Student/New Grad', icon: '🎓', desc: 'Looking for first role' },
                    { id: 'junior', label: 'Junior (0-2 years)', icon: '🌱', desc: 'Early career growth' },
                    { id: 'mid', label: 'Mid-Level (2-5 years)', icon: '💼', desc: 'Expanding expertise' },
                    { id: 'senior', label: 'Senior (5+ years)', icon: '🚀', desc: 'Deep expertise' },
                    { id: 'lead', label: 'Lead/Staff', icon: '⭐', desc: 'Technical leadership' },
                    { id: 'executive', label: 'Executive', icon: '👔', desc: 'Strategic roles' }
                  ].map(level => (
                    <motion.button
                      key={level.id}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => {
                        setProfile(p => ({ ...p, experience: level.id }));
                        setStep(1);
                      }}
                      className='group relative overflow-hidden rounded-xl border bg-card p-6 text-left transition-all hover:border-primary hover:shadow-lg'
                    >
                      <div className='absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 transition-opacity group-hover:opacity-100' />
                      <div className="relative">
                        <div className='mb-3 text-3xl'>{level.icon}</div>
                        <h3 className="font-semibold">{level.label}</h3>
                        <p className='mt-1 text-muted-foreground text-sm'>{level.desc}</p>
                      </div>
                    </motion.button>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {/* Step 1: Location & Work Style */}
          {step === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className='flex h-full items-center justify-center p-6'
            >
              <div className='w-full max-w-3xl space-y-6'>
                <div className="text-center">
                  <h2 className='mb-2 font-bold text-3xl'>Where do you want to work?</h2>
                  <p className="text-muted-foreground">Select all that apply - we'll find matches in these locations</p>
                </div>

                <div className="space-y-6">
                  {/* Location Selection */}
                  <div>
                    <h3 className='mb-3 flex items-center gap-2 font-medium'>
                      <MapPin className="size-4" />
                      Preferred Locations
                    </h3>
                    <div className='grid grid-cols-2 gap-3 sm:grid-cols-3'>
                      {[
                        'San Francisco', 'New York', 'Seattle', 'Austin',
                        'Los Angeles', 'Chicago', 'Boston', 'Denver',
                        'Remote', 'International'
                      ].map(loc => (
                        <motion.button
                          key={loc}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => {
                            setProfile(p => ({
                              ...p,
                              locations: p.locations.includes(loc)
                                ? p.locations.filter(l => l !== loc)
                                : [...p.locations, loc]
                            }));
                          }}
                          className={cn(
                            'rounded-lg border px-4 py-2.5 font-medium text-sm transition-all',
                            profile.locations.includes(loc)
                              ? "border-primary bg-primary text-primary-foreground"
                              : "border-border hover:border-primary/50 hover:bg-accent"
                          )}
                        >
                          {loc === 'Remote' && '🌍'} {loc}
                        </motion.button>
                      ))}
                    </div>
                  </div>

                  {/* Remote Preference */}
                  <div>
                    <h3 className='mb-3 flex items-center gap-2 font-medium'>
                      <Globe className="size-4" />
                      Remote Work Preference
                    </h3>
                    <div className='grid grid-cols-2 gap-3 sm:grid-cols-4'>
                      {[
                        { id: 'remote-only', label: 'Remote Only', icon: '🏠' },
                        { id: 'hybrid-ok', label: 'Hybrid OK', icon: '🔄' },
                        { id: 'onsite-ok', label: 'Onsite OK', icon: '🏢' },
                        { id: 'any', label: 'Flexible', icon: '✨' }
                      ].map(pref => (
                        <motion.button
                          key={pref.id}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => {
                            setProfile(p => ({ ...p, remotePreference: pref.id as any }));
                          }}
                          className={cn(
                            'rounded-lg border px-4 py-2.5 font-medium text-sm transition-all',
                            profile.remotePreference === pref.id
                              ? "border-primary bg-primary text-primary-foreground"
                              : "border-border hover:border-primary/50 hover:bg-accent"
                          )}
                        >
                          {pref.icon} {pref.label}
                        </motion.button>
                      ))}
                    </div>
                  </div>

                  <button
                    onClick={() => setStep(2)}
                    className='w-full rounded-lg bg-primary py-3 font-medium text-primary-foreground transition-opacity hover:opacity-90'
                  >
                    Continue <ArrowRight className='ml-2 inline-block size-4' />
                  </button>
                </div>
              </div>
            </motion.div>
          )}

          {/* Step 2: Skills & Interests */}
          {step === 2 && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className='flex h-full items-center justify-center p-6'
            >
              <div className='w-full max-w-3xl space-y-6'>
                <div className="text-center">
                  <h2 className='mb-2 font-bold text-3xl'>What are your superpowers?</h2>
                  <p className="text-muted-foreground">Select your strongest skills and interests</p>
                </div>

                <div className="space-y-6">
                  {/* Skills */}
                  <div>
                    <h3 className='mb-3 flex items-center gap-2 font-medium'>
                      <Star className="size-4" />
                      Technical Skills
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {(selectedDomain === 'ENGINEERS' ?
                        ['Python', 'JavaScript', 'TypeScript', 'React', 'Node.js', 'Go', 'Rust', 'C++', 'Java', 'AWS', 'GCP', 'Docker', 'Kubernetes', 'ML/AI', 'PostgreSQL', 'MongoDB'] :
                        selectedDomain === 'SOFTWARE' ?
                        ['Product Strategy', 'User Research', 'Data Analysis', 'Figma', 'SQL', 'A/B Testing', 'Agile', 'Roadmapping', 'Metrics', 'Design Systems', 'Prototyping', 'User Testing'] :
                        ['Financial Modeling', 'Excel', 'Python', 'PowerPoint', 'Accounting', 'Valuation', 'M&A', 'SQL', 'Bloomberg', 'CapIQ', 'Pitchbook', 'DCF']
                      ).map(skill => (
                        <motion.button
                          key={skill}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => {
                            setProfile(p => ({
                              ...p,
                              skills: p.skills.includes(skill)
                                ? p.skills.filter(s => s !== skill)
                                : [...p.skills, skill]
                            }));
                          }}
                          className={cn(
                            'rounded-full border px-3 py-1.5 font-medium text-sm transition-all',
                            profile.skills.includes(skill)
                              ? "border-primary bg-primary text-primary-foreground"
                              : "border-border hover:border-primary/50 hover:bg-accent"
                          )}
                        >
                          {profile.skills.includes(skill) && <CheckCircle className='mr-1 inline-block size-3' />}
                          {skill}
                        </motion.button>
                      ))}
                    </div>
                  </div>

                  {/* Values */}
                  <div>
                    <h3 className='mb-3 flex items-center gap-2 font-medium'>
                      <Heart className="size-4" />
                      What matters most to you?
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {[
                        'Work-Life Balance', 'High Growth', 'Innovation', 'Impact',
                        'Compensation', 'Learning', 'Culture', 'Flexibility',
                        'Mission-Driven', 'Diversity', 'Mentorship', 'Autonomy'
                      ].map(value => (
                        <motion.button
                          key={value}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => {
                            setProfile(p => ({
                              ...p,
                              values: p.values.includes(value)
                                ? p.values.filter(v => v !== value)
                                : [...p.values, value].slice(0, 5) // Max 5 values
                            }));
                          }}
                          className={cn(
                            'rounded-full border px-3 py-1.5 font-medium text-sm transition-all',
                            profile.values.includes(value)
                              ? "border-primary bg-primary text-primary-foreground"
                              : "border-border hover:border-primary/50 hover:bg-accent"
                          )}
                        >
                          {profile.values.includes(value) && <Heart className='mr-1 inline-block size-3 fill-current' />}
                          {value}
                        </motion.button>
                      ))}
                    </div>
                    {profile.values.length === 5 && (
                      <p className='mt-2 text-muted-foreground text-xs'>Maximum 5 values selected</p>
                    )}
                  </div>

                  <button
                    onClick={() => setStep(3)}
                    className='w-full rounded-lg bg-primary py-3 font-medium text-primary-foreground transition-opacity hover:opacity-90'
                  >
                    Continue <ArrowRight className='ml-2 inline-block size-4' />
                  </button>
                </div>
              </div>
            </motion.div>
          )}

          {/* Step 3: Preferences */}
          {step === 3 && (
            <motion.div
              key="step3"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className='flex h-full items-center justify-center p-6'
            >
              <div className='w-full max-w-3xl space-y-6'>
                <div className="text-center">
                  <h2 className='mb-2 font-bold text-3xl'>Final preferences</h2>
                  <p className="text-muted-foreground">Help us fine-tune your matches</p>
                </div>

                <div className="space-y-6">
                  {/* Company Size */}
                  <div>
                    <h3 className='mb-3 flex items-center gap-2 font-medium'>
                      <Building2 className="size-4" />
                      Company Size Preference
                    </h3>
                    <div className='grid grid-cols-2 gap-3 sm:grid-cols-4'>
                      {[
                        { id: 'startup', label: 'Startup', desc: '1-50 employees', icon: '🚀' },
                        { id: 'mid', label: 'Mid-size', desc: '50-1000', icon: '📈' },
                        { id: 'enterprise', label: 'Enterprise', desc: '1000+', icon: '🏢' },
                        { id: 'any', label: 'No preference', desc: 'Open to all', icon: '✨' }
                      ].map(size => (
                        <motion.button
                          key={size.id}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => {
                            setProfile(p => ({ ...p, companySize: size.id as any }));
                          }}
                          className={cn(
                            "rounded-lg border p-3 text-left transition-all",
                            profile.companySize === size.id
                              ? "border-primary bg-primary/10"
                              : "border-border hover:border-primary/50 hover:bg-accent"
                          )}
                        >
                          <div className='mb-1 text-xl'>{size.icon}</div>
                          <div className="font-medium text-sm">{size.label}</div>
                          <div className='text-muted-foreground text-xs'>{size.desc}</div>
                        </motion.button>
                      ))}
                    </div>
                  </div>

                  {/* Salary Expectations */}
                  <div>
                    <h3 className='mb-3 flex items-center gap-2 font-medium'>
                      <DollarSign className="size-4" />
                      Salary Expectations (Optional)
                    </h3>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className='mb-1 block text-muted-foreground text-sm'>Minimum</label>
                        <select
                          className="w-full rounded-lg border bg-background px-3 py-2"
                          onChange={(e) => setProfile(p => ({
                            ...p,
                            salaryExpectation: {
                              ...p.salaryExpectation,
                              min: Number.parseInt(e.target.value) || 0
                            } as any
                          }))}
                        >
                          <option value="">No minimum</option>
                          {selectedDomain === 'FINANCE' ?
                            ['80000', '100000', '120000', '150000'].map(val => (
                              <option key={val} value={val}>${Number.parseInt(val).toLocaleString()}</option>
                            )) :
                            ['100000', '120000', '150000', '180000', '200000', '250000'].map(val => (
                              <option key={val} value={val}>${Number.parseInt(val).toLocaleString()}</option>
                            ))
                          }
                        </select>
                      </div>
                      <div>
                        <label className='mb-1 block text-muted-foreground text-sm'>Maximum</label>
                        <select
                          className="w-full rounded-lg border bg-background px-3 py-2"
                          onChange={(e) => setProfile(p => ({
                            ...p,
                            salaryExpectation: {
                              ...p.salaryExpectation,
                              max: Number.parseInt(e.target.value) || 999999
                            } as any
                          }))}
                        >
                          <option value="">No maximum</option>
                          {selectedDomain === 'FINANCE' ?
                            ['120000', '150000', '200000', '250000'].map(val => (
                              <option key={val} value={val}>${Number.parseInt(val).toLocaleString()}</option>
                            )) :
                            ['150000', '200000', '300000', '400000', '500000', '600000'].map(val => (
                              <option key={val} value={val}>${Number.parseInt(val).toLocaleString()}</option>
                            ))
                          }
                        </select>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={generateMatches}
                    disabled={loading}
                    className='flex w-full items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-primary to-primary/80 py-3 font-medium text-primary-foreground transition-all hover:opacity-90 disabled:opacity-50'
                  >
                    {loading ? (
                      <>
                        <Loader2 className="size-4 animate-spin" />
                        Finding your perfect matches...
                      </>
                    ) : (
                      <>
                        <Sparkles className="size-4" />
                        Generate AI Matches
                      </>
                    )}
                  </button>
                </div>
              </div>
            </motion.div>
          )}

          {/* Step 4: Results - Swipeable Cards */}
          {step === 4 && matches.length > 0 && (
            <motion.div
              key="step4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className='flex h-full items-center justify-center p-6'
            >
              <div className='w-full max-w-md'>
                <div className='mb-6 text-center'>
                  <h2 className='font-bold text-2xl'>Your AI Matches</h2>
                  <p className='mt-1 text-muted-foreground text-sm'>
                    Swipe right to save, left to pass
                  </p>
                </div>

                {/* Match Card Stack */}
                <div className="relative h-[500px]">
                  <AnimatePresence>
                    {matches.slice(currentMatchIndex, currentMatchIndex + 3).map((match, index) => (
                      <motion.div
                        key={match.id}
                        initial={{ scale: 0.95, opacity: 0 }}
                        animate={{
                          scale: 1 - index * 0.05,
                          opacity: 1,
                          y: index * 10,
                          zIndex: matches.length - currentMatchIndex - index
                        }}
                        exit={animatingCard && index === 0 ? {
                          x: savedMatches.has(match.id) ? 300 : -300,
                          rotate: savedMatches.has(match.id) ? 20 : -20,
                          opacity: 0
                        } : {}}
                        transition={{ type: 'spring', damping: 20 }}
                        className="absolute inset-0"
                      >
                        <div className={cn(
                          'h-full cursor-pointer overflow-hidden rounded-2xl border bg-card p-6 shadow-xl',
                          index === 0 && 'transition-shadow hover:shadow-2xl'
                        )}
                        onClick={() => index === 0 && setShowDetails(!showDetails)}>
                          {/* Match Score Badge */}
                          <div className="absolute top-4 right-4 flex items-center gap-2">
                            <div className={cn(
                              'rounded-full px-3 py-1 font-bold text-sm',
                              match.matchScore >= 85 ? "bg-green-500/20 text-green-600" :
                              match.matchScore >= 70 ? "bg-blue-500/20 text-blue-600" :
                              "bg-orange-500/20 text-orange-600"
                            )}>
                              {match.matchScore}% Match
                            </div>
                            {match.urgency !== 'normal' && getUrgencyBadge(match.urgency)}
                          </div>

                          {/* Company & Role */}
                          <div className="mb-4">
                            <div className='mb-2 flex items-center gap-3'>
                              <div className='flex size-12 items-center justify-center rounded-lg bg-gradient-to-br from-primary/20 to-primary/10 text-2xl'>
                                {match.companyLogo || '🏢'}
                              </div>
                              <div>
                                <h3 className="font-bold text-lg">{match.company}</h3>
                                <p className="text-muted-foreground text-sm">{match.role}</p>
                              </div>
                            </div>
                          </div>

                          {/* Key Details */}
                          <div className='mb-4 space-y-3'>
                            <div className="flex items-center gap-2 text-sm">
                              <MapPin className="size-4 text-muted-foreground" />
                              <span>{match.locations.join(', ')}</span>
                              {match.remoteType === 'remote' && (
                                <span className="rounded-full bg-green-500/10 px-2 py-0.5 text-green-600 text-xs">
                                  Remote
                                </span>
                              )}
                            </div>

                            {match.salary && (
                              <div className="flex items-center gap-2 text-sm">
                                <DollarSign className="size-4 text-muted-foreground" />
                                <span>
                                  ${match.salary.min?.toLocaleString()} - ${match.salary.max?.toLocaleString()}
                                  {match.salary.equity && ` + ${match.salary.equity}`}
                                </span>
                              </div>
                            )}

                            {match.department && (
                              <div className="flex items-center gap-2 text-sm">
                                <Users className="size-4 text-muted-foreground" />
                                <span>{match.department} • {match.teamSize}</span>
                              </div>
                            )}
                          </div>

                          {/* Match Reasons */}
                          <div className='mb-4 space-y-2'>
                            {match.strengths.slice(0, 2).map((strength, idx) => (
                              <div key={idx} className="flex items-start gap-2">
                                <CheckCircle className='mt-0.5 size-4 text-green-500' />
                                <span className="text-sm">{strength}</span>
                              </div>
                            ))}
                            {match.reasons.slice(0, 1).map((reason, idx) => (
                              <div key={idx} className="flex items-start gap-2">
                                <Sparkles className='mt-0.5 size-4 text-primary' />
                                <span className="text-sm">{reason}</span>
                              </div>
                            ))}
                          </div>

                          {/* Tech Stack */}
                          {match.techStack && (
                            <div className='mb-4 flex flex-wrap gap-1.5'>
                              {match.techStack.slice(0, 5).map(tech => (
                                <span key={tech} className="rounded-full bg-muted px-2 py-0.5 text-xs">
                                  {tech}
                                </span>
                              ))}
                            </div>
                          )}

                          {/* Growth & Competition */}
                          <div className='flex items-center gap-4 border-t pt-4'>
                            <div className="flex items-center gap-1">
                              <TrendingUp className="size-4 text-muted-foreground" />
                              <span className="text-sm">
                                Growth: {'⭐'.repeat(match.growthPotential)}
                              </span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Users className="size-4 text-muted-foreground" />
                              <span className={cn(
                                "text-sm",
                                match.competitionLevel === 'extreme' ? "text-red-500" :
                                match.competitionLevel === 'high' ? "text-orange-500" :
                                match.competitionLevel === 'medium' ? "text-yellow-500" :
                                "text-green-500"
                              )}>
                                {match.competitionLevel} competition
                              </span>
                            </div>
                          </div>

                          {/* Action Hint */}
                          {index === 0 && (
                            <div className='absolute right-6 bottom-6 left-6 flex justify-between text-muted-foreground text-sm'>
                              <span className="flex items-center gap-1">
                                <XCircle className="size-4" />
                                Pass
                              </span>
                              <span>Tap for details</span>
                              <span className="flex items-center gap-1">
                                Save
                                <Heart className="size-4" />
                              </span>
                            </div>
                          )}
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>

                {/* Action Buttons */}
                <div className='mt-8 flex items-center justify-center gap-4'>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => handleSwipe('left')}
                    className='flex size-14 items-center justify-center rounded-full border-2 border-red-500/20 bg-red-500/10 text-red-500 transition-colors hover:bg-red-500/20'
                  >
                    <XCircle className="size-6" />
                  </motion.button>

                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setShowDetails(!showDetails)}
                    className='flex size-12 items-center justify-center rounded-full border bg-card transition-colors hover:bg-accent'
                  >
                    <Info className="size-5" />
                  </motion.button>

                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => handleSwipe('right')}
                    className='flex size-14 items-center justify-center rounded-full border-2 border-green-500/20 bg-green-500/10 text-green-500 transition-colors hover:bg-green-500/20'
                  >
                    <Heart className="size-6" />
                  </motion.button>
                </div>

                {/* Progress */}
                <div className='mt-6 text-center text-muted-foreground text-sm'>
                  {currentMatchIndex + 1} of {matches.length} matches
                </div>
              </div>
            </motion.div>
          )}

          {/* No matches or completion */}
          {step === 4 && (matches.length === 0 || currentMatchIndex >= matches.length - 1) && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className='flex h-full items-center justify-center p-6'
            >
              <div className='max-w-md text-center'>
                <Trophy className='mx-auto mb-4 size-16 text-primary' />
                <h2 className='mb-2 font-bold text-2xl'>
                  {savedMatches.size > 0 ? "Great selections!" : "All done!"}
                </h2>
                <p className='mb-6 text-muted-foreground'>
                  {savedMatches.size > 0
                    ? `You saved ${savedMatches.size} matches. We'll help you apply to these opportunities.`
                    : "Try adjusting your preferences to see more matches."}
                </p>
                <div className='flex justify-center gap-3'>
                  <button
                    onClick={() => {
                      setStep(0);
                      setMatches([]);
                      setSavedMatches(new Set());
                      setCurrentMatchIndex(0);
                    }}
                    className="rounded-lg bg-primary px-6 py-2 text-primary-foreground hover:opacity-90"
                  >
                    Start Over
                  </button>
                  {savedMatches.size > 0 && (
                    <button
                      className="rounded-lg border px-6 py-2 hover:bg-accent"
                    >
                      View Saved
                    </button>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Keyboard Shortcuts Hint */}
      {step === 4 && currentMatchIndex < matches.length - 1 && (
        <div className='border-t bg-card/50 px-6 py-2 backdrop-blur-sm'>
          <div className='mx-auto flex max-w-5xl items-center justify-center gap-6 text-muted-foreground text-xs'>
            <span>← Pass</span>
            <span>Space for details</span>
            <span>→ Save</span>
          </div>
        </div>
      )}
    </div>
  );
}

// Helper function to get urgency badge
function getUrgencyBadge(urgency: string) {
  const badges = {
    'closing-soon': { icon: Clock, text: 'Closing Soon', class: 'bg-red-500/10 text-red-600' },
    'just-opened': { icon: Sparkles, text: 'New', class: 'bg-green-500/10 text-green-600' },
    'high-demand': { icon: TrendingUp, text: 'Hot', class: 'bg-orange-500/10 text-orange-600' },
    'last-chance': { icon: AlertTriangle, text: 'Last Chance', class: 'bg-yellow-500/10 text-yellow-600' }
  };

  const badge = badges[urgency as keyof typeof badges];
  if (!badge) return null;

  const Icon = badge.icon;
  return (
    <span className={cn("flex items-center gap-1 rounded-full px-2 py-0.5 text-xs", badge.class)}>
      <Icon className="size-3" />
      {badge.text}
    </span>
  );
}