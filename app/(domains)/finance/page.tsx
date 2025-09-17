import { generateUUID } from '@/lib/utils';
import { DomainChat } from '@/components/domain-chat';
import { domainConfigs } from '@/lib/ai/domain-config';

export default async function FinancePage({
  searchParams,
}: {
  searchParams: Promise<{ query?: string }>;
}) {
  const { query } = await searchParams;
  const id = generateUUID();
  const financeConfig = domainConfigs.FINANCE;

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