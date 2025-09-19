'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Loader2, CheckCircle, AlertCircle, Sparkles, Zap, TrendingUp } from 'lucide-react';

interface SearchUpdate {
  type: 'progress' | 'complete' | 'error';
  status?: string;
  message: string;
  timestamp?: number;
  stats?: {
    totalResults: number;
    elapsed: number;
    sources: number;
  };
  partialResults?: any[];
  results?: any[];
}

interface IntelligentJobSearchProps {
  query: string;
  onResults?: (results: any[]) => void;
}

export function IntelligentJobSearch({ query, onResults }: IntelligentJobSearchProps) {
  const [searchUpdates, setSearchUpdates] = useState<SearchUpdate[]>([]);
  const [allResults, setAllResults] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [currentStatus, setCurrentStatus] = useState<string>('');

  const startSearch = useCallback(async () => {
    if (!query) return;

    setIsSearching(true);
    setSearchUpdates([]);
    setAllResults([]);
    setCurrentStatus('Initializing search...');

    const eventSource = new EventSource(
      `/api/jobs/stream?q=${encodeURIComponent(query)}`
    );

    eventSource.onmessage = (event) => {
      if (event.data === '[DONE]') {
        eventSource.close();
        setIsSearching(false);
        return;
      }

      try {
        const update: SearchUpdate = JSON.parse(event.data);

        // Update status
        setCurrentStatus(update.message);

        // Accumulate updates for display
        setSearchUpdates(prev => [...prev, update]);

        // Accumulate results
        if (update.partialResults && Array.isArray(update.partialResults)) {
          setAllResults(prev => [...prev, ...(update.partialResults as any[])]);
        }

        if (update.type === 'complete' && update.results) {
          setAllResults(update.results);
          onResults?.(update.results);
          setIsSearching(false);
        }
      } catch (error) {
        console.error('Error parsing search update:', error);
      }
    };

    eventSource.onerror = () => {
      eventSource.close();
      setIsSearching(false);
      setCurrentStatus('Search error occurred');
    };
  }, [query, onResults]);

  useEffect(() => {
    if (query) {
      startSearch();
    }
  }, [query, startSearch]);

  return (
    <div className="w-full space-y-4">
      {/* Search Progress Visualization */}
      <div className='rounded-xl bg-gradient-to-r from-blue-50 to-indigo-50 p-6 dark:from-gray-800 dark:to-gray-900'>
        <div className='mb-4 flex items-center justify-between'>
          <div className="flex items-center gap-2">
            <Sparkles className='h-5 w-5 text-blue-500' />
            <h3 className='font-semibold text-lg'>Intelligent Job Search</h3>
          </div>
          {isSearching && (
            <div className="flex items-center gap-2">
              <Loader2 className='h-4 w-4 animate-spin text-blue-500' />
              <span className='text-gray-600 text-sm dark:text-gray-400'>Searching...</span>
            </div>
          )}
        </div>

        {/* Current Status */}
        {currentStatus && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className='mb-4 rounded-lg bg-white p-3 shadow-sm dark:bg-gray-800'
          >
            <p className='font-medium text-gray-700 text-sm dark:text-gray-300'>
              {currentStatus}
            </p>
          </motion.div>
        )}

        {/* Search Timeline */}
        <div className="space-y-2">
          <AnimatePresence mode="popLayout">
            {searchUpdates.map((update, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.3 }}
                className={`flex items-start gap-3 rounded-lg p-3 transition-colors ${
                  update.type === 'complete'
                    ? 'bg-green-50 dark:bg-green-900/20'
                    : update.type === 'error'
                    ? 'bg-red-50 dark:bg-red-900/20'
                    : 'bg-white dark:bg-gray-800'
                }`}
              >
                {/* Status Icon */}
                <div className="mt-1">
                  {update.status === 'analyzing' && (
                    <Search className='h-4 w-4 text-blue-500' />
                  )}
                  {update.status === 'searching' && (
                    <Zap className='h-4 w-4 text-yellow-500' />
                  )}
                  {update.status === 'reading' && (
                    <TrendingUp className='h-4 w-4 text-purple-500' />
                  )}
                  {update.status === 'found' && (
                    <CheckCircle className='h-4 w-4 text-green-500' />
                  )}
                  {update.status === 'complete' && (
                    <CheckCircle className='h-4 w-4 text-green-600' />
                  )}
                  {update.type === 'error' && (
                    <AlertCircle className='h-4 w-4 text-red-500' />
                  )}
                </div>

                {/* Update Content */}
                <div className="flex-1">
                  <p className='text-gray-700 text-sm dark:text-gray-300'>
                    {update.message}
                  </p>
                  {update.stats && (
                    <div className='mt-1 flex gap-3 text-gray-500 text-xs dark:text-gray-400'>
                      <span>{update.stats.totalResults} results</span>
                      <span>{update.stats.elapsed}ms</span>
                      <span>{update.stats.sources} sources</span>
                    </div>
                  )}
                </div>

                {/* Timestamp */}
                {update.timestamp && (
                  <span className='text-gray-400 text-xs dark:text-gray-500'>
                    {new Date(update.timestamp).toLocaleTimeString()}
                  </span>
                )}
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* Results Preview */}
        {allResults.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className='mt-4 rounded-lg bg-white p-4 dark:bg-gray-800'
          >
            <div className='mb-2 flex items-center justify-between'>
              <h4 className='font-semibold text-gray-700 text-sm dark:text-gray-300'>
                Live Results
              </h4>
              <span className='text-gray-500 text-xs'>
                {allResults.length} positions found
              </span>
            </div>

            {/* Mini Results List */}
            <div className='max-h-40 space-y-1 overflow-y-auto'>
              {allResults.slice(0, 5).map((job, idx) => (
                <motion.div
                  key={job.id || idx}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: idx * 0.05 }}
                  className="flex items-center justify-between py-1 text-xs"
                >
                  <div className="flex-1">
                    <span className="font-medium text-gray-700 dark:text-gray-300">
                      {job.title}
                    </span>
                    <span className='ml-2 text-gray-500 dark:text-gray-400'>
                      at {job.company}
                    </span>
                  </div>
                  <span className="text-gray-400 dark:text-gray-500">
                    {job.source}
                  </span>
                </motion.div>
              ))}
            </div>

            {allResults.length > 5 && (
              <p className='mt-2 text-center text-gray-500 text-xs'>
                +{allResults.length - 5} more results
              </p>
            )}
          </motion.div>
        )}
      </div>

      {/* Performance Metrics */}
      {!isSearching && searchUpdates.length > 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="grid grid-cols-3 gap-4"
        >
          <div className='rounded-lg bg-white p-4 text-center dark:bg-gray-800'>
            <p className='font-bold text-2xl text-blue-600 dark:text-blue-400'>
              {allResults.length}
            </p>
            <p className='text-gray-500 text-xs dark:text-gray-400'>Total Jobs</p>
          </div>
          <div className='rounded-lg bg-white p-4 text-center dark:bg-gray-800'>
            <p className='font-bold text-2xl text-green-600 dark:text-green-400'>
              {searchUpdates.find(u => u.stats)?.stats?.sources || 0}
            </p>
            <p className='text-gray-500 text-xs dark:text-gray-400'>Sources</p>
          </div>
          <div className='rounded-lg bg-white p-4 text-center dark:bg-gray-800'>
            <p className='font-bold text-2xl text-purple-600 dark:text-purple-400'>
              {(() => {
                const completeUpdate = searchUpdates.find(u => u.type === 'complete');
                const elapsed = completeUpdate?.stats?.elapsed;
                return elapsed ? `${(elapsed / 1000).toFixed(1)}s` : '---';
              })()}
            </p>
            <p className='text-gray-500 text-xs dark:text-gray-400'>Search Time</p>
          </div>
        </motion.div>
      )}
    </div>
  );
}

// Simplified job card component
export function StreamingJobCard({ job, delay = 0 }: { job: any; delay?: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      className='rounded-lg bg-white p-4 shadow-sm transition-shadow hover:shadow-md dark:bg-gray-800'
    >
      <div className='flex items-start justify-between'>
        <div className="flex-1">
          <h3 className="font-semibold text-gray-900 dark:text-gray-100">
            {job.title}
          </h3>
          <p className='text-gray-600 text-sm dark:text-gray-400'>
            {job.company} • {job.location}
          </p>
          {job.salary && (
            <p className='mt-1 text-green-600 text-sm dark:text-green-400'>
              {job.salary}
            </p>
          )}
          <p className='mt-2 line-clamp-2 text-gray-500 text-sm dark:text-gray-400'>
            {job.description}
          </p>
        </div>
        <div className='ml-4 text-gray-400 text-xs'>
          {job.source}
        </div>
      </div>
      {job.matchScore && (
        <div className="mt-3 flex items-center gap-2">
          <div className='h-2 flex-1 rounded-full bg-gray-200 dark:bg-gray-700'>
            <div
              className='h-2 rounded-full bg-gradient-to-r from-blue-500 to-purple-500'
              style={{ width: `${job.matchScore}%` }}
            />
          </div>
          <span className='text-gray-500 text-xs'>{job.matchScore}% match</span>
        </div>
      )}
    </motion.div>
  );
}