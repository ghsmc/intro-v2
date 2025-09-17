'use client';

import { DomainProvider } from '@/components/domain-provider';
import { SessionProvider } from 'next-auth/react';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <DomainProvider>
        {children}
      </DomainProvider>
    </SessionProvider>
  );
}