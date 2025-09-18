import { auth } from '@/app/(auth)/auth';
import { MiloIndex } from '@/components/companies/milo-index';

export default async function CompaniesPage() {
  const session = await auth();

  return (
    <div className='flex min-h-screen flex-col'>
      <MiloIndex session={session} />
    </div>
  );
}