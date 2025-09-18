import { generateUUID } from '@/lib/utils';
import { DomainChat } from '@/components/domain-chat';
import { domainConfigs } from '@/lib/ai/domain-config';
import { FinanceCompaniesView } from '@/components/companies/finance-companies-view';

export default async function FinancePage({
  searchParams,
}: {
  searchParams: Promise<{ query?: string; view?: string }>;
}) {
  const { query, view } = await searchParams;
  const id = generateUUID();
  const financeConfig = domainConfigs.FINANCE;

  // Dynamic import for Bulge Bracket view
  if (view === 'bulge-bracket') {
    const { BulgeBracketView } = await import('@/components/finance/bulge-bracket-view');
    return <BulgeBracketView />;
  }

  // Show companies view if requested
  if (view === 'companies') {
    return <FinanceCompaniesView />;
  }

  return (
    <DomainChat
      id={id}
      domain="FINANCE"
      initialQuery={query}
      placeholder="Ask about investment banking, private equity, or quantitative finance..."
      systemPrompt={financeConfig.systemPrompt}
    />
  );
}