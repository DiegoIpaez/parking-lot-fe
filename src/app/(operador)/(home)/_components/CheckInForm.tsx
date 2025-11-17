'use client';

import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import * as z from 'zod';
import { parkingSessionsService } from '@/services/parking-sessions.service';
import { vehiclesService } from '@/services/vehicles.service';
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
import { useToast } from '@/hooks/use-toast';
import type { ParkingSpace } from '@/types';
import { useAuthStore } from '@/stores/auth.store';
import ButtonCs from '@/components/ui/custom/ButtonCs';

const checkInSchema = z.object({
  vehicleId: z.string().min(1, 'Selecciona un vehículo'),
});

type CheckInFormValues = z.infer<typeof checkInSchema>;

interface CheckInFormProps {
  parkingSpace: ParkingSpace;
  onSuccess: () => void;
  onCancel: () => void;
  isLoading?: boolean;
  initialVehicleId?: string;
}

export function CheckInForm({
  parkingSpace,
  onSuccess,
  onCancel,
  isLoading: externalLoading,
  initialVehicleId,
}: CheckInFormProps) {
  const { user } = useAuthStore();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const form = useForm<CheckInFormValues>({
    resolver: zodResolver(checkInSchema),
    defaultValues: {
      vehicleId: initialVehicleId || '',
    },
  });

  // Actualizar el valor cuando cambie initialVehicleId
  React.useEffect(() => {
    if (initialVehicleId) {
      form.setValue('vehicleId', initialVehicleId);
    }
  }, [initialVehicleId, form]);

  const {
    data: vehicles = [],
    isLoading: loadingVehicles,
  } = useQuery({
    queryKey: ['vehicles'],
    queryFn: async () =>
      vehiclesService.getAll({ notParked: true, showAll: true }),
    select: (data) => data.data,
    staleTime: 0,
  });

  const checkInMutation = useMutation({
    mutationFn: parkingSessionsService.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['vehicles'] });

      toast({
        title: 'Entrada registrada',
        description: `Vehículo ingresado al espacio ${parkingSpace.number}`,
      });
      form.reset();
      onSuccess();
    },
    onError: () => {
      toast({
        title: 'Error al registrar entrada',
        description: 'Ocurrió un error',
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

  const isLoading = loadingVehicles || checkInMutation.isPending || externalLoading;

  return (
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
                value={field.value}
                disabled={isLoading}
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
                      {vehicle.vehicleType &&
                        ` - ${vehicle.vehicleType.name}`}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex justify-end gap-2">
          <ButtonCs
            type="button"
            variant="outline"
            onClick={onCancel}
            disabled={isLoading}
          >
            Cancelar
          </ButtonCs>
          <ButtonCs
            type="submit"
            disabled={isLoading}
            isLoading={checkInMutation.isPending}
          >
            Registrar
          </ButtonCs>
        </div>
      </form>
    </Form>
  );
}

