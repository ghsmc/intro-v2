import { Company } from '@/lib/db/schema';
import { OnboardingData } from '@/app/(auth)/onboarding/page';

export interface MatchScore {
  total: number;
  breakdown: {
    energyAlignment: number;
    valuesAlignment: number;
    skillsAlignment: number;
    constraintsAlignment: number;
    companyFit: number;
    marketOpportunity: number;
  };
  reasoning: string[];
  confidence: 'high' | 'medium' | 'low';
}

export interface EnhancedJobMatch {
  id: string;
  title: string;
  company: string;
  companyId: string;
  description: string;
  location: string;
  salary?: string;
  type: 'full-time' | 'part-time' | 'internship' | 'contract';
  level: 'entry' | 'mid' | 'senior' | 'lead' | 'executive';
  skills: string[];
  requirements: string[];
  benefits: string[];
  culture: string;
  team: string;
  mission: string;
  matchScore: MatchScore;
  urgency: 'closing-soon' | 'just-opened' | 'high-demand' | 'normal';
  applicationDeadline?: string;
  source: string;
  link: string;
  companyLogo?: string;
  metrics: {
    matchScore: number;
    salary?: string;
    experience?: string;
    remote?: boolean;
    equity?: string;
    benefits?: string[];
    growth?: 'High' | 'Medium' | 'Low';
    companySize?: string;
    funding?: string;
    lastRaised?: string;
    age?: string;
    employees?: string;
    openJobs?: number;
  };
  badges: {
    unicorn?: boolean;
    remote?: boolean;
    equity?: boolean;
    fastGrowing?: boolean;
    wellFunded?: boolean;
    topTier?: boolean;
  };
}

export class AdvancedCareerMatcher {
  private companies: Company[];
  private userProfile: OnboardingData;

  constructor(companies: Company[], userProfile: OnboardingData) {
    this.companies = companies;
    this.userProfile = userProfile;
  }

  /**
   * Generate comprehensive career matches based on user profile and company data
   */
  async generateMatches(domainType: 'ENGINEERS' | 'SOFTWARE' | 'FINANCE'): Promise<EnhancedJobMatch[]> {
    const domainCompanies = this.companies.filter(c => c.domainType === domainType);
    const matches: EnhancedJobMatch[] = [];

    for (const company of domainCompanies) {
      const companyMatches = await this.generateCompanyMatches(company, domainType);
      matches.push(...companyMatches);
    }

    // Sort by match score and return top matches
    return matches
      .sort((a, b) => b.matchScore.total - a.matchScore.total)
      .slice(0, 50);
  }

  /**
   * Generate job matches for a specific company
   */
  private async generateCompanyMatches(
    company: Company, 
    domainType: 'ENGINEERS' | 'SOFTWARE' | 'FINANCE'
  ): Promise<EnhancedJobMatch[]> {
    const matches: EnhancedJobMatch[] = [];
    
    // Generate different role types based on domain and user profile
    const roleTypes = this.generateRoleTypes(domainType, company);
    
    for (const roleType of roleTypes) {
      const matchScore = this.calculateMatchScore(company, roleType);
      
      if (matchScore.total >= 60) { // Only include matches with 60%+ score
        const match: EnhancedJobMatch = {
          id: `${company.id}-${roleType.title.toLowerCase().replace(/\s+/g, '-')}`,
          title: roleType.title,
          company: company.name,
          companyId: company.id,
          description: roleType.description,
          location: this.determineLocation(company),
          salary: roleType.salary,
          type: this.determineJobType(),
          level: this.determineExperienceLevel(),
          skills: roleType.skills,
          requirements: roleType.requirements,
          benefits: this.generateBenefits(company),
          culture: company.description || 'Innovative and collaborative environment',
          team: this.generateTeamDescription(roleType.title),
          mission: this.generateMission(company, roleType.title),
          matchScore,
          urgency: this.determineUrgency(company, matchScore),
          applicationDeadline: this.generateDeadline(),
          source: 'Career OS Database',
          link: company.jobsUrl || company.websiteUrl || '#',
          companyLogo: company.logoUrl || undefined,
          metrics: this.generateMetrics(company, matchScore),
          badges: this.generateBadges(company),
        };
        
        matches.push(match);
      }
    }
    
    return matches;
  }

  /**
   * Calculate comprehensive match score
   */
  private calculateMatchScore(company: Company, roleType: any): MatchScore {
    const breakdown = {
      energyAlignment: this.calculateEnergyAlignment(roleType),
      valuesAlignment: this.calculateValuesAlignment(company),
      skillsAlignment: this.calculateSkillsAlignment(roleType),
      constraintsAlignment: this.calculateConstraintsAlignment(company),
      companyFit: this.calculateCompanyFit(company),
      marketOpportunity: this.calculateMarketOpportunity(company),
    };

    const total = Math.round(
      (breakdown.energyAlignment * 0.25) +
      (breakdown.valuesAlignment * 0.20) +
      (breakdown.skillsAlignment * 0.20) +
      (breakdown.constraintsAlignment * 0.15) +
      (breakdown.companyFit * 0.10) +
      (breakdown.marketOpportunity * 0.10)
    );

    const reasoning = this.generateReasoning(breakdown, company, roleType);
    const confidence = this.determineConfidence(total, breakdown);

    return {
      total,
      breakdown,
      reasoning,
      confidence,
    };
  }

  /**
   * Calculate energy profile alignment
   */
  private calculateEnergyAlignment(roleType: any): number {
    const energyProfile = this.userProfile.energyProfile;
    let score = 0;
    let factors = 0;

    // Solo work alignment
    if (roleType.requiresDeepFocus) {
      score += energyProfile.solo_work * 20;
      factors++;
    }

    // Team leadership alignment
    if (roleType.requiresLeadership) {
      score += energyProfile.team_lead * 20;
      factors++;
    }

    // Data analysis alignment
    if (roleType.requiresDataAnalysis) {
      score += energyProfile.data_analysis * 20;
      factors++;
    }

    // Creative problem solving alignment
    if (roleType.requiresCreativity) {
      score += energyProfile.creative_problem_solving * 20;
      factors++;
    }

    // Helping individuals alignment
    if (roleType.helpsPeople) {
      score += energyProfile.helping_individuals * 20;
      factors++;
    }

    // Building/making alignment
    if (roleType.requiresBuilding) {
      score += energyProfile.building_making * 20;
      factors++;
    }

    // Public speaking alignment
    if (roleType.requiresPresentations) {
      score += energyProfile.public_speaking * 20;
      factors++;
    }

    // Writing alignment
    if (roleType.requiresWriting) {
      score += energyProfile.writing_storytelling * 20;
      factors++;
    }

    return factors > 0 ? Math.min(100, score / factors) : 50;
  }

  /**
   * Calculate values alignment
   */
  private calculateValuesAlignment(company: Company): number {
    const userValues = this.userProfile.values;
    let score = 0;
    let matches = 0;

    // Map company characteristics to values
    const companyTraits = this.analyzeCompanyTraits(company);

    for (const value of userValues) {
      if (this.valueMatchesCompany(value, companyTraits)) {
        score += 25;
        matches++;
      }
    }

    // Base score for any company
    const baseScore = 40;
    const valueScore = matches > 0 ? (score / matches) : baseScore;
    
    return Math.min(100, valueScore);
  }

  /**
   * Calculate skills alignment
   */
  private calculateSkillsAlignment(roleType: any): number {
    // This would integrate with resume parsing to extract skills
    // For now, use a heuristic based on major and energy profile
    const major = this.userProfile.major.toLowerCase();
    const energyProfile = this.userProfile.energyProfile;
    
    let score = 50; // Base score

    // Major-based alignment
    if (major.includes('computer') || major.includes('engineering')) {
      score += 20;
    }
    if (major.includes('business') || major.includes('economics')) {
      score += 15;
    }
    if (major.includes('math') || major.includes('statistics')) {
      score += 15;
    }

    // Energy profile alignment
    if (roleType.requiresDataAnalysis && energyProfile.data_analysis >= 4) {
      score += 15;
    }
    if (roleType.requiresCreativity && energyProfile.creative_problem_solving >= 4) {
      score += 15;
    }

    return Math.min(100, score);
  }

  /**
   * Calculate constraints alignment
   */
  private calculateConstraintsAlignment(company: Company): number {
    const constraints = this.userProfile.constraints;
    let score = 100;

    // Geography constraint
    if (constraints.geography && constraints.geography !== 'anywhere') {
      const companyLocation = company.location?.toLowerCase() || '';
      const userLocation = constraints.geography.toLowerCase();
      
      if (userLocation === 'northeast' && !companyLocation.includes('new york') && 
          !companyLocation.includes('boston') && !companyLocation.includes('dc')) {
        score -= 30;
      }
      if (userLocation === 'home_location' && !companyLocation.includes('remote')) {
        score -= 20;
      }
    }

    // Salary constraint
    if (constraints.salary_minimum && constraints.salary_minimum !== '0') {
      const minSalary = parseInt(constraints.salary_minimum);
      const companyValuation = this.parseValuation(company.valuation);
      
      if (companyValuation < minSalary) {
        score -= 25;
      }
    }

    return Math.max(0, score);
  }

  /**
   * Calculate company fit
   */
  private calculateCompanyFit(company: Company): number {
    let score = 50; // Base score

    // Company size preference (based on energy profile)
    const energyProfile = this.userProfile.energyProfile;
    const companySize = this.parseCompanySize(company.employees);
    
    if (companySize === 'startup' && energyProfile.building_making >= 4) {
      score += 20;
    }
    if (companySize === 'large' && energyProfile.team_lead >= 4) {
      score += 15;
    }

    // Growth stage alignment
    if (company.fundingStage === 'Series A' || company.fundingStage === 'Series B') {
      if (energyProfile.building_making >= 4) {
        score += 15;
      }
    }
    if (company.fundingStage === 'Public' || company.fundingStage === 'IPO') {
      if (energyProfile.team_lead >= 4) {
        score += 10;
      }
    }

    // Trending companies get bonus
    if (company.trending === 'up') {
      score += 10;
    }

    return Math.min(100, score);
  }

  /**
   * Calculate market opportunity
   */
  private calculateMarketOpportunity(company: Company): number {
    let score = 50; // Base score

    // Valuation-based opportunity
    const valuation = this.parseValuation(company.valuation);
    if (valuation > 1000000000) { // $1B+ valuation
      score += 20;
    } else if (valuation > 100000000) { // $100M+ valuation
      score += 15;
    }

    // Growth stage opportunity
    if (company.fundingStage === 'Series A' || company.fundingStage === 'Series B') {
      score += 15; // High growth potential
    }

    // Trending companies
    if (company.trending === 'up') {
      score += 10;
    }

    // Featured companies
    if (company.featured) {
      score += 5;
    }

    return Math.min(100, score);
  }

  /**
   * Generate role types based on domain and company
   */
  private generateRoleTypes(domainType: string, company: Company) {
    const roleTemplates = {
      ENGINEERS: [
        {
          title: 'Software Engineer',
          description: 'Build scalable software solutions and work on cutting-edge technology',
          skills: ['Python', 'JavaScript', 'React', 'Node.js', 'AWS'],
          requirements: ['Bachelor\'s in Computer Science', '2+ years experience', 'Strong problem-solving skills'],
          requiresDeepFocus: true,
          requiresDataAnalysis: true,
          requiresBuilding: true,
          salary: '$120k-180k'
        },
        {
          title: 'ML Engineer',
          description: 'Develop machine learning models and AI systems',
          skills: ['Python', 'TensorFlow', 'PyTorch', 'SQL', 'Docker'],
          requirements: ['MS in CS/ML', '3+ years ML experience', 'Strong math background'],
          requiresDeepFocus: true,
          requiresDataAnalysis: true,
          requiresBuilding: true,
          salary: '$150k-250k'
        },
        {
          title: 'DevOps Engineer',
          description: 'Build and maintain cloud infrastructure and deployment pipelines',
          skills: ['AWS', 'Kubernetes', 'Docker', 'Terraform', 'Python'],
          requirements: ['Bachelor\'s degree', '3+ years DevOps experience', 'Cloud certifications preferred'],
          requiresDeepFocus: true,
          requiresBuilding: true,
          salary: '$130k-200k'
        }
      ],
      SOFTWARE: [
        {
          title: 'Product Manager',
          description: 'Lead product strategy and work with cross-functional teams',
          skills: ['Product Strategy', 'Analytics', 'Figma', 'SQL', 'Agile'],
          requirements: ['Bachelor\'s degree', '2+ years PM experience', 'Strong communication skills'],
          requiresLeadership: true,
          requiresPresentations: true,
          requiresWriting: true,
          salary: '$140k-220k'
        },
        {
          title: 'UX Designer',
          description: 'Design user experiences and conduct user research',
          skills: ['Figma', 'User Research', 'Prototyping', 'Design Systems', 'Analytics'],
          requirements: ['Design degree or equivalent', '3+ years UX experience', 'Portfolio required'],
          requiresCreativity: true,
          requiresDataAnalysis: true,
          requiresPresentations: true,
          salary: '$100k-160k'
        }
      ],
      FINANCE: [
        {
          title: 'Investment Banking Analyst',
          description: 'Analyze financial data and support M&A transactions',
          skills: ['Financial Modeling', 'Excel', 'PowerPoint', 'Valuation', 'Due Diligence'],
          requirements: ['Bachelor\'s in Finance/Economics', 'Strong analytical skills', '2+ years experience'],
          requiresDataAnalysis: true,
          requiresPresentations: true,
          requiresWriting: true,
          salary: '$100k-150k'
        },
        {
          title: 'Quantitative Analyst',
          description: 'Develop quantitative models for trading and risk management',
          skills: ['Python', 'R', 'SQL', 'Statistics', 'Machine Learning'],
          requirements: ['MS in Quantitative Finance', 'Strong math background', 'Programming skills'],
          requiresDeepFocus: true,
          requiresDataAnalysis: true,
          requiresBuilding: true,
          salary: '$120k-200k'
        }
      ]
    };

    return roleTemplates[domainType as keyof typeof roleTemplates] || [];
  }

  /**
   * Helper methods
   */
  private determineLocation(company: Company): string {
    return company.location || 'Remote';
  }

  private determineJobType(): 'full-time' | 'part-time' | 'internship' | 'contract' {
    const classYear = this.userProfile.classYear;
    if (classYear === 'Senior' || classYear === 'Recent Grad') {
      return 'full-time';
    }
    return 'internship';
  }

  private determineExperienceLevel(): 'entry' | 'mid' | 'senior' | 'lead' | 'executive' {
    const classYear = this.userProfile.classYear;
    if (classYear === 'Senior' || classYear === 'Recent Grad') {
      return 'entry';
    }
    return 'entry';
  }

  private determineUrgency(company: Company, matchScore: MatchScore): 'closing-soon' | 'just-opened' | 'high-demand' | 'normal' {
    if (matchScore.total >= 90) return 'high-demand';
    if (company.trending === 'up') return 'just-opened';
    return 'normal';
  }

  private generateDeadline(): string {
    const days = Math.floor(Math.random() * 30) + 7;
    const date = new Date();
    date.setDate(date.getDate() + days);
    return date.toISOString().split('T')[0];
  }

  private generateBenefits(company: Company): string[] {
    const baseBenefits = ['Health Insurance', 'Dental Insurance', 'Vision Insurance', '401k Matching'];
    
    if (company.valuation && this.parseValuation(company.valuation) > 1000000000) {
      baseBenefits.push('Equity', 'Stock Options', 'Unlimited PTO');
    }
    
    if (company.employees && parseInt(company.employees) < 100) {
      baseBenefits.push('Flexible Hours', 'Remote Work', 'Learning Budget');
    }
    
    return baseBenefits;
  }

  private generateTeamDescription(title: string): string {
    return `Join a collaborative team of ${title.toLowerCase()}s working on innovative projects.`;
  }

  private generateMission(company: Company, title: string): string {
    return `Help ${company.name} achieve its mission while growing as a ${title.toLowerCase()}.`;
  }

  private generateMetrics(company: Company, matchScore: MatchScore) {
    return {
      matchScore: matchScore.total,
      salary: this.generateSalaryRange(company),
      experience: this.determineExperienceLevel(),
      remote: Math.random() > 0.5,
      equity: company.valuation ? 'Yes' : 'No',
      benefits: this.generateBenefits(company),
      growth: this.determineGrowthPotential(company),
          companySize: company.employees || undefined,
      funding: company.valuation || undefined,
      lastRaised: this.generateLastRaised(company),
      age: this.generateCompanyAge(company),
      employees: company.employees || undefined,
      openJobs: Math.floor(Math.random() * 10) + 1,
    };
  }

  private generateBadges(company: Company) {
    const badges: any = {};
    
    if (this.parseValuation(company.valuation) > 1000000000) {
      badges.unicorn = true;
    }
    
    if (company.trending === 'up') {
      badges.fastGrowing = true;
    }
    
    if (company.featured) {
      badges.topTier = true;
    }
    
    if (company.valuation) {
      badges.wellFunded = true;
    }
    
    return badges;
  }

  private generateReasoning(breakdown: any, company: Company, roleType: any): string[] {
    const reasoning: string[] = [];
    
    if (breakdown.energyAlignment >= 80) {
      reasoning.push('Strong alignment with your energy profile');
    }
    
    if (breakdown.valuesAlignment >= 80) {
      reasoning.push('Matches your core values');
    }
    
    if (breakdown.skillsAlignment >= 80) {
      reasoning.push('Skills align well with role requirements');
    }
    
    if (company.trending === 'up') {
      reasoning.push('Company is trending upward');
    }
    
    if (company.featured) {
      reasoning.push('Featured company with strong reputation');
    }
    
    if (breakdown.marketOpportunity >= 80) {
      reasoning.push('High market opportunity');
    }
    
    return reasoning;
  }

  private determineConfidence(total: number, breakdown: any): 'high' | 'medium' | 'low' {
    if (total >= 85 && breakdown.energyAlignment >= 80) return 'high';
    if (total >= 70) return 'medium';
    return 'low';
  }

  private analyzeCompanyTraits(company: Company): string[] {
    const traits: string[] = [];
    
    if (company.valuation && this.parseValuation(company.valuation) > 1000000000) {
      traits.push('high_earning_potential');
    }
    
    if (company.trending === 'up') {
      traits.push('building_something_new');
    }
    
    if (company.employees && parseInt(company.employees) < 100) {
      traits.push('creative_expression');
    }
    
    if (company.category?.toLowerCase().includes('social') || 
        company.category?.toLowerCase().includes('health')) {
      traits.push('social_impact');
    }
    
    return traits;
  }

  private valueMatchesCompany(value: string, companyTraits: string[]): boolean {
    return companyTraits.includes(value);
  }

  private parseValuation(valuation?: string | null): number {
    if (!valuation) return 0;
    
    const clean = valuation.replace(/[^0-9.]/g, '');
    const num = parseFloat(clean);
    
    if (valuation.includes('B')) return num * 1000000000;
    if (valuation.includes('M')) return num * 1000000;
    if (valuation.includes('K')) return num * 1000;
    
    return num;
  }

  private parseCompanySize(employees?: string | null): string {
    if (!employees) return 'unknown';
    
    const num = parseInt(employees);
    if (num < 50) return 'startup';
    if (num < 500) return 'medium';
    return 'large';
  }

  private generateSalaryRange(company: Company): string {
    const baseSalaries: Record<string, [number, number]> = {
      'entry': [80000, 120000],
      'mid': [120000, 180000],
      'senior': [180000, 250000],
      'lead': [200000, 300000],
      'executive': [250000, 500000],
    };
    
    const level = this.determineExperienceLevel();
    const [min, max] = baseSalaries[level] || [80000, 120000];
    
    // Adjust based on company valuation
    const valuation = this.parseValuation(company.valuation);
    const multiplier = valuation > 1000000000 ? 1.2 : 1.0;
    
    return `$${Math.round(min * multiplier)}k-$${Math.round(max * multiplier)}k`;
  }

  private determineGrowthPotential(company: Company): 'High' | 'Medium' | 'Low' {
    if (company.trending === 'up' && company.fundingStage === 'Series A') return 'High';
    if (company.trending === 'up' || company.featured) return 'Medium';
    return 'Low';
  }

  private generateLastRaised(company: Company): string {
    const months = Math.floor(Math.random() * 24) + 1;
    return `${months} months ago`;
  }

  private generateCompanyAge(company: Company): string {
    const years = Math.floor(Math.random() * 15) + 1;
    return `${years} years`;
  }
}
