'use client';

import { Button } from '@/components/ui/button';
import { useState, useRef } from 'react';
import type { OnboardingData } from '@/app/(auth)/onboarding/page';

interface ResumeUploadScreenProps {
  data: OnboardingData;
  onNext: () => void;
  onPrev: () => void;
  onUpdate: (updates: Partial<OnboardingData>) => void;
}

export function ResumeUploadScreen({ data, onNext, onPrev, onUpdate }: ResumeUploadScreenProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
    if (!allowedTypes.includes(file.type)) {
      setErrorMessage('Please upload a PDF or Word document');
      setUploadStatus('error');
      return;
    }

    // Validate file size (5MB limit)
    if (file.size > 5 * 1024 * 1024) {
      setErrorMessage('File size must be less than 5MB');
      setUploadStatus('error');
      return;
    }

    setIsUploading(true);
    setUploadStatus('idle');
    setErrorMessage('');

    try {
      const formData = new FormData();
      formData.append('resume', file);

      const response = await fetch('/api/onboarding/resume', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Failed to upload resume');
      }

      const result = await response.json();
      setUploadStatus('success');
      
      // Update onboarding data with resume info
      onUpdate({
        resume: {
          fileName: file.name,
          fileSize: file.size,
          uploadedAt: new Date().toISOString(),
          url: result.url,
        },
      });

      // Process the resume with LLM in the background
      try {
        const processResponse = await fetch('/api/onboarding/process-resume', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ resumeUrl: result.url }),
        });

        if (processResponse.ok) {
          const processResult = await processResponse.json();
          console.log('Resume processed successfully:', processResult);
        } else {
          const errorData = await processResponse.json();
          console.error('Failed to process resume:', errorData);
        }
      } catch (error) {
        console.error('Error processing resume:', error);
      }
    } catch (error) {
      console.error('Resume upload error:', error);
      setErrorMessage('Failed to upload resume. Please try again.');
      setUploadStatus('error');
    } finally {
      setIsUploading(false);
    }
  };

  const handleSkip = () => {
    onNext();
  };

  const isComplete = uploadStatus === 'success' || data.resume;

  return (
    <div className="flex flex-col gap-6 overflow-hidden rounded-2xl">
      <div className="flex flex-col items-center justify-center gap-4 px-4 text-center sm:px-16">
        <div className="flex items-center gap-2 mb-2">
          <div className="w-6 h-6 bg-red-600 flex items-center justify-center text-white text-xs font-bold shadow-sm border border-red-700 rounded-sm">
            人
          </div>
          <span className="font-sans font-semibold text-lg tracking-tight text-gray-900 dark:text-gray-100 uppercase">
            MILO
          </span>
        </div>
        <h3 className="font-semibold text-xl dark:text-zinc-50">Resume Upload</h3>
        <p className="text-muted-foreground text-sm dark:text-zinc-400">
          Upload your resume to get personalized career recommendations
        </p>
      </div>

      <div className="flex flex-col gap-4 px-4 sm:px-16">
        <div className="border-2 border-dashed border-input rounded-lg p-8 text-center">
          <input
            ref={fileInputRef}
            type="file"
            accept=".pdf,.doc,.docx"
            onChange={handleFileSelect}
            className="hidden"
            disabled={isUploading}
          />
          
          {uploadStatus === 'success' ? (
            <div className="space-y-2">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <p className="text-sm font-medium text-green-600">Resume uploaded successfully!</p>
              <p className="text-xs text-muted-foreground">{data.resume?.fileName}</p>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="w-12 h-12 bg-muted rounded-full flex items-center justify-center mx-auto">
                <svg className="w-6 h-6 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                </svg>
              </div>
              <div>
                <p className="text-sm font-medium">Upload your resume</p>
                <p className="text-xs text-muted-foreground">PDF or Word document, max 5MB</p>
              </div>
              <Button
                onClick={() => fileInputRef.current?.click()}
                disabled={isUploading}
                variant="outline"
              >
                {isUploading ? 'Uploading...' : 'Choose File'}
              </Button>
            </div>
          )}

          {uploadStatus === 'error' && (
            <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-md">
              <p className="text-sm text-red-600">{errorMessage}</p>
            </div>
          )}
        </div>

        <p className="text-xs text-muted-foreground text-center">
          Your resume helps us provide more accurate career matches and opportunities
        </p>
      </div>

      <div className="flex justify-between px-4 sm:px-16">
        <Button
          onClick={onPrev}
          variant="outline"
        >
          Back
        </Button>
        <div className="flex gap-2">
          <Button
            onClick={handleSkip}
            variant="outline"
          >
            Skip for Now
          </Button>
          <Button
            onClick={onNext}
            disabled={!isComplete}
          >
            Continue
          </Button>
        </div>
      </div>
    </div>
  );
}
