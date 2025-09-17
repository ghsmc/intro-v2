import { auth } from '@/app/(auth)/auth';
import { MiloIndex } from '@/components/companies/milo-index';

export default async function CompaniesPage() {
  const session = await auth();

  return (
    <div className="flex flex-col min-h-screen">
      <MiloIndex session={session} />
    </div>
  );
}