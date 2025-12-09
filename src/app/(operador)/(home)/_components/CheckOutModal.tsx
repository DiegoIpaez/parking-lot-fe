'use client';

import { toast } from 'sonner';
import { es } from 'date-fns/locale';
import { formatDistanceToNow } from 'date-fns';
import { Car, Clock, User } from 'lucide-react';
import { useMutation } from '@tanstack/react-query';

import { ParkingSessionStatus, type ParkingSession } from '@/types';
import { useAuthStore } from '@/stores/auth.store';
import { parkingSessionsService } from '@/services/parking-sessions.service';
import clientErrorHandler from '@/utils/handlers/clientError.handler';
import { Badge } from '@/components/ui/badge';
import { DialogCs } from '@/components/ui/custom/dialogCs/DialogCs';

type CheckOutModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  session: ParkingSession;
  onSuccess: () => void;
};

export function CheckOutModal({
  open,
  onOpenChange,
  session,
  onSuccess,
}: CheckOutModalProps) {
  const { user } = useAuthStore();

  const checkOutMutation = useMutation({
    mutationFn: () => {
      if (!user) throw new Error('Usuario no autenticado');

      return parkingSessionsService.complete(session.id, {
        checkOutUserId: user.id,
      });
    },
    onSuccess: () => {
      toast.success('Salida registrada correctamente');
      onOpenChange(false);
      onSuccess();
    },
    onError: (error) => clientErrorHandler(error),
  });

  const handleCheckOut = () => {
    checkOutMutation.mutate();
  };

  return (
    <DialogCs
      open={open}
      onOpenChange={onOpenChange}
      headerProps={{
        title: 'Información de Sesión',
        description: `Espacio ${session.parkingSpace?.number} - ${session.parkingSpace?.sector?.name}`,
      }}
      okBtnProps={{
        disabled: checkOutMutation.isPending,
        isLoading: checkOutMutation.isPending,
        children: 'Finalizar Sesión',
        onClick: handleCheckOut,
      }}
      cancelBtnProps={{
        disabled: checkOutMutation.isPending,
      }}
    >
      <div className="space-y-4">
        <div className="flex items-center gap-3 p-3 bg-muted rounded-lg">
          <Car className="h-5 w-5 text-muted-foreground" />
          <div className="flex-1">
            <p className="text-sm font-medium">Vehículo</p>
            <p className="text-lg font-semibold">
              {session.vehicle?.licensePlate}
            </p>
            {session.vehicle?.vehicleType && (
              <p className="text-xs text-muted-foreground">
                {session.vehicle.vehicleType.name}
              </p>
            )}
          </div>
        </div>
        <div className="flex items-center gap-3 p-3 bg-muted rounded-lg">
          <Clock className="h-5 w-5 text-muted-foreground" />
          <div className="flex-1">
            <p className="text-sm font-medium">Hora de Entrada</p>
            <p className="text-sm">
              {new Date(session.checkInTime).toLocaleString('es-ES')}
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              Hace{' '}
              {formatDistanceToNow(new Date(session.checkInTime), {
                locale: es,
              })}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3 p-3 bg-muted rounded-lg">
          <User className="h-5 w-5 text-muted-foreground" />
          <div className="flex-1">
            <p className="text-sm font-medium">Usuario de Entrada</p>
            <p className="text-sm">
              {session?.checkInUser?.firstName || 'N/A'}
            </p>
          </div>
        </div>
        <div className="flex items-center justify-between p-3 bg-primary/10 rounded-lg">
          <span className="text-sm font-medium">Estado</span>
          <Badge
            variant={
              session?.status === ParkingSessionStatus.ACTIVE
                ? 'default'
                : 'secondary'
            }
          >
            {session?.status === ParkingSessionStatus.ACTIVE
              ? 'ACTIVO'
              : 'COMPLETADO'}
          </Badge>
        </div>
      </div>
    </DialogCs>
  );
}
