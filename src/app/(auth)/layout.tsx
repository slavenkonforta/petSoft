import Logo from '@/components/logo';

type LayoutProps = {
  children: React.ReactNode;
};

export default function Layout({ children }: LayoutProps) {
  return (
    <div className='flex min-h-screen flex-col items-center justify-center gap-y-5'>
      <Logo />
      {children}
    </div>
  );
}
