import { generateUUID } from '@/lib/utils';
import { DomainChat } from '@/components/domain-chat';

export default async function SoftwarePage({
  searchParams,
}: {
  searchParams: Promise<{ query?: string }>;
}) {
  const { query } = await searchParams;
  const id = generateUUID();

  return (
    <DomainChat
      id={id}
      domain="SOFTWARE"
      initialQuery={query}
      placeholder="Search for software development, product, and tech roles..."
      systemPrompt="You are Milo, an AI assistant specialized in software and product careers. You understand the software development lifecycle, product management, UX/UI design, and the startup ecosystem. Focus on innovative software companies, product-market fit, and growth opportunities."
    />
  );
}