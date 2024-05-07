import AppFooter from '@/components/app-footer';
import AppHeader from '@/components/app-header';
import BackgroundPattern from '@/components/background-pattern';
import { Toaster } from '@/components/ui/sonner';
import PetContextProvider from '@/contexts/pet-context-provider';
import SearchContextProvider from '@/contexts/search-context-provider';
import { auth } from '@/lib/auth';
import prisma from '@/lib/db';
import { redirect } from 'next/navigation';

type LayoutProps = {
  children: React.ReactNode;
};

export default async function Layout({ children }: LayoutProps) {
  const session = await auth();
  if (!session?.user) {
    redirect('/login');
  }

  const pets = await prisma.pet.findMany({
    where: {
      userId: session.user.id,
    },
  });

  return (
    <>
      <BackgroundPattern />

      <div className='mx-auto flex min-h-screen max-w-[1050px] flex-col px-4'>
        <AppHeader />

        <SearchContextProvider>
          <PetContextProvider data={pets}>{children}</PetContextProvider>
        </SearchContextProvider>

        <AppFooter />
      </div>

      <Toaster position='top-right' />
    </>
  );
}
