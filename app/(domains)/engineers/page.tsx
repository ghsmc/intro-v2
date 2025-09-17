import { generateUUID } from '@/lib/utils';
import { DomainChat } from '@/components/domain-chat';

export default async function EngineersPage({
  searchParams,
}: {
  searchParams: Promise<{ query?: string }>;
}) {
  const { query } = await searchParams;
  const id = generateUUID();

  return (
    <DomainChat
      id={id}
      domain="ENGINEERS"
      initialQuery={query}
      placeholder="Ask about engineering roles, technical challenges, or career advice..."
      systemPrompt="You are Milo, an AI assistant specialized in helping engineers find their dream jobs in Silicon Valley. You have deep knowledge of software engineering, hardware engineering, DevOps, SRE, and engineering management roles. Focus on technical skills, engineering culture, and cutting-edge technology companies."
    />
  );
}