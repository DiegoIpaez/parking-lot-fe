'use client';

import clsx from 'clsx';
import { CircleCheck, Clock } from 'lucide-react';
import { formatAmount } from '@/utils/formatters/currency.formatter';
import { formatDate, formatDuration } from '@/utils/formatters/time.formatter';
import {
  type ParkingSession,
  type PaginatedResponse,
  ParkingSessionStatus,
} from '@/types';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import PaginationCs from '@/components/ui/custom/PaginationCs';

interface SessionsTableProps {
  data: PaginatedResponse<ParkingSession>;
  onPageChange: (page: number) => void;
}

export function SessionsTable({ data, onPageChange }: SessionsTableProps) {
  return (
    <div className="space-y-4">
      <div className="rounded-md border overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Patente</TableHead>
              <TableHead>Sector/Espacio</TableHead>
              <TableHead>Usuario Entrada</TableHead>
              <TableHead>Entrada</TableHead>
              <TableHead>Usuario Salida</TableHead>
              <TableHead>Salida</TableHead>
              <TableHead className="text-right">Duración</TableHead>
              <TableHead className="text-right">Monto</TableHead>
              <TableHead>Estado</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.data.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={11}
                  className="text-center text-muted-foreground py-8"
                >
                  No hay sesiones registradas
                </TableCell>
              </TableRow>
            ) : (
              data.data.map((session) => (
                <TableRow key={session.id}>
                  <TableCell className="font-semibold">
                    <Badge>{session.vehicle?.licensePlate || '-'}</Badge>
                  </TableCell>
                  <TableCell>
                    <Badge>
                      {session.parkingSpace?.sector?.name || '-'}
                      {session.parkingSpace?.number || '-'}
                    </Badge>
                  </TableCell>
                  <TableCell>{session.checkInUser?.email || '-'}</TableCell>
                  <TableCell className="text-sm">
                    {formatDate(session.checkInTime)}
                  </TableCell>
                  <TableCell>{session.checkOutUser?.email || '-'}</TableCell>
                  <TableCell className="text-sm">
                    {formatDate(session.checkOutTime)}
                  </TableCell>
                  <TableCell className="text-right">
                    {formatDuration({
                      checkInTime: session.checkInTime,
                      checkOutTime: session.checkOutTime,
                    })}
                  </TableCell>
                  <TableCell className="text-right font-medium">
                    {formatAmount(session.totalAmount)}
                  </TableCell>
                  <TableCell>
                    <Badge
                      className={clsx({
                        'bg-green-400 text-green-800':
                          session.status === ParkingSessionStatus.COMPLETED,
                        'bg-blue-400 text-blue-800':
                          session.status === ParkingSessionStatus.ACTIVE,
                      })}
                    >
                      {session.status === ParkingSessionStatus.ACTIVE ? (
                        <Clock />
                      ) : (
                        <CircleCheck />
                      )}
                      {session.status === ParkingSessionStatus.ACTIVE
                        ? 'ACTIVO'
                        : 'COMPLETADO'}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
      <PaginationCs data={data} onPageChange={onPageChange} />
    </div>
  );
}
