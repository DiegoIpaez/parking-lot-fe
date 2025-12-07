'use client';
import * as zod from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  vehiclesService,
  vehicleTypesService,
} from '@/services/vehicles.service';
import { FormField as FormFieldType } from '@/types';
import { useToast } from '@/hooks/use-toast';
import DynamicForm from '@/components/ui/custom/dynamicFormCs/DynamicForm';
import { VEHICLE_BRANDS, VEHICLE_COLORS, VEHICLE_MODELS } from '@/constants';

const createVehicleSchema = zod.object({
  licensePlate: zod.string().min(1, 'La placa es requerida'),
  brand: zod.string().min(1, 'La marca es requerida'),
  model: zod.string().min(1, 'El modelo es requerido'),
  color: zod.string().min(1, 'El color es requerido'),
  vehicleTypeId: zod.string().min(1, 'Selecciona un tipo de vehículo'),
});

type CreateVehicleFormValues = zod.infer<typeof createVehicleSchema>;

interface CreateVehicleFormProps {
  onSuccess: (vehicleId: number) => void;
  onCancel: () => void;
  isLoading?: boolean;
}

export function CreateVehicleForm({
  onSuccess,
  onCancel,
  isLoading: externalLoading,
}: CreateVehicleFormProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: vehicleTypes = [], isLoading: loadingVehicleTypes } = useQuery({
    queryKey: ['vehicle-types'],
    queryFn: async () => vehicleTypesService.getAll(),
    select: (data) => data.data,
  });

  const form = useForm<CreateVehicleFormValues>({
    resolver: zodResolver(createVehicleSchema),
    defaultValues: {
      licensePlate: '',
      brand: '',
      model: '',
      color: '',
      vehicleTypeId: '',
    },
  });

  const selectedBrand = form.watch('brand');
  const availableModels = selectedBrand
    ? VEHICLE_MODELS[selectedBrand] || []
    : [];

  const createVehicleMutation = useMutation({
    mutationFn: vehiclesService.create,
    onSuccess: (newVehicle) => {
      queryClient.invalidateQueries({ queryKey: ['vehicles'] });
      toast({
        title: 'Vehículo registrado',
        description: 'El vehículo ha sido registrado exitosamente',
      });
      onSuccess(newVehicle.id);
    },
    onError: () => {
      toast({
        title: 'Error al registrar vehículo',
        description: 'Ocurrió un error al registrar el vehículo',
        variant: 'destructive',
      });
    },
  });

  const onSubmit = (values: CreateVehicleFormValues) => {
    createVehicleMutation.mutate({
      licensePlate: values.licensePlate,
      brand: values.brand,
      model: values.model,
      color: values.color,
      vehicleTypeId: parseInt(values.vehicleTypeId),
    });
  };

  const isLoading =
    loadingVehicleTypes || createVehicleMutation.isPending || externalLoading;

  const fields: FormFieldType[] = [
    {
      name: 'licensePlate',
      type: 'text',
      label: 'Patente',
      placeholder: 'ABC-123',
      required: true,
      disabled: isLoading,
    },
    {
      name: 'brand',
      type: 'select',
      label: 'Marca',
      placeholder: 'Toyota',
      required: true,
      disabled: isLoading,
      options: VEHICLE_BRANDS.map((brand) => ({ value: brand, label: brand })),
    },
    {
      name: 'model',
      type: 'select',
      label: 'Modelo',
      placeholder: 'Corolla',
      required: true,
      disabled: isLoading,
      options: availableModels.map((model) => ({ value: model, label: model })),
    },
    {
      name: 'color',
      type: 'select',
      label: 'Color',
      placeholder: 'Blanco',
      required: true,
      disabled: isLoading,
      options: VEHICLE_COLORS.map((color) => ({ value: color, label: color })),
    },
    {
      name: 'vehicleTypeId',
      type: 'select',
      label: 'Tipo de Vehículo',
      required: true,
      disabled: isLoading,
      options: vehicleTypes.map((type) => ({
        value: type.id.toString(),
        label: type.name,
      })),
      placeholder: 'Selecciona un tipo',
    },
  ];

  return (
    <DynamicForm
      fields={fields}
      schema={createVehicleSchema}
      onSubmit={onSubmit}
      onCancel={onCancel}
      form={form}
      submitText="Registrar Vehículo"
      isLoading={isLoading}
      className="space-y-4"
    />
  );
}
