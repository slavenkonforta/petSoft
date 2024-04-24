import AppFooter from '@/components/app-footer';
import AppHeader from '@/components/app-header';
import BackgroundPattern from '@/components/background-pattern';
import PetContextProvider from '@/contexts/pet-context-provider';
import { Pet } from '@/lib/types';

type LayoutProps = {
  children: React.ReactNode;
};

export default async function Layout({ children }: LayoutProps) {
  const response = await fetch('https://bytegrad.com/course-assets/projects/petsoft/api/pets');
  if (!response.ok) {
    throw new Error('Failed to fetch pets');
  }
  const pets: Pet[] = await response.json();

  return (
    <>
      <BackgroundPattern />

      <div className='mx-auto flex min-h-screen max-w-[1050px] flex-col px-4'>
        <AppHeader />
        <PetContextProvider data={pets}>{children}</PetContextProvider>
        <AppFooter />
      </div>
    </>
  );
}
