'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface UserProfileProps {
  userData: {
    name?: string;
    email: string;
    classYear?: string;
    major?: string;
  };
}

export function UserProfile({ userData }: UserProfileProps) {
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg">Basic Information</CardTitle>
      </CardHeader>
      <CardContent>
        <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
          <div className="space-y-3">
            <div>
              <label className='font-medium text-muted-foreground text-xs uppercase tracking-wide'>Name</label>
              <p className='font-medium text-sm'>{userData.name || 'Not provided'}</p>
            </div>
            <div>
              <label className='font-medium text-muted-foreground text-xs uppercase tracking-wide'>Email</label>
              <p className="text-sm">{userData.email}</p>
            </div>
          </div>
          <div className="space-y-3">
            <div>
              <label className='font-medium text-muted-foreground text-xs uppercase tracking-wide'>Class Year</label>
              <p className='font-medium text-sm'>
                {userData.classYear ? `Class of ${userData.classYear}` : 'Not provided'}
              </p>
            </div>
            <div>
              <label className='font-medium text-muted-foreground text-xs uppercase tracking-wide'>Major</label>
              <p className='font-medium text-sm'>{userData.major || 'Not provided'}</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
