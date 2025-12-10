import { z as zod } from 'zod';
import DynamicForm from '@/components/ui/custom/dynamicFormCs/DynamicForm';
import { DialogCs } from '@/components/ui/custom/dialogCs/DialogCs';
import type { VehicleType } from '@/types';

const schema = zod.object({
  name: zod.string().min(1, 'Campo requerido'),
  ratePerMinute: zod.number().min(0, 'Debe ser mayor o igual a 0'),
  description: zod.string().optional(),
});

interface VehicleTypeFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  defaultValues?: Partial<VehicleType>;
  isEdit?: boolean;
  onSubmit: (values: VehicleType) => Promise<void>;
  isLoading?: boolean;
}

export default function VehicleTypeFormDialog({
  open,
  onOpenChange,
  defaultValues = {},
  isEdit = false,
  onSubmit,
  isLoading = false,
}: VehicleTypeFormDialogProps) {
  return (
    <DialogCs
      open={open}
      onOpenChange={onOpenChange}
      headerProps={{
        title: isEdit ? 'Editar tipo de vehículo' : 'Nuevo tipo de vehículo',
        description: '',
      }}
      footer={false}
    >
      <DynamicForm
        fields={[
          { name: 'name', label: 'Nombre', type: 'text', required: true },
          {
            name: 'ratePerMinute',
            label: 'Tarifa por minuto',
            type: 'number',
            required: true,
          },
          { name: 'description', label: 'Descripción', type: 'textarea' },
        ]}
        schema={schema}
        defaultValues={defaultValues}
        okBtnProps={{ children: isEdit ? 'Guardar' : 'Crear', isLoading }}
        cancelBtnProps={{ onClick: () => onOpenChange(false) }}
        onSubmit={onSubmit}
      />
    </DialogCs>
  );
}
