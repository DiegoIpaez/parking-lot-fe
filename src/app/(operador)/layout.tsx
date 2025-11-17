import { Metadata } from 'next';
import { Topbar } from '@/components/topbar';

export const metadata: Metadata = {
  title: 'Operator',
};
export default function OperadorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className="min-h-screen bg-background">
      <Topbar />
      {children}
    </main>
  );
}
