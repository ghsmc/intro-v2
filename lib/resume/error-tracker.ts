export class ResumeProcessingError extends Error {
  constructor(
    message: string,
    public code: string,
    public details?: any
  ) {
    super(message);
    this.name = 'ResumeProcessingError';
  }
}

export function trackResumeError(error: any, context: any) {
  console.error('Resume Processing Error:', {
    error: error instanceof Error ? {
      message: error.message,
      stack: error.stack,
      name: error.name,
    } : error,
    context,
    timestamp: new Date().toISOString(),
  });
  
  // Add your error tracking service here (Sentry, etc.)
}
