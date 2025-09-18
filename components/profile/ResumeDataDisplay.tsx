'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ExternalLink, Download } from 'lucide-react';

interface ResumeDataDisplayProps {
  userData: {
    resume?: {
      fileName: string;
      fileSize: number;
      uploadedAt: string;
      url: string;
    };
    resumeData?: {
      extractedData?: any;
      userSummary?: any;
      processedAt?: string;
    };
  };
}

export function ResumeDataDisplay({ userData }: ResumeDataDisplayProps) {
  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="space-y-4">
      <h3 className='font-semibold text-lg'>Resume Analysis</h3>
      
      {/* Resume File Info */}
      {userData.resume && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Uploaded Resume</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <p className='font-medium text-sm'>{userData.resume.fileName}</p>
                <p className='text-muted-foreground text-xs'>
                  {formatFileSize(userData.resume.fileSize)} • Uploaded {formatDate(userData.resume.uploadedAt)}
                </p>
              </div>
              <div className="flex gap-1">
                <Button
                  variant="outline"
                  size="sm"
                  className="h-7 px-2 text-xs"
                  onClick={() => userData.resume?.url && window.open(userData.resume.url, '_blank')}
                >
                  <ExternalLink className='mr-1 h-3 w-3' />
                  View
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="h-7 px-2 text-xs"
                  onClick={() => {
                    if (userData.resume?.url) {
                      const link = document.createElement('a');
                      link.href = userData.resume.url;
                      link.download = userData.resume.fileName || 'resume';
                      link.click();
                    }
                  }}
                >
                  <Download className='mr-1 h-3 w-3' />
                  Download
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* AI-Generated Summary */}
      {userData.resumeData?.userSummary && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">AI-Generated Professional Summary</CardTitle>
            <p className='text-muted-foreground text-xs'>
              Generated on {userData.resumeData.processedAt ? formatDate(userData.resumeData.processedAt) : 'Unknown date'}
            </p>
          </CardHeader>
          <CardContent className="space-y-3">
            {userData.resumeData.userSummary.professionalSummary && (
              <div>
                <h4 className='mb-1 font-medium text-muted-foreground text-xs uppercase tracking-wide'>Professional Summary</h4>
                <p className="text-xs leading-relaxed">{userData.resumeData.userSummary.professionalSummary}</p>
              </div>
            )}
            
            {userData.resumeData.userSummary.keyStrengths && (
              <div>
                <h4 className='mb-1 font-medium text-muted-foreground text-xs uppercase tracking-wide'>Key Strengths</h4>
                <div className="flex flex-wrap gap-1">
                  {userData.resumeData.userSummary.keyStrengths.map((strength: string, index: number) => (
                    <Badge key={index} variant="secondary" className="text-xs">{strength}</Badge>
                  ))}
                </div>
              </div>
            )}
            
            {userData.resumeData.userSummary.careerFocus && (
              <div>
                <h4 className='mb-1 font-medium text-muted-foreground text-xs uppercase tracking-wide'>Career Focus</h4>
                <p className="text-xs">{userData.resumeData.userSummary.careerFocus}</p>
              </div>
            )}
            
            {userData.resumeData.userSummary.valueProposition && (
              <div>
                <h4 className='mb-1 font-medium text-muted-foreground text-xs uppercase tracking-wide'>Value Proposition</h4>
                <p className="text-xs leading-relaxed">{userData.resumeData.userSummary.valueProposition}</p>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Extracted Data */}
      {userData.resumeData?.extractedData && (
        <div className='grid grid-cols-1 gap-6 lg:grid-cols-2'>
          {/* Skills */}
          {userData.resumeData.extractedData.skills && (
            <Card>
              <CardHeader>
                <CardTitle>Skills</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {userData.resumeData.extractedData.skills.map((skill: string, index: number) => (
                    <Badge key={index} variant="outline">{skill}</Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Experience */}
          {userData.resumeData.extractedData.experience && (
            <Card>
              <CardHeader>
                <CardTitle>Work Experience</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {userData.resumeData.extractedData.experience.map((exp: any, index: number) => (
                    <div key={index} className='border-muted border-l-2 pl-4'>
                      <h4 className="font-medium">{exp.title}</h4>
                      <p className='text-muted-foreground text-sm'>{exp.company} • {exp.duration}</p>
                      <p className='mt-1 text-sm'>{exp.description}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Education */}
          {userData.resumeData.extractedData.education && (
            <Card>
              <CardHeader>
                <CardTitle>Education</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {userData.resumeData.extractedData.education.map((edu: any, index: number) => (
                    <div key={index}>
                      <h4 className="font-medium">{edu.degree}</h4>
                      <p className='text-muted-foreground text-sm'>{edu.institution} • {edu.year}</p>
                      {edu.gpa && <p className='text-muted-foreground text-sm'>GPA: {edu.gpa}</p>}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Projects */}
          {userData.resumeData.extractedData.projects && (
            <Card>
              <CardHeader>
                <CardTitle>Notable Projects</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {userData.resumeData.extractedData.projects.map((project: any, index: number) => (
                    <div key={index}>
                      <h4 className="font-medium">{project.name}</h4>
                      <p className='mt-1 text-sm'>{project.description}</p>
                      {project.technologies && (
                        <div className='mt-2 flex flex-wrap gap-1'>
                          {project.technologies.map((tech: string, techIndex: number) => (
                            <Badge key={techIndex} variant="outline" className="text-xs">{tech}</Badge>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Achievements */}
          {userData.resumeData.extractedData.achievements && (
            <Card>
              <CardHeader>
                <CardTitle>Achievements</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {userData.resumeData.extractedData.achievements.map((achievement: string, index: number) => (
                    <li key={index} className='flex items-start gap-2 text-sm'>
                      <span className='mt-1 text-green-600'>•</span>
                      <span>{achievement}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          )}

          {/* Interests */}
          {userData.resumeData.extractedData.interests && (
            <Card>
              <CardHeader>
                <CardTitle>Professional Interests</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {userData.resumeData.extractedData.interests.map((interest: string, index: number) => (
                    <Badge key={index} variant="secondary">{interest}</Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      )}
    </div>
  );
}
