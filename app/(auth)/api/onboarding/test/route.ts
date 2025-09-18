import { type NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  return NextResponse.json({
    message: 'Resume API is working',
    endpoints: {
      process: '/api/onboarding/process-resume',
      test: '/api/onboarding/test',
    },
    supportedFormats: ['PDF', 'DOCX', 'TXT'],
    maxFileSize: '10MB',
  });
}
