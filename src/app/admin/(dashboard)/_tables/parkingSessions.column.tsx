'use client';

import clsx from 'clsx';
import { CircleCheck, Clock } from 'lucide-react';
import { type ColumnDef } from '@tanstack/react-table';

import { formatAmount } from '@/utils/formatters/currency.formatter';
import { formatDate, formatDuration } from '@/utils/formatters/time.formatter';
import { type ParkingSession, ParkingSessionStatus } from '@/types';
import { Badge } from '@/components/ui/badge';

export const parkingSessionsColumns: ColumnDef<ParkingSession>[] = [
  {
    accessorKey: 'vehicle.licensePlate',
    header: 'Patente',
    cell: (info) => (
      <Badge>{info.row.original.vehicle?.licensePlate || '-'}</Badge>
    ),
  },
  {
    accessorKey: 'parkingSpace',
    header: 'Sector/Espacio',
    cell: (info) => (
      <Badge>
        {info.row.original.parkingSpace?.sector?.name || '-'}
        {info.row.original.parkingSpace?.number || '-'}
      </Badge>
    ),
  },
  {
    accessorKey: 'checkInUser.email',
    header: 'Usuario Entrada',
    cell: (info) => info.row.original.checkInUser?.email || '-',
  },
  {
    accessorKey: 'checkInTime',
    header: 'Entrada',
    cell: (info) => (
      <span className="text-sm">
        {formatDate(info.row.original.checkInTime)}
      </span>
    ),
  },
  {
    accessorKey: 'checkOutUser.email',
    header: 'Usuario Salida',
    cell: (info) => info.row.original.checkOutUser?.email || '-',
  },
  {
    accessorKey: 'checkOutTime',
    header: 'Salida',
    cell: (info) => (
      <span className="text-sm">
        {formatDate(info.row.original.checkOutTime)}
      </span>
    ),
  },
  {
    accessorKey: 'duration',
    header: () => <span className="text-right">Duración</span>,
    cell: (info) => (
      <span className="text-right">
        {formatDuration({
          checkInTime: info.row.original.checkInTime,
          checkOutTime: info.row.original.checkOutTime,
        })}
      </span>
    ),
  },
  {
    accessorKey: 'totalAmount',
    header: () => <span className="text-right">Monto</span>,
    cell: (info) => (
      <span className="text-right font-medium">
        {formatAmount(info.row.original.totalAmount)}
      </span>
    ),
  },
  {
    accessorKey: 'status',
    header: 'Estado',
    cell: (info) => (
      <Badge
        className={clsx({
          'bg-green-400 text-green-800':
            info.row.original.status === ParkingSessionStatus.COMPLETED,
          'bg-blue-400 text-blue-800':
            info.row.original.status === ParkingSessionStatus.ACTIVE,
        })}
      >
        {info.row.original.status === ParkingSessionStatus.ACTIVE ? (
          <Clock />
        ) : (
          <CircleCheck />
        )}
        {info.row.original.status === ParkingSessionStatus.ACTIVE
          ? 'ACTIVO'
          : 'COMPLETADO'}
      </Badge>
    ),
  },
];
