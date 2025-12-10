import { Metadata } from 'next';
import { ChartSpline } from 'lucide-react';
import TitleAdmin from '../_components/TitleAdmin';

export const metadata: Metadata = {
  title: 'Dashboard',
};

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <TitleAdmin
        title="Historial de Sesiones"
        icon={<ChartSpline className="w-6 h-6" />}
      />
      {children}
    </>
  );
}
