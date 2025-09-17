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
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
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
      <h3 className="text-lg font-semibold">Resume Analysis</h3>
      
      {/* Resume File Info */}
      {userData.resume && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Uploaded Resume</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-sm font-medium">{userData.resume.fileName}</p>
                <p className="text-xs text-muted-foreground">
                  {formatFileSize(userData.resume.fileSize)} • Uploaded {formatDate(userData.resume.uploadedAt)}
                </p>
              </div>
              <div className="flex gap-1">
                <Button
                  variant="outline"
                  size="sm"
                  className="h-7 px-2 text-xs"
                  onClick={() => window.open(userData.resume.url, '_blank')}
                >
                  <ExternalLink className="h-3 w-3 mr-1" />
                  View
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="h-7 px-2 text-xs"
                  onClick={() => {
                    const link = document.createElement('a');
                    link.href = userData.resume.url;
                    link.download = userData.resume.fileName;
                    link.click();
                  }}
                >
                  <Download className="h-3 w-3 mr-1" />
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
            <p className="text-xs text-muted-foreground">
              Generated on {userData.resumeData.processedAt ? formatDate(userData.resumeData.processedAt) : 'Unknown date'}
            </p>
          </CardHeader>
          <CardContent className="space-y-3">
            {userData.resumeData.userSummary.professionalSummary && (
              <div>
                <h4 className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-1">Professional Summary</h4>
                <p className="text-xs leading-relaxed">{userData.resumeData.userSummary.professionalSummary}</p>
              </div>
            )}
            
            {userData.resumeData.userSummary.keyStrengths && (
              <div>
                <h4 className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-1">Key Strengths</h4>
                <div className="flex flex-wrap gap-1">
                  {userData.resumeData.userSummary.keyStrengths.map((strength: string, index: number) => (
                    <Badge key={index} variant="secondary" className="text-xs">{strength}</Badge>
                  ))}
                </div>
              </div>
            )}
            
            {userData.resumeData.userSummary.careerFocus && (
              <div>
                <h4 className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-1">Career Focus</h4>
                <p className="text-xs">{userData.resumeData.userSummary.careerFocus}</p>
              </div>
            )}
            
            {userData.resumeData.userSummary.valueProposition && (
              <div>
                <h4 className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-1">Value Proposition</h4>
                <p className="text-xs leading-relaxed">{userData.resumeData.userSummary.valueProposition}</p>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Extracted Data */}
      {userData.resumeData?.extractedData && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
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
                    <div key={index} className="border-l-2 border-muted pl-4">
                      <h4 className="font-medium">{exp.title}</h4>
                      <p className="text-sm text-muted-foreground">{exp.company} • {exp.duration}</p>
                      <p className="text-sm mt-1">{exp.description}</p>
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
                      <p className="text-sm text-muted-foreground">{edu.institution} • {edu.year}</p>
                      {edu.gpa && <p className="text-sm text-muted-foreground">GPA: {edu.gpa}</p>}
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
                      <p className="text-sm mt-1">{project.description}</p>
                      {project.technologies && (
                        <div className="flex flex-wrap gap-1 mt-2">
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
                    <li key={index} className="text-sm flex items-start gap-2">
                      <span className="text-green-600 mt-1">•</span>
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
