import { Metadata } from 'next';
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from '@/components/ui/sidebar';
import AdminSidebar from './_components/AdminSidebar';

export const metadata: Metadata = {
  title: 'Admin',
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main>
      <SidebarProvider
        style={
          {
            '--sidebar-width': 'calc(var(--spacing) * 72)',
            '--header-height': 'calc(var(--spacing) * 12)',
          } as React.CSSProperties
        }
      >
        <AdminSidebar />
        <SidebarInset>
          <div className="flex flex-1 flex-col min-h-screen bg-background">
            <header className="flex h-14 items-center border-b px-4 lg:px-6">
              <SidebarTrigger className="cursor-pointer" />
              <h2 className="ml-4 text-base font-medium">Admin Panel</h2>
            </header>
            <main className="flex-1 p-4">{children}</main>
          </div>
        </SidebarInset>
      </SidebarProvider>
    </main>
  );
}
