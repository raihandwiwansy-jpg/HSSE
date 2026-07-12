'use client';

import { ReactNode } from 'react';
import { usePathname } from 'next/navigation';
import Sidebar, { useSidebar } from '@/components/ui/Sidebar';
import Navbar from '@/components/ui/Navbar';

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <Sidebar>
      <SidebarContent>
        {children}
      </SidebarContent>
    </Sidebar>
  );
}

function SidebarContent({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const { isCollapsed } = useSidebar();

  return (
    <div className="flex h-screen">
      {/* Spacer for fixed sidebar */}
      <div className={`hidden lg:block shrink-0 transition-all duration-300 ${isCollapsed ? 'w-20' : 'w-64'}`} />

      {/* Main content area */}
      <div className="flex-1 flex flex-col min-h-screen bg-gray-50 dark:bg-[#0F0F1A]">
        <Navbar />
        <main className="flex-1 overflow-y-auto p-4 md:p-6" key={pathname}>
          <div className="max-w-7xl mx-auto animate-fade-in-up-fast">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
