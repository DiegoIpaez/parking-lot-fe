'use client';

import { useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import type { ParkingSpace } from '@/types';
import { vehiclesService } from '@/services/vehicles.service';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CheckInForm } from './CheckInForm';
import { CreateVehicleForm } from './CreateVehicleForm';
import { DialogCs } from '@/components/ui/custom/dialogCs/DialogCs';

interface CheckInModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  parkingSpace: ParkingSpace;
  onSuccess: () => void;
}

export function CheckInModal({
  open,
  onOpenChange,
  parkingSpace,
  onSuccess,
}: CheckInModalProps) {
  const [activeTab, setActiveTab] = useState('select');
  const [selectedVehicleId, setSelectedVehicleId] = useState<string>('');

  const { refetch, isLoading: loadingVehicles } = useQuery({
    queryKey: ['vehicles'],
    queryFn: async () =>
      vehiclesService.getAll({ notParked: true, showAll: true }),
    select: (data) => data.data,
    staleTime: 0,
    enabled: false,
  });

  useEffect(() => {
    if (open) {
      refetch();
      setActiveTab('select');
      setSelectedVehicleId('');
    }
  }, [open, refetch]);

  const handleVehicleCreated = (vehicleId: number) => {
    setActiveTab('select');
    setSelectedVehicleId(vehicleId.toString());
  };

  const handleCheckInSuccess = () => {
    setActiveTab('select');
    setSelectedVehicleId('');
    onOpenChange(false);
    onSuccess();
  };

  return (
    <DialogCs
      open={open}
      onOpenChange={onOpenChange}
      footer={false}
      headerProps={{
        title: 'Registrar Entrada',
        description: `Espacio ${parkingSpace?.number} - ${parkingSpace?.sector?.name || ''}`,
      }}
      cancelBtnProps={{
        onClick: () => onOpenChange(false),
        children: 'Cancelar',
        disabled: loadingVehicles,
      }}
    >
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger
            className="cursor-pointer"
            value="select"
            disabled={loadingVehicles}
          >
            Seleccionar Vehículo
          </TabsTrigger>
          <TabsTrigger
            className="cursor-pointer"
            value="create"
            disabled={loadingVehicles}
          >
            Registrar Nuevo
          </TabsTrigger>
        </TabsList>
        <TabsContent value="select" className="mt-4">
          <CheckInForm
            onOpenChange={onOpenChange}
            parkingSpace={parkingSpace}
            onSuccess={handleCheckInSuccess}
            onCancel={() => onOpenChange(false)}
            isLoading={loadingVehicles}
            initialVehicleId={selectedVehicleId}
          />
        </TabsContent>
        <TabsContent value="create" className="mt-4">
          <CreateVehicleForm
            onSuccess={handleVehicleCreated}
            onCancel={() => setActiveTab('select')}
            isLoading={loadingVehicles}
          />
        </TabsContent>
      </Tabs>
    </DialogCs>
  );
}
