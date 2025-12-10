import { z as zod } from 'zod';
import DynamicForm from '@/components/ui/custom/dynamicFormCs/DynamicForm';
import { DialogCs } from '@/components/ui/custom/dialogCs/DialogCs';
import type { User } from '@/types';
import { UserRole } from '@/types';

const schema = zod.object({
  firstName: zod.string().min(1, 'Campo requerido'),
  lastName: zod.string().min(1, 'Campo requerido'),
  email: zod.string().email('Email inválido').min(1, 'Campo requerido'),
  role: zod.nativeEnum(UserRole),
  isActive: zod.boolean(),
  password: zod.string().optional(),
});

interface UserFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  defaultValues?: Partial<User & { password?: string }>;
  isEdit?: boolean;
  onSubmit: (values: User & { password?: string }) => Promise<void>;
  isLoading?: boolean;
}

export default function UserFormDialog({
  open,
  onOpenChange,
  defaultValues = {},
  isEdit = false,
  onSubmit,
  isLoading = false,
}: UserFormDialogProps) {
  return (
    <DialogCs
      open={open}
      onOpenChange={onOpenChange}
      headerProps={{
        title: isEdit ? 'Editar usuario' : 'Nuevo usuario',
        description: '',
      }}
      footer={false}
    >
      <DynamicForm
        fields={[
          { name: 'firstName', label: 'Nombre', type: 'text', required: true },
          { name: 'lastName', label: 'Apellido', type: 'text', required: true },
          { name: 'email', label: 'Email', type: 'email', required: true },
          {
            name: 'role',
            label: 'Rol',
            type: 'select',
            required: true,
            options: [
              { value: UserRole.ADMIN, label: 'Administrador' },
              { value: UserRole.OPERATOR, label: 'Operador' },
            ],
          },
          {
            name: 'isActive',
            label: 'Activo',
            type: 'checkbox',
          },
          {
            name: 'password',
            label: 'Contraseña',
            type: 'password',
            required: !isEdit,
          },
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
