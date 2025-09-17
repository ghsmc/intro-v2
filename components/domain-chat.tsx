'use client';

import { useEffect } from 'react';
import { Chat } from './chat';
import { useDomain } from './domain-provider';
import { useRouter } from 'next/navigation';
import { useTheme } from 'next-themes';
import { useSession } from 'next-auth/react';

interface DomainChatProps {
  id: string;
  domain: 'ENGINEERS' | 'SOFTWARE' | 'FINANCE';
  initialQuery?: string;
  placeholder?: string;
  systemPrompt?: string;
}

export function DomainChat({
  id,
  domain,
  initialQuery,
  placeholder,
  systemPrompt
}: DomainChatProps) {
  const { setSelectedDomain } = useDomain();
  const router = useRouter();
  const { setTheme } = useTheme();
  const { data: session } = useSession();

  useEffect(() => {
    // Update the selected domain when this page loads
    setSelectedDomain(domain);

    // Set dark theme for Finance domain
    if (domain === 'FINANCE') {
      setTheme('dark');
    }

    // Store domain-specific context for this session
    if (typeof window !== 'undefined') {
      sessionStorage.setItem('currentDomain', domain);
      if (systemPrompt) {
        sessionStorage.setItem(`${domain}_systemPrompt`, systemPrompt);
      }
    }
  }, [domain, setSelectedDomain, systemPrompt, setTheme]);

  // Pass domain-specific props to the Chat component
  return (
    <Chat
      id={id}
      initialMessages={[]}
      initialChatModel="chat-model"
      initialVisibilityType="private"
      isReadonly={false}
      session={null}
      autoResume={false}
      domain={domain}
    />
  );
}