import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import { AppSidebar } from './app-sidebar';
import { Toaster } from 'sonner';

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <div className="flex h-screen bg-white dark:bg-gray-900">
        <AppSidebar />
        <main className="flex-1 overflow-auto">
          <div className="lg:hidden p-4 border-b border-gray-200 dark:border-purple-600">
            <SidebarTrigger />
          </div>
          <Toaster />
          {children}
        </main>
      </div>
    </SidebarProvider>
  );
}
