'use client';

import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import { usePathname, useRouter } from 'next/navigation';

type DomainType = 'ENGINEERS' | 'SOFTWARE' | 'FINANCE';

interface DomainContextType {
  selectedDomain: DomainType;
  setSelectedDomain: (domain: DomainType) => void;
}

const DomainContext = createContext<DomainContextType | undefined>(undefined);

export function DomainProvider({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [selectedDomain, setSelectedDomain] = useState<DomainType>('ENGINEERS');

  // Sync domain with current path
  useEffect(() => {
    if (pathname.includes('/engineers')) {
      setSelectedDomain('ENGINEERS');
    } else if (pathname.includes('/software')) {
      setSelectedDomain('SOFTWARE');
    } else if (pathname.includes('/finance')) {
      setSelectedDomain('FINANCE');
    }
    // For other pages, maintain the previously selected domain
  }, [pathname]);

  // Persist domain in localStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedDomain = localStorage.getItem('selectedDomain') as DomainType;
      if (savedDomain && ['ENGINEERS', 'SOFTWARE', 'FINANCE'].includes(savedDomain)) {
        setSelectedDomain(savedDomain);
      }
    }
  }, []);

  const updateDomain = (domain: DomainType) => {
    setSelectedDomain(domain);
    if (typeof window !== 'undefined') {
      localStorage.setItem('selectedDomain', domain);
    }

    // Don't navigate if we're on a chat page or other important pages
    if (pathname.includes('/chat/') || pathname === '/' || pathname.includes('/api/')) {
      return;
    }

    // Navigate to the appropriate domain URL
    const domainPaths = {
      'ENGINEERS': '/engineers',
      'SOFTWARE': '/software',
      'FINANCE': '/finance'
    };

    // Only navigate if we're not already on the correct domain path
    if (!pathname.includes(domainPaths[domain].substring(1))) {
      router.push(domainPaths[domain]);
    }
  };

  return (
    <DomainContext.Provider value={{ selectedDomain, setSelectedDomain: updateDomain }}>
      {children}
    </DomainContext.Provider>
  );
}

export function useDomain() {
  const context = useContext(DomainContext);
  if (!context) {
    throw new Error('useDomain must be used within a DomainProvider');
  }
  return context;
}