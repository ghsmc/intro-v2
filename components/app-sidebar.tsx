'use client';

import type { User } from 'next-auth';
import { useRouter } from 'next/navigation';

import { PlusIcon } from '@/components/icons';
import { SidebarHistory } from '@/components/sidebar-history';
import { SidebarUserNav } from '@/components/sidebar-user-nav';
import { Button } from '@/components/ui/button';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  useSidebar,
} from '@/components/ui/sidebar';
import Link from 'next/link';
import { Tooltip, TooltipContent, TooltipTrigger } from './ui/tooltip';
import { domainConfigs } from '@/lib/ai/domain-config';
import { useDomain } from './domain-provider';
export function AppSidebar({ user }: { user: User | undefined }) {
  const router = useRouter();
  const { setOpenMobile } = useSidebar();
  const { selectedDomain } = useDomain();

  return (
    <Sidebar className="group-data-[side=left]:border-r-0">
      <SidebarHeader>
        <SidebarMenu>
          <div className="flex flex-row items-center justify-between">
            <Link
              href="/"
              onClick={() => {
                setOpenMobile(false);
              }}
              className="flex flex-row items-center gap-3"
            >
              <div className={`w-7 h-7 bg-gradient-to-br ${domainConfigs[selectedDomain].theme.logoColor} flex items-center justify-center text-white font-medium shadow-sm border ${
                selectedDomain === 'FINANCE' ? 'border-green-800/20' :
                selectedDomain === 'SOFTWARE' ? 'border-blue-800/20' :
                'border-red-800/20'
              } rounded-sm`}>
                <span className="font-mono text-sm">人</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="cursor-pointer font-semibold text-base text-gray-900 dark:text-gray-100 hover:text-gray-600 dark:hover:text-gray-300 transition-colors">
                  Milo
                </span>
                <span className="font-mono text-xs tracking-widest text-muted-foreground uppercase">
                  [{selectedDomain === 'ENGINEERS' ? 'ENGINEERING' : selectedDomain}]
                </span>
              </div>
            </Link>
            <div className="flex gap-1">
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    type="button"
                    className="h-8 p-1 md:h-fit md:p-2"
                    onClick={() => {
                      setOpenMobile(false);
                      router.push('/');
                      router.refresh();
                    }}
                  >
                    <PlusIcon />
                  </Button>
                </TooltipTrigger>
                <TooltipContent align="end" className="hidden md:block">
                  New Chat
                </TooltipContent>
              </Tooltip>
            </div>
          </div>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <SidebarHistory user={user} />
      </SidebarContent>
      <SidebarFooter>{user && <SidebarUserNav user={user} />}</SidebarFooter>
    </Sidebar>
  );
}
