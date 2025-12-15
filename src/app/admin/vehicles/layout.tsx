import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Vehículos',
};

export default function VehiclesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
