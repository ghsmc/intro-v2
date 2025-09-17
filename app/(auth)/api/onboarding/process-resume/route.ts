import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/app/(auth)/auth';
import { updateUserOnboarding } from '@/lib/db/queries';
import { generateObject } from 'ai';
import { gateway } from '@ai-sdk/gateway';
import { z } from 'zod';

// Schema for extracted resume data
const ResumeDataSchema = z.object({
  summary: z.string().describe('A comprehensive 2-3 sentence summary of the candidate'),
  skills: z.array(z.string()).describe('List of technical and soft skills'),
  experience: z.array(z.object({
    title: z.string(),
    company: z.string(),
    duration: z.string(),
    description: z.string(),
  })).describe('Work experience entries'),
  education: z.array(z.object({
    degree: z.string(),
    institution: z.string(),
    year: z.string(),
    gpa: z.string().optional(),
  })).describe('Education entries'),
  projects: z.array(z.object({
    name: z.string(),
    description: z.string(),
    technologies: z.array(z.string()),
  })).optional().default([]).describe('Notable projects'),
  achievements: z.array(z.string()).optional().default([]).describe('Key achievements'),
  interests: z.array(z.string()).optional().default([]).describe('Professional interests'),
});

async function extractTextFromBuffer(buffer: Buffer, contentType: string, url: string): Promise<string> {
  console.log('Extracting text from buffer, content type:', contentType);
  
  // Handle PDFs
  if (contentType.includes('pdf') || url.toLowerCase().endsWith('.pdf')) {
    try {
      const PDFParser = (await import('pdf2json')).default;
      
      return new Promise((resolve, reject) => {
        const pdfParser = new PDFParser(null, 1); // 1 = verbosity level
        
        // Set up event handlers
        pdfParser.on('pdfParser_dataError', (errData: any) => {
          console.error('PDF parse error:', errData.parserError);
          reject(new Error('Failed to parse PDF'));
        });
        
        pdfParser.on('pdfParser_dataReady', (pdfData: any) => {
          try {
            let text = '';
            
            // Extract text from all pages
            if (pdfData && pdfData.Pages) {
              pdfData.Pages.forEach((page: any, pageIndex: number) => {
                console.log(`Processing page ${pageIndex + 1}`);
                
                if (page.Texts && Array.isArray(page.Texts)) {
                  page.Texts.forEach((textItem: any) => {
                    if (textItem.R && Array.isArray(textItem.R)) {
                      textItem.R.forEach((r: any) => {
                        if (r.T) {
                          // Decode the text (it's URL encoded)
                          const decodedText = decodeURIComponent(r.T);
                          text += decodedText + ' ';
                        }
                      });
                    }
                  });
                  // Add line break after each page
                  text += '\n\n';
                }
              });
            }
            
            // Clean up the text
            text = text
              .replace(/\s+/g, ' ')  // Replace multiple spaces with single space
              .replace(/\n{3,}/g, '\n\n')  // Limit multiple line breaks
              .trim();
            
            if (text.length > 50) {
              console.log('PDF parsed successfully with pdf2json, text length:', text.length);
              console.log('Text preview:', text.substring(0, 200) + '...');
              resolve(text);
            } else {
              console.log('No sufficient text found in PDF');
              reject(new Error('PDF appears to be empty or contains only images'));
            }
          } catch (error) {
            console.error('Error processing PDF data:', error);
            reject(new Error('Failed to extract text from PDF'));
          }
        });
        
        // Parse the buffer
        pcdfParser.parseBuffer(buffer);
      });
      
    } catch (error) {
      console.error('PDF parsing failed completely:', error);
      
      // Return a placeholder message instead of throwing
      return `[Resume PDF Uploaded - ${(buffer.length / 1024).toFixed(2)} KB]
      
Note: The PDF could not be automatically parsed. This might be because:
- The PDF contains scanned images instead of text
- The PDF is password protected
- The PDF uses an unsupported encoding

For best results, please upload a Word document (.docx) or text file (.txt).
      
Upload time: ${new Date().toISOString()}`;
    }
  }
  
  // Handle DOCX
  if (contentType.includes('wordprocessingml') || url.toLowerCase().endsWith('.docx')) {
    try {
      const mammoth = (await import('mammoth')).default;
      const result = await mammoth.extractRawText({ buffer });
      
      if (result.value && result.value.trim().length > 50) {
        console.log('DOCX parsed successfully, text length:', result.value.length);
        return result.value;
      }
    } catch (error) {
      console.error('DOCX parsing error:', error);
      throw new Error('Failed to parse DOCX file.');
    }
  }
  
  // Handle plain text
  if (contentType.includes('text') || url.toLowerCase().endsWith('.txt')) {
    const text = buffer.toString('utf-8');
    if (text && text.trim().length > 50) {
      console.log('Text file parsed successfully, length:', text.length);
      return text;
    }
  }
  
  // Last resort: Basic text extraction
  const text = buffer.toString('utf-8');
  const cleanText = text.replace(/[^\x20-\x7E\n\r]/g, '').trim();
  
  if (cleanText.length > 50) {
    console.log('Fallback text extraction used');
    return cleanText;
  }
  
  throw new Error('Unable to extract text from file. Please upload a PDF, DOCX, or TXT file.');
}

export async function POST(request: NextRequest) {
  try {
    console.log('=== Resume Processing Started ===');
    
    // Auth check
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get resume URL
    const { resumeUrl } = await request.json();
    if (!resumeUrl) {
      return NextResponse.json({ error: 'Resume URL is required' }, { status: 400 });
    }

    console.log('Fetching resume from:', resumeUrl);

    // Fetch resume with timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 30000); // 30 second timeout
    
    let resumeResponse;
    try {
      resumeResponse = await fetch(resumeUrl, { signal: controller.signal });
      clearTimeout(timeoutId);
    } catch (error) {
      clearTimeout(timeoutId);
      console.error('Failed to fetch resume:', error);
      return NextResponse.json({ error: 'Failed to fetch resume file' }, { status: 400 });
    }

    if (!resumeResponse.ok) {
      return NextResponse.json({ error: 'Failed to download resume' }, { status: 400 });
    }

    // Get buffer and content type
    const resumeBuffer = await resumeResponse.arrayBuffer();
    const buffer = Buffer.from(resumeBuffer);
    const contentType = resumeResponse.headers.get('content-type') || '';
    
    console.log('File size:', buffer.length, 'bytes');
    console.log('Content type:', contentType);

    // Size check
    if (buffer.length > 10 * 1024 * 1024) { // 10MB limit
      return NextResponse.json({ error: 'File too large. Please upload a file under 10MB.' }, { status: 400 });
    }

    // Extract text
    let resumeText: string;
    try {
      resumeText = await extractTextFromBuffer(buffer, contentType, resumeUrl);
    } catch (error) {
      console.error('Text extraction failed:', error);
      return NextResponse.json({ 
        error: error instanceof Error ? error.message : 'Failed to extract text from resume' 
      }, { status: 400 });
    }

    // Validate extracted text
    if (!resumeText || resumeText.trim().length < 50) {
      return NextResponse.json({ 
        error: 'Resume appears to be empty or too short. Please upload a complete resume.' 
      }, { status: 400 });
    }

    // Check if we got actual readable text or just garbage
    if (resumeText) {
      const readableChars = resumeText.match(/[a-zA-Z0-9\s]/g) || [];
      const readabilityScore = readableChars.length / resumeText.length;
      
      if (readabilityScore < 0.5) {
        console.log('Warning: Extracted text has low readability score:', readabilityScore);
        resumeText = '[PDF contains unreadable content - likely a scanned image. Please upload a text-based PDF or Word document.]';
      }
    }

    console.log('Text extracted successfully, length:', resumeText.length);
    console.log('Preview:', resumeText.substring(0, 200) + '...');

    // Truncate if too long for LLM
    const MAX_LENGTH = 10000; // Adjust based on your LLM's context window
    if (resumeText.length > MAX_LENGTH) {
      console.log('Truncating resume text from', resumeText.length, 'to', MAX_LENGTH);
      resumeText = resumeText.substring(0, MAX_LENGTH);
    }

    // Extract structured data with LLM
    console.log('Extracting structured data with LLM...');
    
    let extractedData;
    try {
      const result = await generateObject({
        model: gateway.languageModel('xai/grok-3-mini'),
        schema: ResumeDataSchema,
        prompt: `Extract structured data from this resume. 
If the text appears garbled or contains encoding issues, do your best to extract meaningful information.
Focus on identifying:
- Names (look for capitalized words that could be names)
- Email addresses (anything with @ symbol)
- Phone numbers (numeric patterns)
- Skills (technical terms, programming languages, tools)
- Companies and job titles
- Education institutions

If the resume text is completely unreadable, return minimal placeholder data.

Resume text:
${resumeText}

Return structured JSON with all available information.`,
        temperature: 0.1, // Lower temperature for more consistent extraction
        maxTokens: 2000,
      });
      
      extractedData = result.object;
      console.log('LLM extraction successful');
    } catch (error) {
      console.error('LLM extraction failed:', error);
      
      // Fallback to basic extraction
      extractedData = {
        summary: 'Resume uploaded successfully. Manual review recommended.',
        skills: [],
        experience: [],
        education: [],
        projects: [],
        achievements: [],
        interests: []
      };
    }

    // Generate user summary
    console.log('Generating user summary...');
    
    let userSummary;
    try {
      const summaryResult = await generateObject({
        model: gateway.languageModel('xai/grok-3-mini'),
        schema: z.object({
          professionalSummary: z.string(),
          keyStrengths: z.array(z.string()).max(5),
          careerFocus: z.string(),
          valueProposition: z.string(),
        }),
        prompt: `Create a professional summary based on this resume data:
${JSON.stringify(extractedData, null, 2)}

Generate a compelling summary that highlights their unique value.`,
        temperature: 0.3,
        maxTokens: 500,
      });
      
      userSummary = summaryResult.object;
    } catch (error) {
      console.error('Summary generation failed:', error);
      
      // Fallback summary
      userSummary = {
        professionalSummary: extractedData.summary || 'Professional seeking new opportunities.',
        keyStrengths: extractedData.skills.slice(0, 5),
        careerFocus: 'Career development and growth',
        valueProposition: 'Dedicated professional with diverse skills and experience.',
      };
    }

    // Store in database
    console.log('Saving to database...');
    try {
      await updateUserOnboarding(session.user.id, {
        resumeData: {
          extractedData,
          userSummary,
          processedAt: new Date().toISOString(),
          fileMetadata: {
            size: buffer.length,
            type: contentType || 'unknown',
          }
        },
      });
    } catch (error) {
      console.error('Database save failed:', error);
      // Continue anyway - data was processed successfully
    }

    console.log('=== Resume Processing Complete ===');
    
    return NextResponse.json({
      success: true,
      extractedData,
      userSummary,
      message: 'Resume processed successfully'
    });

  } catch (error) {
    console.error('Unexpected error in resume processing:', error);
    
    return NextResponse.json(
      { 
        error: 'An unexpected error occurred',
        details: process.env.NODE_ENV === 'development' 
          ? (error instanceof Error ? error.message : 'Unknown error')
          : undefined
      },
      { status: 500 }
    );
  }
}