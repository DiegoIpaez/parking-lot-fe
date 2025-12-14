'use client';

import * as zod from 'zod';
import { useEffect } from 'react';
import { useForm, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { FormField as FormFieldType } from '@/types';
import { vehicleBrandsService } from '@/services/vehicleBrands.service';
import { vehicleModelsService } from '@/services/vehicleModels.service';
import { VEHICLE_COLORS } from '@/constants';
import DynamicForm from '@/components/ui/custom/dynamicFormCs/DynamicForm';
import { DialogCs } from '@/components/ui/custom/dialogCs/DialogCs';

const vehicleSchema = zod.object({
  licensePlate: zod.string().min(1, 'La placa es requerida'),
  vehicleBrandId: zod.number().min(1, 'La marca es requerida'),
  vehicleModelId: zod.number().min(1, 'El modelo es requerido'),
  color: zod.string().min(1, 'El color es requerido'),
});

type VehicleFormValues = zod.infer<typeof vehicleSchema>;

interface VehicleFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  defaultValues?: Partial<VehicleFormValues>;
  isEdit?: boolean;
  onSubmit: (values: VehicleFormValues) => Promise<void>;
  isLoading?: boolean;
}

export default function VehicleFormDialog({
  open,
  onOpenChange,
  defaultValues = {},
  isEdit = false,
  onSubmit,
  isLoading = false,
}: VehicleFormDialogProps) {
  const form = useForm<VehicleFormValues>({
    resolver: zodResolver(vehicleSchema),
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
    if (open) {
      form.reset({
        licensePlate: defaultValues.licensePlate || '',
        vehicleBrandId: defaultValues.vehicleBrandId || 0,
        vehicleModelId: defaultValues.vehicleModelId || 0,
        color: defaultValues.color || '',
      });
    } else {
      form.reset({
        licensePlate: '',
        vehicleBrandId: 0,
        vehicleModelId: 0,
        color: '',
      });
    }
  }, [open, defaultValues, form]);

  useEffect(() => {
    if (selectedBrandId && selectedBrandId !== (defaultValues.vehicleBrandId || 0)) {
      form.setValue('vehicleModelId', 0);
    }
  }, [selectedBrandId, defaultValues.vehicleBrandId, form]);

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
      name: 'vehicleBrandId',
      type: 'autocomplete',
      label: 'Marca',
      placeholder: 'Buscar marca...',
      required: true,
      disabled: isLoading,
      queryKey: 'vehicle-brands',
      queryFn: vehicleBrandsService.getAll,
    },
    {
      name: 'vehicleModelId',
      type: 'autocomplete',
      label: 'Modelo',
      placeholder: 'Buscar modelo...',
      required: true,
      disabled: isLoading || !selectedBrandId,
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
      placeholder: 'Selecciona un color',
      required: true,
      disabled: isLoading,
      options: VEHICLE_COLORS.map((color) => ({ value: color, label: color })),
    },
  ];

  return (
    <DialogCs
      open={open}
      onOpenChange={onOpenChange}
      headerProps={{
        title: isEdit ? 'Editar vehículo' : 'Nuevo vehículo',
        description: '',
      }}
      footer={false}
    >
      <DynamicForm
        fields={fields}
        schema={vehicleSchema}
        defaultValues={defaultValues}
        okBtnProps={{
          children: isEdit ? 'Guardar' : 'Crear',
          isLoading,
        }}
        cancelBtnProps={{
          onClick: () => onOpenChange(false),
        }}
        onSubmit={onSubmit}
        form={form}
      />
    </DialogCs>
  );
}
