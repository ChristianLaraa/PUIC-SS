'use client';

import { usePathname } from 'next/navigation';
import Sidebar from '@/components/layout/Sidebar';
import InstitutionalHeader from '@/components/layout/InstitutionalHeader';
import type { UserPayload } from '@/lib/auth';

interface AppShellProps {
  children: React.ReactNode;
  user: UserPayload | null;
}

export default function AppShell({ children, user }: AppShellProps) {
  const pathname = usePathname();
  const isLoginPage = pathname === '/login';

  if (isLoginPage) {
    return <main className="min-h-screen w-full">{children}</main>;
  }

  return (
    <div className="flex min-h-screen w-full bg-[#FBF9F5] text-[#0E1B2E]">
      <Sidebar user={user} />
      <div className="flex-1 flex flex-col min-w-0 min-h-screen">
        <InstitutionalHeader />
        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto max-w-7xl mx-auto w-full">
          {children}
        </main>
      </div>
    </div>
  );
}
