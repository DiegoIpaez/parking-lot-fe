'use client';

import * as zod from 'zod';
import { toast } from 'sonner';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import type { ParkingSpace } from '@/types';
import { useAuthStore } from '@/stores/auth.store';
import { vehiclesService } from '@/services/vehicles.service';
import { parkingSessionsService } from '@/services/parking-sessions.service';
import { DialogFooterCs } from '@/components/ui/custom/dialogCs/DialogCs';
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
import clientErrorHandler from '@/utils/handlers/clientError.handler';

const checkInSchema = zod.object({
  vehicleId: zod.string().min(1, 'Selecciona un vehículo'),
});

type CheckInFormValues = zod.infer<typeof checkInSchema>;

interface CheckInFormProps {
  parkingSpace: ParkingSpace;
  onSuccess: () => void;
  onCancel: () => void;
  isLoading?: boolean;
  initialVehicleId?: string;
  onOpenChange: (open: boolean) => void;
}

export function CheckInForm({
  parkingSpace,
  onSuccess,
  onCancel,
  isLoading: externalLoading,
  initialVehicleId,
  onOpenChange,
}: CheckInFormProps) {
  const { user } = useAuthStore();
  const queryClient = useQueryClient();

  const form = useForm<CheckInFormValues>({
    resolver: zodResolver(checkInSchema),
    defaultValues: {
      vehicleId: initialVehicleId || '',
    },
  });

  useEffect(() => {
    if (initialVehicleId) {
      form.setValue('vehicleId', initialVehicleId);
    }
  }, [initialVehicleId, form]);

  const { data: vehicles = [], isLoading: loadingVehicles } = useQuery({
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

      toast.success('Entrada registrada exitosamente');
      form.reset();
      onSuccess();
    },
    onError: (error) => clientErrorHandler(error),
  });

  const onSubmit = (values: CheckInFormValues) => {
    if (!user) return;

    checkInMutation.mutate({
      vehicleId: parseInt(values.vehicleId),
      parkingSpaceId: parkingSpace.id,
      checkInUserId: user.id,
    });
  };

  const isLoading =
    loadingVehicles || checkInMutation.isPending || externalLoading;

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
                    <SelectItem key={vehicle.id} value={vehicle.id.toString()}>
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
        <DialogFooterCs
          onOpenChange={onOpenChange}
          okBtnProps={{
            type: 'submit',
            children: 'Registrar',
            isLoading: checkInMutation.isPending,
          }}
          cancelBtnProps={{
            children: 'Cancelar',
            onClick: onCancel,
            disabled: isLoading,
          }}
        />
      </form>
    </Form>
  );
}
