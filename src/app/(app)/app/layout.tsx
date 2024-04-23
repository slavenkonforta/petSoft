import AppFooter from '@/components/app-footer';
import AppHeader from '@/components/app-header';
import BackgroundPattern from '@/components/background-pattern';

type LayoutProps = {
  children: React.ReactNode;
};

export default function Layout({ children }: LayoutProps) {
  return (
    <>
      <BackgroundPattern />

      <div className='mx-auto max-w-[1050px] px-4'>
        <AppHeader />
        {children}
        <AppFooter />
      </div>
    </>
  );
}
