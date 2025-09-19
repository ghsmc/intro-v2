'use client';

import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { MessageSquare, Building2, Briefcase, } from 'lucide-react';
import { cn } from '@/lib/utils';

export function FinanceNav() {
  const searchParams = useSearchParams();
  const view = searchParams.get('view');

  return (
    <div className='border-border border-b'>
      <div className="flex items-center gap-1 px-6 py-2">
        <Link
          href="/finance"
          className={cn(
            'flex items-center gap-2 rounded-lg px-4 py-2 transition-colors',
            !view ? "bg-primary/10 text-primary" : "hover:bg-muted"
          )}
        >
          <MessageSquare className="size-4" />
          <span>Chat</span>
        </Link>
        <Link
          href="/finance?view=bulge-bracket"
          className={cn(
            'flex items-center gap-2 rounded-lg px-4 py-2 transition-colors',
            view === 'bulge-bracket' ? "bg-primary/10 text-primary" : "hover:bg-muted"
          )}
        >
          <Briefcase className="size-4" />
          <span>Bulge Bracket</span>
        </Link>
        <Link
          href="/finance?view=companies"
          className={cn(
            'flex items-center gap-2 rounded-lg px-4 py-2 transition-colors',
            view === 'companies' ? "bg-primary/10 text-primary" : "hover:bg-muted"
          )}
        >
          <Building2 className="size-4" />
          <span>Top 100 Firms</span>
        </Link>
      </div>
    </div>
  );
}