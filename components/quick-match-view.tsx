'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Zap, Clock, Target, TrendingUp, AlertCircle,
  ChevronRight, Calendar, MapPin, Building2, Star,
  CheckCircle, XCircle, Sparkles, Code, Briefcase, DollarSign
} from 'lucide-react';
import { bulgeBracketPrograms } from '@/lib/data/bulge-bracket-programs';
import { useDomain } from '@/components/domain-provider';
import { domainConfigs } from '@/lib/ai/domain-config';

interface QuickMatchResult {
  company: string;
  role?: string;
  program?: string;
  matchScore: number;
  reasons: string[];
  urgency: 'closing-soon' | 'just-opened' | 'high-demand' | 'normal';
  locations: string[];
  deadline?: string;
  salary?: string;
  type?: string;
}

export function QuickMatchView() {
  const { selectedDomain } = useDomain();
  const [step, setStep] = useState(0);
  const [profile, setProfile] = useState({
    classYear: '',
    locations: [] as string[],
    experience: '',
    interests: [] as string[],
    skills: [] as string[]
  });
  const [matches, setMatches] = useState<QuickMatchResult[]>([]);
  const [loading, setLoading] = useState(false);

  const domainConfig = domainConfigs[selectedDomain];

  // Domain-specific configuration
  const getDomainConfig = () => {
    switch (selectedDomain) {
      case 'ENGINEERS':
        return {
          title: 'Engineering Opportunities',
          subtitle: 'Match with top tech companies and startups',
          classYears: ['Sophomore', 'Junior', 'Senior', 'Recent Grad', 'Experienced'],
          locations: ['San Francisco', 'New York', 'Seattle', 'Austin', 'Remote'],
          experienceLevels: [
            { id: 'student', label: 'Student/New Grad', icon: '🎓' },
            { id: 'junior', label: '0-2 years', icon: '🌱' },
            { id: 'mid', label: '2-5 years', icon: '💼' },
            { id: 'senior', label: '5+ years', icon: '🚀' }
          ],
          skills: ['Python', 'JavaScript', 'React', 'Node.js', 'AWS', 'Kubernetes', 'ML/AI', 'Go'],
          companies: [
            { name: 'OpenAI', roles: ['ML Engineer', 'Research Engineer'], salary: '$200k-400k' },
            { name: 'Anthropic', roles: ['AI Safety Engineer', 'Systems Engineer'], salary: '$250k-500k' },
            { name: 'Tesla', roles: ['Autopilot Engineer', 'Battery Engineer'], salary: '$150k-350k' },
            { name: 'SpaceX', roles: ['Propulsion Engineer', 'Software Engineer'], salary: '$140k-300k' },
            { name: 'Stripe', roles: ['Backend Engineer', 'Infrastructure Engineer'], salary: '$180k-380k' },
            { name: 'Databricks', roles: ['Platform Engineer', 'ML Engineer'], salary: '$170k-350k' }
          ]
        };

      case 'SOFTWARE':
        return {
          title: 'Product & Software Roles',
          subtitle: 'Find your perfect product or design role',
          classYears: ['Student', 'Entry Level', 'Mid-Level', 'Senior', 'Leadership'],
          locations: ['San Francisco', 'New York', 'Los Angeles', 'Remote', 'Hybrid'],
          experienceLevels: [
            { id: 'intern', label: 'Internship', icon: '📚' },
            { id: 'entry', label: 'Entry Level', icon: '🌟' },
            { id: 'mid', label: 'Mid-Level', icon: '⚡' },
            { id: 'senior', label: 'Senior/Lead', icon: '🎯' }
          ],
          skills: ['Product Management', 'UX Design', 'Figma', 'SQL', 'Analytics', 'A/B Testing', 'Agile', 'User Research'],
          companies: [
            { name: 'Figma', roles: ['Product Manager', 'Product Designer'], salary: '$140k-280k' },
            { name: 'Notion', roles: ['PM, Growth', 'Design Engineer'], salary: '$130k-250k' },
            { name: 'Linear', roles: ['Product Designer', 'Frontend Engineer'], salary: '$120k-240k' },
            { name: 'Canva', roles: ['Senior PM', 'UX Designer'], salary: '$110k-220k' },
            { name: 'Vercel', roles: ['Developer Advocate', 'Technical PM'], salary: '$130k-260k' },
            { name: 'Adobe', roles: ['Principal Designer', 'PM, Creative Cloud'], salary: '$150k-300k' }
          ]
        };

      case 'FINANCE':
        return {
          title: 'Finance Programs',
          subtitle: 'Investment banking, PE, and quant opportunities',
          classYears: ['Sophomore', 'Junior', 'Senior', 'Recent Grad'],
          locations: ['New York', 'London', 'Hong Kong', 'San Francisco', 'Chicago'],
          experienceLevels: [
            { id: 'none', label: 'No finance experience', icon: '🌱' },
            { id: 'basic', label: 'Basic finance knowledge', icon: '📚' },
            { id: 'internship', label: 'Previous IB internship', icon: '💼' },
            { id: 'advanced', label: 'Strong finance background', icon: '🚀' }
          ],
          skills: ['Financial Modeling', 'Excel', 'Python', 'PowerPoint', 'Accounting', 'Valuation', 'SQL', 'Bloomberg'],
          companies: bulgeBracketPrograms.slice(0, 10).map(p => ({
            name: p.company,
            roles: [p.programName],
            salary: p.compensationRange || '$95k-110k'
          }))
        };

      default:
        return getDomainConfig(); // Fallback to current domain config
    }
  };

  const config = getDomainConfig();

  const generateMatches = () => {
    setLoading(true);

    setTimeout(() => {
      const results: QuickMatchResult[] = [];

      if (selectedDomain === 'FINANCE') {
        // Use real Bulge Bracket data for Finance
        const today = new Date();
        const scoredPrograms = bulgeBracketPrograms.map(program => {
          let score = 60 + Math.random() * 35;
          const reasons: string[] = [];
          let urgency: 'closing-soon' | 'just-opened' | 'high-demand' | 'normal' = 'normal';

          // Location matching
          if (profile.locations.some(loc =>
            program.locations.some(pLoc => pLoc.includes(loc))
          )) {
            score += 10;
            reasons.push('Matches location preference');
          }

          // Experience matching
          if (profile.experience === 'internship' && program.tier === 'Elite Boutique') {
            score += 15;
            reasons.push('Elite program for experienced candidates');
          } else if (profile.experience === 'none' && program.tier === 'Middle Market') {
            score += 10;
            reasons.push('Good entry point for beginners');
          }

          // Check deadline urgency
          if (program.closingDate) {
            const closeDate = new Date(program.closingDate);
            const daysUntilClose = Math.ceil((closeDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));

            if (daysUntilClose > 0 && daysUntilClose <= 7) {
              urgency = 'closing-soon';
              reasons.push(`Closes in ${daysUntilClose} days`);
            }
          }

          // Check if recently opened
          if (program.openingDate) {
            const openDate = new Date(program.openingDate);
            const daysSinceOpen = Math.ceil((today.getTime() - openDate.getTime()) / (1000 * 60 * 60 * 24));

            if (daysSinceOpen >= 0 && daysSinceOpen <= 3) {
              urgency = 'just-opened';
              reasons.push('Just opened - apply early!');
            }
          }

          // Skills matching
          if (profile.skills.includes('Financial Modeling')) {
            score += 8;
            reasons.push('Strong technical skills match');
          }

          if (reasons.length === 0) {
            reasons.push('Strong cultural fit', 'Growing division');
          }

          return {
            company: program.company,
            program: program.programName,
            matchScore: Math.min(Math.round(score), 98),
            reasons: reasons.slice(0, 2),
            urgency,
            locations: program.locations,
            deadline: program.closingDate || undefined,
            salary: program.compensationRange,
            type: program.tier
          };
        });

        results.push(...scoredPrograms.slice(0, 8));

      } else {
        // Generate matches for Engineering and Software domains
        config.companies.forEach(company => {
          company.roles.forEach(role => {
            let score = 65 + Math.random() * 30;
            const reasons: string[] = [];
            let urgency: 'closing-soon' | 'just-opened' | 'high-demand' | 'normal' = 'normal';

            // Location matching
            if (profile.locations.includes('San Francisco') || profile.locations.includes('Remote')) {
              score += 10;
              reasons.push('Matches location preference');
            }

            // Experience level matching
            if (profile.experience === 'senior' && role.includes('Senior')) {
              score += 15;
              reasons.push('Perfect seniority match');
            } else if (profile.experience === 'student' && company.name === 'OpenAI') {
              score += 20;
              reasons.push('Top choice for new grads');
              urgency = 'high-demand';
            }

            // Skills matching
            const matchedSkills = profile.skills.filter(skill =>
              selectedDomain === 'ENGINEERS' ?
                ['Python', 'React', 'ML/AI'].includes(skill) :
                ['Product Management', 'Figma', 'Analytics'].includes(skill)
            );

            if (matchedSkills.length > 0) {
              score += matchedSkills.length * 5;
              reasons.push(`${matchedSkills.length} skill matches`);
            }

            // Random urgency for demo
            if (Math.random() > 0.7) {
              urgency = Math.random() > 0.5 ? 'high-demand' : 'just-opened';
              if (urgency === 'high-demand') {
                reasons.push('High competition - apply ASAP');
              }
            }

            if (reasons.length === 0) {
              reasons.push('Strong team culture', 'Excellent growth potential');
            }

            results.push({
              company: company.name,
              role,
              matchScore: Math.min(Math.round(score), 97),
              reasons: reasons.slice(0, 2),
              urgency,
              locations: ['San Francisco', 'Remote'],
              salary: company.salary,
              type: 'Full-time'
            });
          });
        });
      }

      // Sort by urgency and score
      results.sort((a, b) => {
        if (a.urgency === 'closing-soon' && b.urgency !== 'closing-soon') return -1;
        if (b.urgency === 'closing-soon' && a.urgency !== 'closing-soon') return 1;
        if (a.urgency === 'high-demand' && b.urgency !== 'high-demand') return -1;
        if (b.urgency === 'high-demand' && a.urgency !== 'high-demand') return 1;
        return b.matchScore - a.matchScore;
      });

      setMatches(results.slice(0, 8));
      setLoading(false);
      setStep(4);
    }, 1500);
  };

  const getUrgencyBadge = (urgency: string) => {
    switch (urgency) {
      case 'closing-soon':
        return (
          <span className="flex items-center gap-1 rounded-full bg-red-500/10 px-2 py-0.5 text-red-600 text-xs">
            <Clock className="size-3" />
            Closing Soon
          </span>
        );
      case 'just-opened':
        return (
          <span className="flex items-center gap-1 rounded-full bg-green-500/10 px-2 py-0.5 text-green-600 text-xs">
            <Sparkles className="size-3" />
            New
          </span>
        );
      case 'high-demand':
        return (
          <span className="flex items-center gap-1 rounded-full bg-orange-500/10 px-2 py-0.5 text-orange-600 text-xs">
            <TrendingUp className="size-3" />
            High Demand
          </span>
        );
      default:
        return null;
    }
  };

  const getDomainIcon = () => {
    switch (selectedDomain) {
      case 'ENGINEERS':
        return <Code className="size-5" />;
      case 'SOFTWARE':
        return <Briefcase className="size-5" />;
      case 'FINANCE':
        return <DollarSign className="size-5" />;
      default:
        return <Zap className="size-5" />;
    }
  };

  return (
    <div className="flex h-full flex-col">
      {/* Header */}
      <div className="border-border border-b px-6 py-4">
        <div className="mx-auto max-w-4xl">
          <div className="flex items-center gap-3">
            {getDomainIcon()}
            <h1 className="font-bold text-2xl">Quick Match</h1>
            <span className={`rounded-full px-2 py-0.5 text-xs bg-gradient-to-r ${domainConfig.theme.logoColor} text-white`}>
              {domainConfig.name}
            </span>
          </div>
          <p className="mt-1 text-muted-foreground text-sm">
            {config.subtitle}
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto">
        <div className="mx-auto max-w-4xl p-6">
          <AnimatePresence mode="wait">
            {/* Step 0: Class Year / Experience Level */}
            {step === 0 && (
              <motion.div
                key="step0"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-6"
              >
                <div>
                  <h2 className="mb-2 font-semibold text-lg">
                    {selectedDomain === 'SOFTWARE' ? 'What\'s your level?' : 'What year are you?'}
                  </h2>
                  <p className="text-muted-foreground text-sm">This helps us match you to appropriate opportunities</p>
                </div>
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                  {config.classYears.map(year => (
                    <button
                      key={year}
                      onClick={() => {
                        setProfile(p => ({ ...p, classYear: year }));
                        setStep(1);
                      }}
                      className="rounded-lg border border-border bg-card p-4 transition-all hover:border-primary hover:bg-accent"
                    >
                      <div className="font-medium">{year}</div>
                    </button>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Step 1: Locations */}
            {step === 1 && (
              <motion.div
                key="step1"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-6"
              >
                <div>
                  <h2 className="mb-2 font-semibold text-lg">Preferred locations?</h2>
                  <p className="text-muted-foreground text-sm">Select all that apply</p>
                </div>
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                  {config.locations.map(loc => (
                    <button
                      key={loc}
                      onClick={() => {
                        setProfile(p => ({
                          ...p,
                          locations: p.locations.includes(loc)
                            ? p.locations.filter(l => l !== loc)
                            : [...p.locations, loc]
                        }));
                      }}
                      className={`rounded-lg border p-3 transition-all ${
                        profile.locations.includes(loc)
                          ? 'border-primary bg-primary/10'
                          : 'border-border hover:bg-accent'
                      }`}
                    >
                      <MapPin className="mb-2 size-4 mx-auto" />
                      <div className="font-medium text-sm">{loc}</div>
                    </button>
                  ))}
                </div>
                <button
                  onClick={() => setStep(2)}
                  disabled={profile.locations.length === 0}
                  className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-primary-foreground transition-colors hover:bg-primary/90 disabled:opacity-50"
                >
                  Continue
                  <ChevronRight className="size-4" />
                </button>
              </motion.div>
            )}

            {/* Step 2: Experience */}
            {step === 2 && (
              <motion.div
                key="step2"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-6"
              >
                <div>
                  <h2 className="mb-2 font-semibold text-lg">Your experience level?</h2>
                  <p className="text-muted-foreground text-sm">We\'ll match you to appropriate roles</p>
                </div>
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  {config.experienceLevels.map(level => (
                    <button
                      key={level.id}
                      onClick={() => {
                        setProfile(p => ({ ...p, experience: level.id }));
                        setStep(3);
                      }}
                      className="rounded-lg border border-border bg-card p-4 text-left transition-all hover:border-primary hover:bg-accent"
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">{level.icon}</span>
                        <span className="font-medium">{level.label}</span>
                      </div>
                    </button>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Step 3: Skills */}
            {step === 3 && (
              <motion.div
                key="step3"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-6"
              >
                <div>
                  <h2 className="mb-2 font-semibold text-lg">Your top skills?</h2>
                  <p className="text-muted-foreground text-sm">Select up to 4 that best match your expertise</p>
                </div>
                <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                  {config.skills.map(skill => (
                    <button
                      key={skill}
                      onClick={() => {
                        setProfile(p => ({
                          ...p,
                          skills: p.skills.includes(skill)
                            ? p.skills.filter(s => s !== skill)
                            : p.skills.length < 4 ? [...p.skills, skill] : p.skills
                        }));
                      }}
                      disabled={!profile.skills.includes(skill) && profile.skills.length >= 4}
                      className={`rounded-lg border p-2 text-sm transition-all ${
                        profile.skills.includes(skill)
                          ? 'border-primary bg-primary/10 font-medium'
                          : 'border-border hover:bg-accent disabled:opacity-50'
                      }`}
                    >
                      {skill}
                    </button>
                  ))}
                </div>
                <button
                  onClick={generateMatches}
                  disabled={profile.skills.length === 0}
                  className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-primary-foreground transition-colors hover:bg-primary/90 disabled:opacity-50"
                >
                  Find Matches
                  <Zap className="size-4" />
                </button>
              </motion.div>
            )}

            {/* Loading State */}
            {loading && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex flex-col items-center justify-center py-20"
              >
                <div className="relative">
                  <div className="size-16 animate-spin rounded-full border-4 border-muted border-t-primary" />
                  <Zap className="absolute top-1/2 left-1/2 size-6 -translate-x-1/2 -translate-y-1/2 transform text-primary" />
                </div>
                <p className="mt-4 text-muted-foreground">Finding your perfect matches...</p>
              </motion.div>
            )}

            {/* Step 4: Results */}
            {step === 4 && !loading && (
              <motion.div
                key="results"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="space-y-6"
              >
                {/* Summary Stats */}
                <div className="grid grid-cols-3 gap-4 rounded-lg bg-gradient-to-r from-primary/10 to-primary/5 p-4">
                  <div className="text-center">
                    <div className="font-bold text-2xl">
                      {matches.filter(m => m.urgency === 'closing-soon' || m.urgency === 'high-demand').length}
                    </div>
                    <div className="text-muted-foreground text-xs">Urgent</div>
                  </div>
                  <div className="text-center">
                    <div className="font-bold text-2xl">{matches.filter(m => m.matchScore >= 85).length}</div>
                    <div className="text-muted-foreground text-xs">Perfect Fits</div>
                  </div>
                  <div className="text-center">
                    <div className="font-bold text-2xl">{matches.length}</div>
                    <div className="text-muted-foreground text-xs">Total Matches</div>
                  </div>
                </div>

                {/* Urgent Alert */}
                {matches.filter(m => m.urgency === 'closing-soon' || m.urgency === 'high-demand').length > 0 && (
                  <div className="flex items-center gap-3 rounded-lg border border-orange-500/30 bg-orange-500/10 p-3">
                    <AlertCircle className="size-5 text-orange-600" />
                    <span className="font-medium text-sm">
                      {matches.filter(m => m.urgency === 'closing-soon').length > 0 &&
                        `${matches.filter(m => m.urgency === 'closing-soon').length} closing soon. `}
                      {matches.filter(m => m.urgency === 'high-demand').length > 0 &&
                        `${matches.filter(m => m.urgency === 'high-demand').length} in high demand.`}
                      {' Apply today!'}
                    </span>
                  </div>
                )}

                {/* Match Cards */}
                <div className="space-y-3">
                  {matches.map((match, idx) => (
                    <motion.div
                      key={idx}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.1 }}
                      className="group rounded-lg border border-border bg-card p-4 transition-all hover:border-primary/30 hover:bg-accent/5"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3">
                            <h3 className="font-semibold">{match.company}</h3>
                            {getUrgencyBadge(match.urgency)}
                            <span className="rounded-full bg-primary/10 px-2 py-0.5 font-bold text-primary text-xs">
                              {match.matchScore}% Match
                            </span>
                          </div>
                          <p className="mt-1 text-muted-foreground text-sm">
                            {match.role || match.program}
                          </p>

                          {/* Match Reasons */}
                          <div className="mt-2 flex flex-wrap gap-2">
                            {match.reasons.map((reason, i) => (
                              <span key={i} className="flex items-center gap-1 text-muted-foreground text-xs">
                                <CheckCircle className="size-3 text-green-500" />
                                {reason}
                              </span>
                            ))}
                          </div>

                          {/* Details */}
                          <div className="mt-2 flex items-center gap-4 text-muted-foreground text-xs">
                            <span className="flex items-center gap-1">
                              <MapPin className="size-3" />
                              {match.locations.join(', ')}
                            </span>
                            {match.salary && (
                              <span className="flex items-center gap-1">
                                <DollarSign className="size-3" />
                                {match.salary}
                              </span>
                            )}
                          </div>
                        </div>

                        <button className="rounded-lg bg-primary px-3 py-1.5 text-primary-foreground text-sm opacity-0 transition-opacity group-hover:opacity-100">
                          Apply
                        </button>
                      </div>
                    </motion.div>
                  ))}
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3">
                  <button
                    onClick={() => {
                      setStep(0);
                      setProfile({ classYear: '', locations: [], experience: '', interests: [], skills: [] });
                    }}
                    className="rounded-lg border border-border px-4 py-2 transition-colors hover:bg-accent"
                  >
                    Start Over
                  </button>
                  <button className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-primary-foreground transition-colors hover:bg-primary/90">
                    <Calendar className="size-4" />
                    Save Matches
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}