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
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-gray-800 dark:to-gray-900 rounded-xl p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-blue-500" />
            <h3 className="text-lg font-semibold">Intelligent Job Search</h3>
          </div>
          {isSearching && (
            <div className="flex items-center gap-2">
              <Loader2 className="w-4 h-4 animate-spin text-blue-500" />
              <span className="text-sm text-gray-600 dark:text-gray-400">Searching...</span>
            </div>
          )}
        </div>

        {/* Current Status */}
        {currentStatus && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-4 p-3 bg-white dark:bg-gray-800 rounded-lg shadow-sm"
          >
            <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
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
                className={`flex items-start gap-3 p-3 rounded-lg transition-colors ${
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
                    <Search className="w-4 h-4 text-blue-500" />
                  )}
                  {update.status === 'searching' && (
                    <Zap className="w-4 h-4 text-yellow-500" />
                  )}
                  {update.status === 'reading' && (
                    <TrendingUp className="w-4 h-4 text-purple-500" />
                  )}
                  {update.status === 'found' && (
                    <CheckCircle className="w-4 h-4 text-green-500" />
                  )}
                  {update.status === 'complete' && (
                    <CheckCircle className="w-4 h-4 text-green-600" />
                  )}
                  {update.type === 'error' && (
                    <AlertCircle className="w-4 h-4 text-red-500" />
                  )}
                </div>

                {/* Update Content */}
                <div className="flex-1">
                  <p className="text-sm text-gray-700 dark:text-gray-300">
                    {update.message}
                  </p>
                  {update.stats && (
                    <div className="mt-1 flex gap-3 text-xs text-gray-500 dark:text-gray-400">
                      <span>{update.stats.totalResults} results</span>
                      <span>{update.stats.elapsed}ms</span>
                      <span>{update.stats.sources} sources</span>
                    </div>
                  )}
                </div>

                {/* Timestamp */}
                {update.timestamp && (
                  <span className="text-xs text-gray-400 dark:text-gray-500">
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
            className="mt-4 p-4 bg-white dark:bg-gray-800 rounded-lg"
          >
            <div className="flex items-center justify-between mb-2">
              <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                Live Results
              </h4>
              <span className="text-xs text-gray-500">
                {allResults.length} positions found
              </span>
            </div>

            {/* Mini Results List */}
            <div className="space-y-1 max-h-40 overflow-y-auto">
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
                    <span className="text-gray-500 dark:text-gray-400 ml-2">
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
              <p className="mt-2 text-xs text-gray-500 text-center">
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
          <div className="bg-white dark:bg-gray-800 rounded-lg p-4 text-center">
            <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
              {allResults.length}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400">Total Jobs</p>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-lg p-4 text-center">
            <p className="text-2xl font-bold text-green-600 dark:text-green-400">
              {searchUpdates.find(u => u.stats)?.stats?.sources || 0}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400">Sources</p>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-lg p-4 text-center">
            <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">
              {searchUpdates.find(u => u.type === 'complete')?.stats?.elapsed
                ? `${(searchUpdates.find(u => u.type === 'complete')!.stats!.elapsed / 1000).toFixed(1)}s`
                : '---'}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400">Search Time</p>
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
      className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4 hover:shadow-md transition-shadow"
    >
      <div className="flex justify-between items-start">
        <div className="flex-1">
          <h3 className="font-semibold text-gray-900 dark:text-gray-100">
            {job.title}
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            {job.company} • {job.location}
          </p>
          {job.salary && (
            <p className="text-sm text-green-600 dark:text-green-400 mt-1">
              {job.salary}
            </p>
          )}
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-2 line-clamp-2">
            {job.description}
          </p>
        </div>
        <div className="ml-4 text-xs text-gray-400">
          {job.source}
        </div>
      </div>
      {job.matchScore && (
        <div className="mt-3 flex items-center gap-2">
          <div className="flex-1 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
            <div
              className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full"
              style={{ width: `${job.matchScore}%` }}
            />
          </div>
          <span className="text-xs text-gray-500">{job.matchScore}% match</span>
        </div>
      )}
    </motion.div>
  );
}