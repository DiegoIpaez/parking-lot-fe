'use client';
import * as zod from 'zod';
import { toast } from 'sonner';
import { useForm, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  vehiclesService,
  vehicleTypesService,
} from '@/services/vehicles.service';
import { FormField as FormFieldType } from '@/types';
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

  const { data: vehicleTypes = [], isLoading: loadingVehicleTypes } = useQuery({
    queryKey: ['vehicle-types'],
    queryFn: async () => vehicleTypesService.getAll({ showAll: true }),
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

  const selectedBrand = useWatch({
    control: form.control,
    name: 'brand',
  });

  const availableModels = selectedBrand
    ? VEHICLE_MODELS[selectedBrand] || []
    : [];

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
      brand: values.brand,
      model: values.model,
      color: values.color,
      vehicleTypeId: parseInt(values.vehicleTypeId),
    });
  };

  const isInitializing = loadingVehicleTypes || externalLoading;

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
      name: 'brand',
      type: 'select',
      label: 'Marca',
      placeholder: 'Toyota',
      required: true,
      disabled: isInitializing,
      options: VEHICLE_BRANDS.map((brand) => ({ value: brand, label: brand })),
    },
    {
      name: 'model',
      type: 'select',
      label: 'Modelo',
      placeholder: 'Corolla',
      required: true,
      disabled: isInitializing,
      options: availableModels.map((model) => ({ value: model, label: model })),
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
    {
      name: 'vehicleTypeId',
      type: 'select',
      label: 'Tipo de Vehículo',
      required: true,
      disabled: isInitializing,
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
      okBtnProps={{
        children: 'Registrar Vehículo',
        type: 'submit',
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
