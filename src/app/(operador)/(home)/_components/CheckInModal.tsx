'use client';

import { useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { vehiclesService } from '@/services/vehicles.service';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import type { ParkingSpace } from '@/types';
import ButtonCs from '@/components/ui/custom/ButtonCs';
import { CheckInForm } from './CheckInForm';
import { CreateVehicleForm } from './CreateVehicleForm';

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
  const [isCreatingVehicle, setIsCreatingVehicle] = useState(false);
  const [selectedVehicleId, setSelectedVehicleId] = useState<string>('');

  const {
    refetch,
    isLoading: loadingVehicles,
  } = useQuery({
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
      setIsCreatingVehicle(false);
      setSelectedVehicleId('');
    }
  }, [open, refetch]);

  const handleVehicleCreated = (vehicleId: number) => {
    setIsCreatingVehicle(false);
    setSelectedVehicleId(vehicleId.toString());
  };

  const handleCheckInSuccess = () => {
    setIsCreatingVehicle(false);
    setSelectedVehicleId('');
    onOpenChange(false);
    onSuccess();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Registrar Entrada</DialogTitle>
          <DialogDescription>
            Espacio {parkingSpace?.number} - {parkingSpace?.sector?.name}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="flex gap-2 border-b">
            <ButtonCs
              type="button"
              variant={!isCreatingVehicle ? 'default' : 'ghost'}
              onClick={() => setIsCreatingVehicle(false)}
              className="rounded-b-none"
              disabled={loadingVehicles}
            >
              Seleccionar Vehículo
            </ButtonCs>
            <ButtonCs
              type="button"
              variant={isCreatingVehicle ? 'default' : 'ghost'}
              onClick={() => setIsCreatingVehicle(true)}
              className="rounded-b-none"
              disabled={loadingVehicles}
            >
              Registrar Nuevo
            </ButtonCs>
          </div>
          {!isCreatingVehicle ? (
            <CheckInForm
              parkingSpace={parkingSpace}
              onSuccess={handleCheckInSuccess}
              onCancel={() => onOpenChange(false)}
              isLoading={loadingVehicles}
              initialVehicleId={selectedVehicleId}
            />
          ) : (
            <CreateVehicleForm
              onSuccess={handleVehicleCreated}
              onCancel={() => setIsCreatingVehicle(false)}
              isLoading={loadingVehicles}
            />
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
