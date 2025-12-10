import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Tipos de Vehículo',
};

export default function VehicleTypesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
