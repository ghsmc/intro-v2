'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { 
  Search, 
  Brain, 
  Zap, 
  Target, 
  Database, 
  CheckCircle, 
  Loader2, 
  AlertCircle,
  Globe,
  Building,
  Users,
  TrendingUp
} from 'lucide-react';

interface SearchStep {
  step: string;
  status: 'pending' | 'processing' | 'completed' | 'error';
  details: string;
  duration?: number;
  resultsCount?: number;
  icon?: React.ReactNode;
}

interface JobSearchLoaderProps {
  isVisible: boolean;
  steps: SearchStep[];
  currentStep: number;
  totalDuration: number;
  companiesSearched: number;
  totalFound: number;
  isDark?: boolean;
}

const LOADING_PHRASES = [
  "🔍 Scanning company career pages for relevant opportunities...",
  "🧠 Analyzing job requirements against your profile...",
  "⚡ Identifying high-potential matches in real-time...",
  "🎯 Cross-referencing with our company database...",
  "📊 Calculating compatibility scores for each role...",
  "🚀 Prioritizing opportunities by match quality...",
  "💎 Filtering for roles that align with your values...",
  "🎨 Personalizing job descriptions for your interests...",
  "📈 Evaluating growth potential and company trajectory...",
  "✨ Finalizing your personalized career recommendations..."
];

export function JobSearchLoader({ 
  isVisible, 
  steps, 
  currentStep, 
  totalDuration, 
  companiesSearched, 
  totalFound,
  isDark = false 
}: JobSearchLoaderProps) {
  const [currentPhrase, setCurrentPhrase] = useState(0);
  const [dots, setDots] = useState('');

  // Rotate through loading phrases
  useEffect(() => {
    if (!isVisible) return;

    const phraseInterval = setInterval(() => {
      setCurrentPhrase(prev => (prev + 1) % LOADING_PHRASES.length);
    }, 2000);

    const dotsInterval = setInterval(() => {
      setDots(prev => {
        if (prev === '...') return '';
        return prev + '.';
      });
    }, 500);

    return () => {
      clearInterval(phraseInterval);
      clearInterval(dotsInterval);
    };
  }, [isVisible]);

  if (!isVisible) return null;

  const getStepIcon = (step: SearchStep, index: number) => {
    if (step.status === 'completed') {
      return <CheckCircle className="h-5 w-5 text-green-600" />;
    }
    if (step.status === 'processing') {
      return <Loader2 className="h-5 w-5 animate-spin text-blue-600" />;
    }
    if (step.status === 'error') {
      return <AlertCircle className="h-5 w-5 text-red-600" />;
    }
    
    // Default icons for pending steps
    const icons = [
      <Search className="h-5 w-5 text-gray-400" />,
      <Brain className="h-5 w-5 text-gray-400" />,
      <Zap className="h-5 w-5 text-gray-400" />,
      <Target className="h-5 w-5 text-gray-400" />,
      <Database className="h-5 w-5 text-gray-400" />,
    ];
    
    return icons[index % icons.length];
  };

  const getStepColor = (status: string) => {
    switch (status) {
      case 'completed': return 'text-green-600';
      case 'processing': return 'text-blue-600';
      case 'error': return 'text-red-600';
      default: return 'text-gray-400';
    }
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
          className="space-y-6"
        >
          {/* Main Loading Card */}
          <Card className={`
            ${isDark ? 'bg-gray-900/50 border-white/10' : 'bg-white border-gray-200'}
            shadow-lg
          `}>
            <CardHeader>
              <CardTitle className="flex items-center gap-3">
                <div className="relative">
                  <Search className="h-6 w-6 text-blue-600" />
                  <motion.div
                    className="absolute -top-1 -right-1"
                    animate={{ rotate: 360 }}
                    transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                  >
                    <Zap className="h-4 w-4 text-yellow-500" />
                  </motion.div>
                </div>
                <div>
                  <div className="text-lg font-semibold">AI Job Search in Progress</div>
                  <div className="text-sm text-muted-foreground">
                    {LOADING_PHRASES[currentPhrase]}{dots}
                  </div>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Progress Bar */}
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Search Progress</span>
                  <span className="font-medium">{Math.round((currentStep / steps.length) * 100)}%</span>
                </div>
                <Progress 
                  value={(currentStep / steps.length) * 100} 
                  className="h-2"
                />
              </div>

              {/* Real-time Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className={`
                  text-center p-3 rounded-lg
                  ${isDark ? 'bg-white/5' : 'bg-gray-50'}
                `}>
                  <Building className="h-5 w-5 mx-auto mb-1 text-blue-600" />
                  <div className="text-lg font-bold">{companiesSearched}</div>
                  <div className="text-xs text-muted-foreground">Companies</div>
                </div>
                <div className={`
                  text-center p-3 rounded-lg
                  ${isDark ? 'bg-white/5' : 'bg-gray-50'}
                `}>
                  <Users className="h-5 w-5 mx-auto mb-1 text-green-600" />
                  <div className="text-lg font-bold">{totalFound}</div>
                  <div className="text-xs text-muted-foreground">Jobs Found</div>
                </div>
                <div className={`
                  text-center p-3 rounded-lg
                  ${isDark ? 'bg-white/5' : 'bg-gray-50'}
                `}>
                  <TrendingUp className="h-5 w-5 mx-auto mb-1 text-purple-600" />
                  <div className="text-lg font-bold">{Math.round(totalDuration / 1000)}s</div>
                  <div className="text-xs text-muted-foreground">Duration</div>
                </div>
                <div className={`
                  text-center p-3 rounded-lg
                  ${isDark ? 'bg-white/5' : 'bg-gray-50'}
                `}>
                  <Globe className="h-5 w-5 mx-auto mb-1 text-orange-600" />
                  <div className="text-lg font-bold">Live</div>
                  <div className="text-xs text-muted-foreground">Search</div>
                </div>
              </div>

              {/* Processing Steps */}
              <div className="space-y-3">
                <h4 className="font-semibold text-sm text-muted-foreground">Processing Steps</h4>
                <div className="space-y-2">
                  {steps.map((step, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.1 }}
                      className={`
                        flex items-center gap-3 p-3 rounded-lg transition-colors
                        ${step.status === 'processing' 
                          ? isDark ? 'bg-blue-500/10 border border-blue-500/20' : 'bg-blue-50 border border-blue-200'
                          : step.status === 'completed'
                          ? isDark ? 'bg-green-500/10 border border-green-500/20' : 'bg-green-50 border border-green-200'
                          : step.status === 'error'
                          ? isDark ? 'bg-red-500/10 border border-red-500/20' : 'bg-red-50 border border-red-200'
                          : isDark ? 'bg-white/5' : 'bg-gray-50'
                        }
                      `}
                    >
                      <div className="flex-shrink-0">
                        {getStepIcon(step, index)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <span className={`
                            font-medium text-sm
                            ${getStepColor(step.status)}
                          `}>
                            {step.step}
                          </span>
                          {step.duration && (
                            <span className="text-xs text-muted-foreground">
                              {step.duration}ms
                            </span>
                          )}
                        </div>
                        <div className="text-xs text-muted-foreground mt-1">
                          {step.details}
                        </div>
                        {step.resultsCount !== undefined && (
                          <div className="mt-1">
                            <Badge variant="outline" className="text-xs">
                              {step.resultsCount} results
                            </Badge>
                          </div>
                        )}
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* AI Insights */}
              <div className={`
                p-4 rounded-lg border
                ${isDark ? 'bg-blue-500/5 border-blue-500/20' : 'bg-blue-50 border-blue-200'}
              `}>
                <div className="flex items-start gap-3">
                  <Brain className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <h5 className="font-semibold text-sm text-blue-900 dark:text-blue-100">
                      AI Analysis in Progress
                    </h5>
                    <p className="text-xs text-blue-700 dark:text-blue-300 mt-1">
                      Our AI is analyzing job descriptions, company cultures, and your profile 
                      to find the perfect matches. This includes evaluating growth potential, 
                      team dynamics, and career trajectory alignment.
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Floating Animation */}
          <motion.div
            className="fixed bottom-6 right-6 z-50"
            animate={{ 
              y: [0, -10, 0],
              scale: [1, 1.05, 1]
            }}
            transition={{ 
              duration: 2, 
              repeat: Infinity, 
              ease: "easeInOut" 
            }}
          >
            <div className={`
              p-3 rounded-full shadow-lg
              ${isDark ? 'bg-gray-800 border border-white/20' : 'bg-white border border-gray-200'}
            `}>
              <Loader2 className="h-6 w-6 animate-spin text-blue-600" />
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
