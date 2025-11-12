'use client';

import { Loader2 } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQuery } from '@tanstack/react-query';
import * as z from 'zod';
import { parkingSessionsService } from '@/services/parking-sessions.service';
import { vehiclesService } from '@/services/vehicles.service';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import type { ParkingSpace } from '@/types';
import { useAuthStore } from '@/stores/auth.store';

const checkInSchema = z.object({
  vehicleId: z.string().min(1, 'Selecciona un vehículo'),
});

type CheckInFormValues = z.infer<typeof checkInSchema>;

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
  const { user } = useAuthStore();
  const { toast } = useToast();

  const form = useForm<CheckInFormValues>({
    resolver: zodResolver(checkInSchema),
    defaultValues: {
      vehicleId: '',
    },
  });

  const { data: vehicles = [], isLoading: loadingVehicles } = useQuery({
    queryKey: ['vehicles'],
    queryFn: vehiclesService.getAll,
    select: (data) => data.data,
  });

  const checkInMutation = useMutation({
    mutationFn: parkingSessionsService.create,
    onSuccess: () => {
      toast({
        title: 'Entrada registrada',
        description: `Vehículo ingresado al espacio ${parkingSpace.number}`,
      });
      form.reset();
      onOpenChange(false);
      onSuccess();
    },
    onError: (error: any) => {
      toast({
        title: 'Error al registrar entrada',
        description: error.response?.data?.message || 'Ocurrió un error',
        variant: 'destructive',
      });
    },
  });

  const onSubmit = (values: CheckInFormValues) => {
    if (!user) return;

    checkInMutation.mutate({
      vehicleId: parseInt(values.vehicleId),
      parkingSpaceId: parkingSpace.id,
      checkInUserId: user.id,
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Registrar Entrada</DialogTitle>
          <DialogDescription>
            Espacio {parkingSpace.number} - {parkingSpace.sector?.name}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="vehicleId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Vehículo</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    disabled={loadingVehicles || checkInMutation.isPending}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecciona un vehículo" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {vehicles.map((vehicle) => (
                        <SelectItem
                          key={vehicle.id}
                          value={vehicle.id.toString()}
                        >
                          {vehicle.licensePlate}
                          {vehicle.vehicleType && ` - ${vehicle.vehicleType.name}`}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-end gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                disabled={checkInMutation.isPending}
              >
                Cancelar
              </Button>
              <Button type="submit" disabled={checkInMutation.isPending}>
                {checkInMutation.isPending && (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                )}
                Registrar
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
