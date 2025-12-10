import { DialogCs } from '@/components/ui/custom/dialogCs/DialogCs';
import type { User } from '@/types';

interface UserDeleteDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  user?: User | null;
  onDelete: () => Promise<void>;
  isLoading?: boolean;
}

export default function UserDeleteDialog({
  open,
  onOpenChange,
  user,
  onDelete,
  isLoading = false,
}: UserDeleteDialogProps) {
  return (
    <DialogCs
      open={open}
      onOpenChange={onOpenChange}
      headerProps={{
        title: 'Eliminar usuario',
        description: 'Esta acción no se puede deshacer.',
      }}
      okBtnProps={{
        className: 'bg-destructive border-destructive hover:bg-destructive/90',
        children: 'Eliminar',
        type: 'button',
        isLoading,
        onClick: onDelete,
      }}
      cancelBtnProps={{
        onClick: () => onOpenChange(false),
      }}
    >
      <div className="space-y-4">
        <p>
          ¿Seguro que deseas eliminar el usuario{' '}
          <b>
            {user?.firstName} {user?.lastName}
          </b>
          ?
        </p>
      </div>
    </DialogCs>
  );
}
