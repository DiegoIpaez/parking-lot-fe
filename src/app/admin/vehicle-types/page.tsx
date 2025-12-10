'use client';

import { useState } from 'react';
import { Car, Plus, Edit, Trash2, MoreHorizontal } from 'lucide-react';
import { type ColumnDef } from '@tanstack/react-table';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

import type { PaginatedResponse, VehicleType } from '@/types';
import { vehicleTypesService } from '@/services/vehicleTypes.service';
import ButtonCs from '@/components/ui/custom/ButtonCs';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import DataTableCs from '@/components/ui/custom/DataTableCs';
import VehicleTypeFormDialog from './_components/VehicleTypeFormDialog';
import VehicleTypeDeleteDialog from './_components/VehicleTypeDeleteDialog';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import TitleAdmin from '../_components/TitleAdmin';

export default function VehicleTypesPage() {
  const queryClient = useQueryClient();
  const [openDialog, setOpenDialog] = useState(false);
  const [editRow, setEditRow] = useState<VehicleType | null>(null);
  const [deleteRow, setDeleteRow] = useState<VehicleType | null>(null);

  const { data, isLoading } = useQuery({
    queryKey: ['vehicle-types'],
    queryFn: () => vehicleTypesService.getAll(),
  });

  const columns: ColumnDef<VehicleType>[] = [
    {
      accessorKey: 'name',
      header: 'Nombre',
    },
    {
      accessorKey: 'ratePerMinute',
      header: 'Tarifa por minuto',
      cell: (info) => `$${info.getValue()}`,
    },
    {
      accessorKey: 'description',
      header: 'Descripción',
    },
    {
      id: 'actions',
      header: 'Acciones',
      cell: ({ row }) => {
        const vehicleType = row.original;
        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <ButtonCs variant="ghost" size="icon">
                <MoreHorizontal className="w-5 h-5" />
              </ButtonCs>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => setEditRow(vehicleType)}>
                <Edit className="w-4 h-4 mr-2" /> Actualizar
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => setDeleteRow(vehicleType)}
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

  const createMutation = useMutation({
    mutationFn: (values: VehicleType) => vehicleTypesService.create(values),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['vehicle-types'] });
      setOpenDialog(false);
    },
  });
  const updateMutation = useMutation({
    mutationFn: (values: VehicleType) =>
      vehicleTypesService.update(values.id, {
        name: values.name,
        ratePerMinute: values.ratePerMinute,
        description: values.description,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['vehicle-types'] });
      setEditRow(null);
    },
  });
  const deleteMutation = useMutation({
    mutationFn: (id: number) => vehicleTypesService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['vehicle-types'] });
      setDeleteRow(null);
    },
  });

  return (
    <>
      <TitleAdmin
        title="Tipos de vehículos"
        icon={<Car className="w-6 h-6" />}
        okBtnProps={{
          onClick: () => setOpenDialog(true),
          children: (
            <>
              Crear tipo <Plus />
            </>
          ),
        }}
      />
      <DataTableCs
        isLoading={isLoading}
        columns={columns}
        data={data as PaginatedResponse<VehicleType>}
        onPageChange={() => {}}
        emptyMessage="No hay tipos de vehículos"
      />
      <VehicleTypeFormDialog
        open={openDialog || !!editRow}
        onOpenChange={() => {
          setOpenDialog(false);
          setEditRow(null);
        }}
        defaultValues={
          editRow
            ? {
                name: editRow.name,
                ratePerMinute: editRow.ratePerMinute,
                description: editRow.description,
              }
            : {}
        }
        isEdit={!!editRow}
        isLoading={
          editRow
            ? updateMutation.status === 'pending'
            : createMutation.status === 'pending'
        }
        onSubmit={async (values) => {
          if (editRow)
            await updateMutation.mutateAsync({ ...editRow, ...values });
          else await createMutation.mutateAsync(values);
        }}
      />
      <VehicleTypeDeleteDialog
        open={!!deleteRow}
        onOpenChange={() => setDeleteRow(null)}
        vehicleType={deleteRow}
        isLoading={deleteMutation.status === 'pending'}
        onDelete={async () => {
          if (deleteRow) await deleteMutation.mutateAsync(deleteRow.id);
        }}
      />
    </>
  );
}
