import { DialogCs } from '@/components/ui/custom/dialogCs/DialogCs';
import type { VehicleType } from '@/types';

interface VehicleTypeDeleteDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  vehicleType?: VehicleType | null;
  onDelete: () => Promise<void>;
  isLoading?: boolean;
}

export default function VehicleTypeDeleteDialog({
  open,
  onOpenChange,
  vehicleType,
  onDelete,
  isLoading = false,
}: VehicleTypeDeleteDialogProps) {
  return (
    <DialogCs
      open={open}
      onOpenChange={onOpenChange}
      headerProps={{
        title: 'Eliminar tipo de vehículo',
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
          ¿Seguro que deseas eliminar el tipo <b>{vehicleType?.name}</b>?
        </p>
      </div>
    </DialogCs>
  );
}
