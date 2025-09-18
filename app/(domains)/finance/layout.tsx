import { FinanceNav } from '@/components/finance-nav';

export default function FinanceLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className='flex h-full flex-col'>
      <FinanceNav />
      <div className="flex-1 overflow-hidden">
        {children}
      </div>
    </div>
  );
}