import { DialogCs } from '@/components/ui/custom/dialogCs/DialogCs';
import type { Vehicle } from '@/types';

interface VehicleDeleteDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  vehicle?: Vehicle | null;
  onDelete: () => Promise<void>;
  isLoading?: boolean;
}

export default function VehicleDeleteDialog({
  open,
  onOpenChange,
  vehicle,
  onDelete,
  isLoading = false,
}: VehicleDeleteDialogProps) {
  return (
    <DialogCs
      open={open}
      onOpenChange={onOpenChange}
      headerProps={{
        title: 'Eliminar vehículo',
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
          ¿Seguro que deseas eliminar el vehículo con patente{' '}
          <b>{vehicle?.licensePlate}</b>?
        </p>
      </div>
    </DialogCs>
  );
}
