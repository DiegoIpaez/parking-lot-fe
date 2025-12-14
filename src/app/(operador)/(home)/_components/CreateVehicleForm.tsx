'use client';
import * as zod from 'zod';
import { toast } from 'sonner';
import { useEffect } from 'react';
import { useForm, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { vehiclesService } from '@/services/vehicles.service';
import { vehicleBrandsService } from '@/services/vehicleBrands.service';
import { vehicleModelsService } from '@/services/vehicleModels.service';
import { FormField as FormFieldType } from '@/types';
import DynamicForm from '@/components/ui/custom/dynamicFormCs/DynamicForm';
import { VEHICLE_COLORS } from '@/constants';

const createVehicleSchema = zod.object({
  licensePlate: zod.string().min(1, 'La placa es requerida'),
  vehicleBrandId: zod.number().min(1, 'La marca es requerida'),
  vehicleModelId: zod.number().min(1, 'El modelo es requerido'),
  color: zod.string().min(1, 'El color es requerido'),
});

type CreateVehicleFormValues = zod.infer<typeof createVehicleSchema>;

type CreateVehicleFormProps = {
  onSuccess: (vehicleId: number) => void;
  onCancel: () => void;
  isLoading?: boolean;
};

export function CreateVehicleForm({
  onSuccess,
  onCancel,
  isLoading: externalLoading,
}: CreateVehicleFormProps) {
  const queryClient = useQueryClient();

  const form = useForm<CreateVehicleFormValues>({
    resolver: zodResolver(createVehicleSchema),
    defaultValues: {
      licensePlate: '',
      vehicleBrandId: 0,
      vehicleModelId: 0,
      color: '',
    },
  });

  const selectedBrandId = useWatch({
    control: form.control,
    name: 'vehicleBrandId',
  });

  useEffect(() => {
    form.setValue('vehicleModelId', 0);
  }, [selectedBrandId, form]);

  const createVehicleMutation = useMutation({
    mutationFn: vehiclesService.create,
    onSuccess: (newVehicle) => {
      queryClient.invalidateQueries({ queryKey: ['vehicles'] });
      toast.success('Vehículo registrado exitosamente');
      onSuccess(newVehicle.id);
    },
  });

  const onSubmit = (values: CreateVehicleFormValues) => {
    createVehicleMutation.mutate({
      licensePlate: values.licensePlate,
      vehicleModelId: values.vehicleModelId,
      color: values.color,
    });
  };

  const isInitializing = externalLoading;

  const fields: FormFieldType[] = [
    {
      name: 'licensePlate',
      type: 'text',
      label: 'Patente',
      placeholder: 'ABC-123',
      required: true,
      disabled: isInitializing,
    },
    {
      name: 'vehicleBrandId',
      type: 'autocomplete',
      label: 'Marca',
      placeholder: 'Buscar marca...',
      required: true,
      disabled: isInitializing,
      queryKey: 'vehicle-brands',
      queryFn: vehicleBrandsService.getAll,
    },
    {
      name: 'vehicleModelId',
      type: 'autocomplete',
      label: 'Modelo',
      placeholder: 'Buscar modelo...',
      required: true,
      disabled: isInitializing || !selectedBrandId,
      queryKey: 'vehicle-models',
      queryFn: vehicleModelsService.getAll,
      queryParams: selectedBrandId
        ? { vehicleBrandId: selectedBrandId }
        : undefined,
    },
    {
      name: 'color',
      type: 'select',
      label: 'Color',
      placeholder: 'Blanco',
      required: true,
      disabled: isInitializing,
      options: VEHICLE_COLORS.map((color) => ({ value: color, label: color })),
    },
  ];

  return (
    <DynamicForm
      fields={fields}
      schema={createVehicleSchema}
      okBtnProps={{
        children: 'Registrar Vehículo',
        type: 'button',
        isLoading: createVehicleMutation.isPending,
        onClick: () => form.handleSubmit(onSubmit)(),
      }}
      cancelBtnProps={{
        onClick: onCancel,
      }}
      form={form}
      isInitializing={isInitializing}
      className="space-y-4"
    />
  );
}
