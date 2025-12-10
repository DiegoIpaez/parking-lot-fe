'use client';

import { useState } from 'react';
import { Users, Plus, Edit, Trash2, MoreHorizontal } from 'lucide-react';
import { type ColumnDef } from '@tanstack/react-table';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

import type { PaginatedResponse, User } from '@/types';
import { usersService } from '@/services/users.service';
import ButtonCs from '@/components/ui/custom/ButtonCs';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import DataTableCs from '@/components/ui/custom/DataTableCs';
import UserFormDialog from './_components/UserFormDialog';
import UserDeleteDialog from './_components/UserDeleteDialog';
import TitleAdmin from '../_components/TitleAdmin';
import { Badge } from '@/components/ui/badge';

export default function UsersPage() {
  const queryClient = useQueryClient();
  const [openDialog, setOpenDialog] = useState(false);
  const [editRow, setEditRow] = useState<User | null>(null);
  const [deleteRow, setDeleteRow] = useState<User | null>(null);

  const { data, isLoading } = useQuery({
    queryKey: ['users'],
    queryFn: () => usersService.getAll(),
  });

  const columns: ColumnDef<User>[] = [
    {
      accessorKey: 'firstName',
      header: 'Nombre',
    },
    {
      accessorKey: 'lastName',
      header: 'Apellido',
    },
    {
      accessorKey: 'email',
      header: 'Email',
    },
    {
      accessorKey: 'role',
      header: 'Rol',
      cell: (info) => {
        const role = info.getValue() as string;
        return (
          <Badge variant={role === 'ADMIN' ? 'default' : 'secondary'}>
            {role === 'ADMIN' ? 'Administrador' : 'Operador'}
          </Badge>
        );
      },
    },
    {
      accessorKey: 'isActive',
      header: 'Estado',
      cell: (info) => {
        const isActive = info.getValue() as boolean;
        return (
          <Badge variant={isActive ? 'default' : 'destructive'}>
            {isActive ? 'Activo' : 'Inactivo'}
          </Badge>
        );
      },
    },
    {
      id: 'actions',
      header: 'Acciones',
      cell: ({ row }) => {
        const user = row.original;
        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <ButtonCs variant="ghost" size="icon">
                <MoreHorizontal className="w-5 h-5" />
              </ButtonCs>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => setEditRow(user)}>
                <Edit className="w-4 h-4 mr-2" /> Actualizar
              </DropdownMenuItem>
              {user?.isActive && (
                <DropdownMenuItem
                  onClick={() => setDeleteRow(user)}
                  className="text-destructive"
                >
                  <Trash2 className="w-4 h-4 mr-2" /> Eliminar
                </DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];

  const createMutation = useMutation({
    mutationFn: (values: User & { password?: string }) =>
      usersService.create({
        firstName: values.firstName,
        lastName: values.lastName,
        email: values.email,
        role: values.role,
        isActive: values.isActive,
        password: values.password,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      setOpenDialog(false);
    },
  });
  const updateMutation = useMutation({
    mutationFn: (values: User & { password?: string }) =>
      usersService.update(values.id, {
        firstName: values.firstName,
        lastName: values.lastName,
        email: values.email,
        role: values.role,
        isActive: values.isActive,
        ...(values.password && { password: values.password }),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      setEditRow(null);
    },
  });
  const deleteMutation = useMutation({
    mutationFn: (id: number) => usersService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      setDeleteRow(null);
    },
  });

  return (
    <>
      <TitleAdmin
        title="Usuarios"
        icon={<Users className="w-6 h-6" />}
        okBtnProps={{
          onClick: () => setOpenDialog(true),
          children: (
            <>
              Crear usuario <Plus />
            </>
          ),
        }}
      />
      <DataTableCs
        isLoading={isLoading}
        columns={columns}
        data={data as PaginatedResponse<User>}
        onPageChange={() => {}}
        emptyMessage="No hay usuarios"
      />
      <UserFormDialog
        open={openDialog || !!editRow}
        onOpenChange={() => {
          setOpenDialog(false);
          setEditRow(null);
        }}
        defaultValues={
          editRow
            ? {
                firstName: editRow.firstName,
                lastName: editRow.lastName,
                email: editRow.email,
                role: editRow.role,
                isActive: editRow.isActive,
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
      <UserDeleteDialog
        open={!!deleteRow}
        onOpenChange={() => setDeleteRow(null)}
        user={deleteRow}
        isLoading={deleteMutation.status === 'pending'}
        onDelete={async () => {
          if (deleteRow) await deleteMutation.mutateAsync(deleteRow.id);
        }}
      />
    </>
  );
}
