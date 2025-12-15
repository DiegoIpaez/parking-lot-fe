'use client';

import { useState } from 'react';
import { Car, Plus, Edit, Trash2, MoreHorizontal } from 'lucide-react';
import { type ColumnDef } from '@tanstack/react-table';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

import type { PaginatedResponse, Vehicle, ListQueryParams } from '@/types';
import { vehiclesService } from '@/services/vehicles.service';
import ButtonCs from '@/components/ui/custom/ButtonCs';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import DataTableCs from '@/components/ui/custom/DataTableCs';
import VehicleFormDialog from './_components/VehicleFormDialog';
import VehicleDeleteDialog from './_components/VehicleDeleteDialog';
import TitleAdmin from '../_components/TitleAdmin';

type VehicleFilters = ListQueryParams;

export default function VehiclesPage() {
  const queryClient = useQueryClient();
  const [openDialog, setOpenDialog] = useState(false);
  const [editRow, setEditRow] = useState<Vehicle | null>(null);
  const [deleteRow, setDeleteRow] = useState<Vehicle | null>(null);
  const [filters, setFilters] = useState<VehicleFilters>({
    page: 1,
    limit: 10,
  });

  const { data, isLoading } = useQuery({
    queryKey: ['vehicles', filters],
    queryFn: () => vehiclesService.getAll(filters),
  });

  const columns: ColumnDef<Vehicle>[] = [
    {
      accessorKey: 'licensePlate',
      header: 'Patente',
    },
    {
      accessorKey: 'vehicleModel.vehicleBrand.name',
      header: 'Marca',
      cell: (info) => {
        const vehicle = info.row.original;
        return vehicle.vehicleModel?.vehicleBrand?.name || '-';
      },
    },
    {
      accessorKey: 'vehicleModel.name',
      header: 'Modelo',
      cell: (info) => {
        const vehicle = info.row.original;
        return vehicle.vehicleModel?.name || '-';
      },
    },
    {
      accessorKey: 'vehicleModel.vehicleType.name',
      header: 'Tipo',
      cell: (info) => {
        const vehicle = info.row.original;
        return vehicle.vehicleModel?.vehicleType?.name || '-';
      },
    },
    {
      accessorKey: 'color',
      header: 'Color',
    },
    {
      id: 'actions',
      header: 'Acciones',
      cell: ({ row }) => {
        const vehicle = row.original;
        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <ButtonCs variant="ghost" size="icon">
                <MoreHorizontal className="w-5 h-5" />
              </ButtonCs>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => setEditRow(vehicle)}>
                <Edit className="w-4 h-4 mr-2" /> Actualizar
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => setDeleteRow(vehicle)}
                className="text-destructive"
              >
                <Trash2 className="w-4 h-4 mr-2" /> Eliminar
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];

  const handlePageChange = (page: number) => {
    setFilters((prev) => ({ ...prev, page }));
  };

  const createMutation = useMutation({
    mutationFn: (values: {
      licensePlate: string;
      vehicleBrandId: number;
      vehicleModelId: number;
      color: string;
    }) =>
      vehiclesService.create({
        licensePlate: values.licensePlate,
        vehicleModelId: values.vehicleModelId,
        color: values.color,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['vehicles'] });
      setOpenDialog(false);
    },
  });

  const updateMutation = useMutation({
    mutationFn: (values: {
      id: number;
      licensePlate: string;
      vehicleBrandId: number;
      vehicleModelId: number;
      color: string;
    }) =>
      vehiclesService.update(values.id, {
        licensePlate: values.licensePlate,
        vehicleModelId: values.vehicleModelId,
        color: values.color,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['vehicles'] });
      setEditRow(null);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => vehiclesService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['vehicles'] });
      setDeleteRow(null);
    },
  });

  const getDefaultValues = (vehicle: Vehicle | null) => {
    if (!vehicle) return {};
    return {
      licensePlate: vehicle.licensePlate,
      vehicleBrandId: vehicle.vehicleModel?.vehicleBrand?.id || 0,
      vehicleModelId: vehicle.vehicleModelId,
      color: vehicle.color,
    };
  };

  return (
    <>
      <TitleAdmin
        title="Vehículos"
        icon={<Car className="w-6 h-6" />}
        okBtnProps={{
          onClick: () => setOpenDialog(true),
          children: (
            <>
              Crear vehículo <Plus />
            </>
          ),
        }}
      />
      <DataTableCs
        isLoading={isLoading}
        columns={columns}
        data={data as PaginatedResponse<Vehicle>}
        onPageChange={handlePageChange}
        emptyMessage="No hay vehículos"
      />
      <VehicleFormDialog
        open={openDialog || !!editRow}
        onOpenChange={() => {
          setOpenDialog(false);
          setEditRow(null);
        }}
        defaultValues={getDefaultValues(editRow)}
        isEdit={!!editRow}
        isLoading={
          editRow
            ? updateMutation.status === 'pending'
            : createMutation.status === 'pending'
        }
        onSubmit={async (values) => {
          if (editRow) {
            await updateMutation.mutateAsync({
              id: editRow.id,
              ...values,
            });
          } else {
            await createMutation.mutateAsync(values);
          }
        }}
      />
      <VehicleDeleteDialog
        open={!!deleteRow}
        onOpenChange={() => setDeleteRow(null)}
        vehicle={deleteRow}
        isLoading={deleteMutation.status === 'pending'}
        onDelete={async () => {
          if (deleteRow) await deleteMutation.mutateAsync(deleteRow.id);
        }}
      />
    </>
  );
}
