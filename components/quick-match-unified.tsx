'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Sparkles, 
  MessageCircle, 
  Brain, 
  Target, 
  Heart, 
  XCircle, 
  ArrowRight, 
  Loader2,
  CheckCircle,
  User,
  Briefcase,
  MapPin,
  DollarSign,
  Clock,
  TrendingUp,
  Star
} from 'lucide-react';
import { useDomain } from '@/components/domain-provider';
import { useSession } from 'next-auth/react';
import { cn } from '@/lib/utils';
import confetti from 'canvas-confetti';

// Types
interface UserProfile {
  // Basic info from onboarding
  name: string;
  classYear: string;
  major: string;
  energyProfile: Record<string, number>;
  values: string[];
  peakMoment: string;
  constraints: {
    geography: string;
    salary_minimum: string;
  };
  immediateGoal: string;
  
  // Enhanced data from conversation
  skills: string[];
  interests: string[];
  workStyle: string;
  careerGoals: string[];
  dealBreakers: string[];
  mustHaves: string[];
  salaryExpectation?: {
    min: number;
    max: number;
  };
  locationPreferences: string[];
  timeline: string;
  technicalLevel?: number;
}

interface ConversationMessage {
  id: string;
  type: 'ai' | 'user';
  content: string;
  timestamp: Date;
}

interface MatchResult {
  id: string;
  company: string;
  role: string;
  matchScore: number;
  reasons: string[];
  strengths: string[];
  challenges: string[];
  urgency: 'closing-soon' | 'just-opened' | 'high-demand' | 'normal' | 'last-chance';
  locations: string[];
  salary: {
    min: number;
    max: number;
    currency: string;
  };
  type: string;
  department: string;
  teamSize: string;
  techStack?: string[];
  benefits: string[];
  growthPotential: number;
  competitionLevel: 'low' | 'medium' | 'high' | 'extreme';
  applicationUrl?: string;
  companyLogo?: string;
  companyRating?: number;
  companySize?: string;
  industry?: string;
  requirements: string[];
  timeToHire: string;
  successProbability: number;
}

interface QuickMatchSession {
  id: string;
  userId: string;
  domain: string;
  profile: UserProfile;
  conversation: ConversationMessage[];
  matches: MatchResult[];
  currentStep: number;
  completed: boolean;
}

// Main component
export function UnifiedQuickMatch() {
  const { selectedDomain } = useDomain();
  const { data: session } = useSession();
  const [quickMatchSession, setQuickMatchSession] = useState<QuickMatchSession | null>(null);
  const [loading, setLoading] = useState(false);
  const [currentMessage, setCurrentMessage] = useState('');
  const [savedMatches, setSavedMatches] = useState<Set<string>>(new Set());
  const [rejectedMatches, setRejectedMatches] = useState<Set<string>>(new Set());
  const [currentMatchIndex, setCurrentMatchIndex] = useState(0);
  const [showDetails, setShowDetails] = useState(false);

  // Initialize session
  useEffect(() => {
    if (session?.user) {
      initializeSession();
    }
  }, [session, selectedDomain]);

  const initializeSession = async () => {
    setLoading(true);
    try {
      console.log('Initializing session with:', {
        userId: session?.user?.id,
        email: session?.user?.email,
        domain: selectedDomain
      });
      
      const response = await fetch('/api/quick-match/initialize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: session?.user?.id,
          domain: selectedDomain
        })
      });

      if (response.ok) {
        const sessionData = await response.json();
        console.log('Session data received:', sessionData);
        setQuickMatchSession(sessionData);
      } else {
        console.error('Failed to initialize session:', response.status, await response.text());
      }
    } catch (error) {
      console.error('Failed to initialize session:', error);
    } finally {
      setLoading(false);
    }
  };

  // Send message to conversation
  const sendMessage = async (message: string) => {
    if (!quickMatchSession || !message.trim()) return;

    setLoading(true);
    try {
      const response = await fetch('/api/quick-match/conversation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sessionId: quickMatchSession.id,
          message: message.trim()
        })
      });

      if (response.ok) {
        const updatedSession = await response.json();
        setQuickMatchSession(updatedSession);
        setCurrentMessage('');
      }
    } catch (error) {
      console.error('Failed to send message:', error);
    } finally {
      setLoading(false);
    }
  };

  // Generate matches
  const generateMatches = async () => {
    if (!quickMatchSession) return;

    setLoading(true);
    try {
      const response = await fetch('/api/quick-match/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sessionId: quickMatchSession.id
        })
      });

      if (response.ok) {
        const updatedSession = await response.json();
        setQuickMatchSession(updatedSession);
        
        // Celebrate if top match is excellent
        if (updatedSession.matches[0]?.matchScore > 85) {
          confetti({
            particleCount: 100,
            spread: 70,
            origin: { y: 0.6 }
          });
        }
      }
    } catch (error) {
      console.error('Failed to generate matches:', error);
    } finally {
      setLoading(false);
    }
  };

  // Swipe actions
  const handleSwipe = (direction: 'left' | 'right') => {
    if (!quickMatchSession?.matches) return;

    const currentMatch = quickMatchSession.matches?.[currentMatchIndex];
    if (!currentMatch) return;

    if (direction === 'right') {
      setSavedMatches(prev => new Set(prev).add(currentMatch.id));
      if (currentMatch.matchScore > 85) {
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 }
        });
      }
    } else {
      setRejectedMatches(prev => new Set(prev).add(currentMatch.id));
    }

    setCurrentMatchIndex(prev => Math.min(prev + 1, (quickMatchSession.matches?.length || 0) - 1));
  };

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (quickMatchSession?.currentStep === 3) {
        if (e.key === 'ArrowLeft') handleSwipe('left');
        if (e.key === 'ArrowRight') handleSwipe('right');
        if (e.key === ' ') setShowDetails(!showDetails);
        if (e.key === 'Escape') setShowDetails(false);
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [quickMatchSession?.currentStep, currentMatchIndex, showDetails]);

  if (loading && !quickMatchSession) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="text-center">
          <Loader2 className="mx-auto mb-4 size-8 animate-spin" />
          <p className="text-muted-foreground">Initializing your personalized experience...</p>
        </div>
      </div>
    );
  }

  if (!quickMatchSession) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="text-center">
          <p className="text-muted-foreground">Please log in to use Quick Match</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-full flex-col bg-background text-foreground">
      {/* Header */}
      <div className="border-b bg-card px-6 py-4">
        <div className="mx-auto max-w-5xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="flex h-8 w-8 items-center justify-center rounded border border-red-700 bg-red-600 font-bold text-white text-xs shadow-sm">
                ⚡
              </div>
              <div>
                <h1 className="text-2xl font-bold">Quick Match</h1>
                <p className="text-muted-foreground text-sm">
                  AI-powered career matching for {selectedDomain.toLowerCase()} professionals
                </p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              {/* Progress indicator */}
              <div className="flex items-center gap-2">
                {[0, 1, 2, 3].map(i => (
                  <div
                    key={i}
                    className={cn(
                      "h-1.5 rounded-full transition-all",
                      i <= quickMatchSession.currentStep ? "w-8 bg-primary" : "w-4 bg-muted"
                    )}
                  />
                ))}
              </div>
              {quickMatchSession.currentStep === 3 && (
                <div className="flex items-center gap-2">
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

      {/* Main Content */}
      <div className="flex-1 overflow-hidden relative">
        {/* Subtle light orb for techy feel */}
        <div className="absolute top-1/4 right-1/4 size-32 rounded-full bg-blue-500/10 blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 left-1/4 size-24 rounded-full bg-purple-500/10 blur-2xl animate-pulse" />
        
        <AnimatePresence mode="wait">
          {/* Step 0: Welcome & Profile Review */}
          {quickMatchSession.currentStep === 0 && (
            <motion.div
              key="step0"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="flex h-full items-center justify-center p-6"
            >
              <div className="w-full max-w-3xl space-y-6">
                <div className="text-center">
                  <h2 className="mb-2 text-2xl font-bold">Welcome back, {quickMatchSession.profile.name || 'User'}!</h2>
                  <p className="text-muted-foreground">
                    Let's refine your profile for better career matches
                  </p>
                </div>

                {/* Profile Summary */}
                <div className="rounded-lg border bg-card p-6">
                  <h3 className="mb-4 font-semibold">Your Profile Summary</h3>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-muted-foreground">Class Year:</span>
                      <span className="ml-2 font-medium">{quickMatchSession.profile.classYear || 'Not specified'}</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Major:</span>
                      <span className="ml-2 font-medium">{quickMatchSession.profile.major || 'Not specified'}</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Values:</span>
                      <span className="ml-2 font-medium">{quickMatchSession.profile.values?.join(', ') || 'Not specified'}</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Goal:</span>
                      <span className="ml-2 font-medium">{quickMatchSession.profile.immediateGoal || 'Not specified'}</span>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => {
                    setQuickMatchSession(prev => prev ? { ...prev, currentStep: 1 } : null);
                  }}
                  className="w-full rounded-lg bg-primary py-3 font-medium text-primary-foreground transition-opacity hover:opacity-90"
                >
                  Continue to Conversation <ArrowRight className="ml-2 inline-block size-4" />
                </button>
              </div>
            </motion.div>
          )}

          {/* Step 1: Quick Fields */}
          {quickMatchSession.currentStep === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="flex h-full items-center justify-center p-6"
            >
              <div className="w-full max-w-3xl space-y-6">
                <div className="text-center">
                  <h2 className="mb-2 text-2xl font-bold">Quick Preferences</h2>
                  <p className="text-muted-foreground">
                    Help us understand your priorities and preferences
                  </p>
                </div>

                <div className="space-y-6">
                  {/* Location Preferences */}
                  <div>
                    <h3 className="mb-3 font-medium">Preferred locations?</h3>
                    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                      {['San Francisco', 'New York', 'Seattle', 'Remote', 'Any'].map(loc => (
                        <button
                          key={loc}
                          onClick={() => {
                            setQuickMatchSession(prev => prev ? {
                              ...prev,
                              profile: {
                                ...prev.profile,
                                locationPreferences: prev.profile.locationPreferences?.includes(loc)
                                  ? prev.profile.locationPreferences.filter(l => l !== loc)
                                  : [...(prev.profile.locationPreferences || []), loc]
                              }
                            } : null);
                          }}
                          className={cn(
                            "rounded-lg border px-4 py-2 text-sm transition-colors",
                            quickMatchSession.profile.locationPreferences?.includes(loc)
                              ? "border-primary bg-primary text-primary-foreground"
                              : "border-muted-foreground/20 hover:border-primary/50"
                          )}
                        >
                          {loc}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Technical Level */}
                  <div>
                    <h3 className="mb-3 font-medium">How technical are you? (1-10)</h3>
                    <div className="flex gap-2">
                      {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(level => (
                        <button
                          key={level}
                          onClick={() => {
                            setQuickMatchSession(prev => prev ? {
                              ...prev,
                              profile: {
                                ...prev.profile,
                                technicalLevel: level
                              }
                            } : null);
                          }}
                          className={cn(
                            "flex h-10 w-10 items-center justify-center rounded-lg border text-sm font-medium transition-colors",
                            quickMatchSession.profile.technicalLevel === level
                              ? "border-primary bg-primary text-primary-foreground"
                              : "border-muted-foreground/20 hover:border-primary/50"
                          )}
                        >
                          {level}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Timeline */}
                  <div>
                    <h3 className="mb-3 font-medium">When are you looking to start?</h3>
                    <div className="grid grid-cols-2 gap-3">
                      {['Summer 2025', 'Fall 2025', 'Spring 2026', 'Summer 2026'].map(timeline => (
                        <button
                          key={timeline}
                          onClick={() => {
                            setQuickMatchSession(prev => prev ? {
                              ...prev,
                              profile: {
                                ...prev.profile,
                                timeline: timeline
                              }
                            } : null);
                          }}
                          className={cn(
                            "rounded-lg border px-4 py-2 text-sm transition-colors",
                            quickMatchSession.profile.timeline === timeline
                              ? "border-primary bg-primary text-primary-foreground"
                              : "border-muted-foreground/20 hover:border-primary/50"
                          )}
                        >
                          {timeline}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Hard Priorities */}
                  <div>
                    <h3 className="mb-3 font-medium">What matters most to you?</h3>
                    <div className="grid grid-cols-2 gap-3">
                      {['Learning & Growth', 'High Salary', 'Work-Life Balance', 'Company Prestige', 'Impact', 'Fast Pace'].map(priority => (
                        <button
                          key={priority}
                          onClick={() => {
                            setQuickMatchSession(prev => prev ? {
                              ...prev,
                              profile: {
                                ...prev.profile,
                                mustHaves: prev.profile.mustHaves?.includes(priority)
                                  ? prev.profile.mustHaves.filter(p => p !== priority)
                                  : [...(prev.profile.mustHaves || []), priority]
                              }
                            } : null);
                          }}
                          className={cn(
                            "rounded-lg border px-4 py-2 text-sm transition-colors",
                            quickMatchSession.profile.mustHaves?.includes(priority)
                              ? "border-primary bg-primary text-primary-foreground"
                              : "border-muted-foreground/20 hover:border-primary/50"
                          )}
                        >
                          {priority}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => {
                    setQuickMatchSession(prev => prev ? { ...prev, currentStep: 2 } : null);
                  }}
                  className="w-full rounded-lg bg-primary py-3 font-medium text-primary-foreground transition-opacity hover:opacity-90"
                >
                  Continue to Conversation <ArrowRight className="ml-2 inline-block size-4" />
                </button>
              </div>
            </motion.div>
          )}

          {/* Step 2: LLM Conversation */}
          {quickMatchSession.currentStep === 2 && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="flex h-full flex-col p-6"
            >
              <div className="mb-6 text-center">
                <h2 className="mb-2 text-2xl font-bold">Let's dive deeper</h2>
                <p className="text-muted-foreground">
                  I'll ask you some targeted questions to understand your career preferences
                </p>
              </div>

              {/* Conversation */}
              <div className="flex-1 space-y-4 overflow-y-auto rounded-lg border bg-card p-4">
                {quickMatchSession.conversation?.map((message, index) => (
                  <motion.div
                    key={message.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className={cn(
                      "flex gap-3",
                      message.type === 'user' ? "justify-end" : "justify-start"
                    )}
                  >
                    <div className={cn(
                      "max-w-[80%] rounded-lg px-4 py-2",
                      message.type === 'user' 
                        ? "bg-primary text-primary-foreground" 
                        : "bg-muted border border-blue-500/20"
                    )}>
                      <p className="text-sm">{message.content}</p>
                    </div>
                  </motion.div>
                ))}
                
                {loading && (
                  <div className="flex gap-3">
                    <div className="rounded-lg bg-muted border border-blue-500/20 px-4 py-2">
                      <div className="flex items-center gap-2">
                        <Loader2 className="size-4 animate-spin text-blue-500" />
                        <span className="text-sm">Thinking...</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Input */}
              <div className="mt-4 flex gap-2">
                <input
                  type="text"
                  value={currentMessage}
                  onChange={(e) => setCurrentMessage(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && sendMessage(currentMessage)}
                  placeholder="Type your response..."
                  className="flex-1 rounded-lg border border-blue-500/20 bg-background px-4 py-2 focus:border-blue-500/50 focus:outline-none"
                  disabled={loading}
                />
                <button
                  onClick={() => sendMessage(currentMessage)}
                  disabled={loading || !currentMessage.trim()}
                  className="rounded-lg bg-primary px-4 py-2 text-primary-foreground disabled:opacity-50"
                >
                  Send
                </button>
              </div>

              {/* Generate Matches Button */}
              <div className="mt-4 text-center">
                <button
                  onClick={() => {
                    setQuickMatchSession(prev => prev ? { ...prev, currentStep: 3 } : null);
                  }}
                  className="rounded-lg bg-primary py-3 px-6 font-medium text-primary-foreground transition-opacity hover:opacity-90"
                >
                  Generate Matches <ArrowRight className="ml-2 inline-block size-4" />
                </button>
              </div>
            </motion.div>
          )}

          {/* Step 3: Results - Swipeable Cards */}
          {quickMatchSession.currentStep === 3 && quickMatchSession.matches && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="flex h-full items-center justify-center p-6"
            >
              <div className="w-full max-w-3xl space-y-6">
                <div className="text-center">
                  <h2 className="mb-2 text-2xl font-bold">Final preferences</h2>
                  <p className="text-muted-foreground">
                    Help us fine-tune your matches with these quick questions
                  </p>
                </div>

                {/* Smart questions based on missing data */}
                <div className="space-y-6">
                  {/* Location preferences */}
                  {!quickMatchSession.profile.locationPreferences?.length && (
                    <div>
                      <h3 className="mb-3 font-medium">Preferred locations?</h3>
                      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                        {['San Francisco', 'New York', 'Seattle', 'Remote', 'Any'].map(loc => (
                          <button
                            key={loc}
                            onClick={() => {
                              setQuickMatchSession(prev => prev ? {
                                ...prev,
                                profile: {
                                  ...prev.profile,
                                  locationPreferences: [...(prev.profile.locationPreferences || []), loc]
                                }
                              } : null);
                            }}
                            className="rounded-lg border px-4 py-2 text-sm transition-all hover:border-primary hover:bg-accent"
                          >
                            {loc}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Salary expectations */}
                  {!quickMatchSession.profile.salaryExpectation && (
                    <div>
                      <h3 className="mb-3 font-medium">Salary expectations?</h3>
                      <div className="grid grid-cols-2 gap-3">
                        <select
                          className="rounded-lg border bg-background px-3 py-2"
                          onChange={(e) => {
                            setQuickMatchSession(prev => prev ? {
                              ...prev,
                              profile: {
                                ...prev.profile,
                              salaryExpectation: {
                                min: Number.parseInt(e.target.value) || 0,
                                max: prev.profile.salaryExpectation?.max || 999999
                              }
                              }
                            } : null);
                          }}
                        >
                          <option value="">Minimum</option>
                          <option value="80000">$80k</option>
                          <option value="100000">$100k</option>
                          <option value="120000">$120k</option>
                          <option value="150000">$150k</option>
                        </select>
                        <select
                          className="rounded-lg border bg-background px-3 py-2"
                          onChange={(e) => {
                            setQuickMatchSession(prev => prev ? {
                              ...prev,
                              profile: {
                                ...prev.profile,
                              salaryExpectation: {
                                min: prev.profile.salaryExpectation?.min || 0,
                                max: Number.parseInt(e.target.value) || 999999
                              }
                              }
                            } : null);
                          }}
                        >
                          <option value="">Maximum</option>
                          <option value="150000">$150k</option>
                          <option value="200000">$200k</option>
                          <option value="300000">$300k</option>
                          <option value="500000">$500k</option>
                        </select>
                      </div>
                    </div>
                  )}
                </div>

                <button
                  onClick={generateMatches}
                  disabled={loading}
                  className="flex w-full items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-primary to-primary/80 py-3 font-medium text-primary-foreground transition-all hover:opacity-90 disabled:opacity-50"
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
            </motion.div>
          )}

          {/* Step 3: Results - Swipeable Cards */}
          {quickMatchSession.currentStep === 3 && quickMatchSession.matches && (
            <motion.div
              key="step3"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex h-full items-center justify-center p-6"
            >
              <div className="w-full max-w-md">
                <div className="mb-6 text-center">
                  <h2 className="font-bold text-2xl">Your AI Matches</h2>
                  <p className="mt-1 text-muted-foreground text-sm">
                    Swipe right to save, left to pass
                  </p>
                </div>

                {/* Match Card Stack */}
                <div className="relative h-[500px]">
                  <AnimatePresence>
                    {quickMatchSession.matches?.slice(currentMatchIndex, currentMatchIndex + 3).map((match, index) => (
                      <motion.div
                        key={match.id}
                        initial={{ scale: 0.95, opacity: 0 }}
                        animate={{
                          scale: 1 - index * 0.05,
                          opacity: 1,
                          y: index * 10,
                          zIndex: (quickMatchSession.matches?.length || 0) - currentMatchIndex - index
                        }}
                        exit={index === 0 ? {
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
                            <div className="mb-2 flex items-center gap-3">
                              <div className="flex size-12 items-center justify-center rounded-lg bg-gradient-to-br from-primary/20 to-primary/10 text-2xl">
                                {match.companyLogo || '🏢'}
                              </div>
                              <div>
                                <h3 className="font-bold text-lg">{match.company}</h3>
                                <p className="text-muted-foreground text-sm">{match.role}</p>
                              </div>
                            </div>
                          </div>

                          {/* Key Details */}
                          <div className="mb-4 space-y-3">
                            <div className="flex items-center gap-2 text-sm">
                              <MapPin className="size-4 text-muted-foreground" />
                              <span>{match.locations?.join(', ') || 'Location not specified'}</span>
                            </div>

                            <div className="flex items-center gap-2 text-sm">
                              <DollarSign className="size-4 text-muted-foreground" />
                              <span>
                                ${match.salary?.min?.toLocaleString() || '0'} - ${match.salary?.max?.toLocaleString() || '0'}
                              </span>
                            </div>

                            <div className="flex items-center gap-2 text-sm">
                              <Briefcase className="size-4 text-muted-foreground" />
                              <span>{match.department || 'Department'} • {match.teamSize || 'Team size'}</span>
                            </div>
                          </div>

                          {/* Match Reasons */}
                          <div className="mb-4 space-y-2">
                            {match.strengths?.slice(0, 2).map((strength, idx) => (
                              <div key={idx} className="flex items-start gap-2">
                                <CheckCircle className="mt-0.5 size-4 text-green-500" />
                                <span className="text-sm">{strength}</span>
                              </div>
                            ))}
                            {match.reasons?.slice(0, 1).map((reason, idx) => (
                              <div key={idx} className="flex items-start gap-2">
                                <Sparkles className="mt-0.5 size-4 text-primary" />
                                <span className="text-sm">{reason}</span>
                              </div>
                            ))}
                          </div>

                          {/* Growth & Competition */}
                          <div className="flex items-center gap-4 border-t pt-4">
                            <div className="flex items-center gap-1">
                              <TrendingUp className="size-4 text-muted-foreground" />
                              <span className="text-sm">
                                Growth: {'⭐'.repeat(match.growthPotential || 0)}
                              </span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Star className="size-4 text-muted-foreground" />
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
                            <div className="absolute right-6 bottom-6 left-6 flex justify-between text-muted-foreground text-sm">
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
                <div className="mt-8 flex items-center justify-center gap-4">
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => handleSwipe('left')}
                    className="flex size-14 items-center justify-center rounded-full border-2 border-red-500/20 bg-red-500/10 text-red-500 transition-colors hover:bg-red-500/20"
                  >
                    <XCircle className="size-6" />
                  </motion.button>

                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setShowDetails(!showDetails)}
                    className="flex size-12 items-center justify-center rounded-full border bg-card transition-colors hover:bg-accent"
                  >
                    <MessageCircle className="size-5" />
                  </motion.button>

                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => handleSwipe('right')}
                    className="flex size-14 items-center justify-center rounded-full border-2 border-green-500/20 bg-green-500/10 text-green-500 transition-colors hover:bg-green-500/20"
                  >
                    <Heart className="size-6" />
                  </motion.button>
                </div>

                {/* Progress */}
                <div className="mt-6 text-center text-muted-foreground text-sm">
                  {currentMatchIndex + 1} of {quickMatchSession.matches?.length || 0} matches
                </div>
              </div>
            </motion.div>
          )}

          {/* Completion */}
          {quickMatchSession.currentStep === 3 && ((quickMatchSession.matches?.length || 0) === 0 || currentMatchIndex >= (quickMatchSession.matches?.length || 0) - 1) && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex h-full items-center justify-center p-6"
            >
              <div className="max-w-md text-center">
                <Target className="mx-auto mb-4 size-16 text-primary" />
                <h2 className="mb-2 font-bold text-2xl">
                  {savedMatches.size > 0 ? "Great selections!" : "All done!"}
                </h2>
                <p className="mb-6 text-muted-foreground">
                  {savedMatches.size > 0
                    ? `You saved ${savedMatches.size} matches. We'll help you apply to these opportunities.`
                    : "Try adjusting your preferences to see more matches."}
                </p>
                <div className="flex justify-center gap-3">
                  <button
                    onClick={() => {
                      setQuickMatchSession(prev => prev ? { ...prev, currentStep: 0 } : null);
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
      {quickMatchSession.currentStep === 3 && currentMatchIndex < (quickMatchSession.matches?.length || 0) - 1 && (
        <div className="border-t bg-card/50 px-6 py-2 backdrop-blur-sm">
          <div className="mx-auto flex max-w-5xl items-center justify-center gap-6 text-muted-foreground text-xs">
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
    'last-chance': { icon: Clock, text: 'Last Chance', class: 'bg-yellow-500/10 text-yellow-600' }
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
