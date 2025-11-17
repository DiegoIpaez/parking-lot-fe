'use client';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react';
import type { ParkingSession, PaginatedResponse } from '@/types';

interface SessionsTableProps {
  data: PaginatedResponse<ParkingSession>;
  onPageChange: (page: number) => void;
}

export function SessionsTable({ data, onPageChange }: SessionsTableProps) {
  const formatDate = (date: string | null | undefined) => {
    if (!date) return '-';
    return new Date(date).toLocaleString('es-ES', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const formatDuration = (minutes: number | null | undefined) => {
    if (!minutes) return '-';
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
  };

  const formatAmount = (amount: number | null | undefined) => {
    if (!amount) return '-';
    return `$${amount.toFixed(2)}`;
  };

  return (
    <div className="space-y-4">
      <div className="rounded-md border overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[60px]">ID</TableHead>
              <TableHead>Patente</TableHead>
              <TableHead>Espacio</TableHead>
              <TableHead>Sector</TableHead>
              <TableHead>Usuario Entrada</TableHead>
              <TableHead>Usuario Salida</TableHead>
              <TableHead>Entrada</TableHead>
              <TableHead>Salida</TableHead>
              <TableHead className="text-right">Duración</TableHead>
              <TableHead className="text-right">Monto</TableHead>
              <TableHead>Estado</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.data.length === 0 ? (
              <TableRow>
                <TableCell colSpan={11} className="text-center text-muted-foreground py-8">
                  No hay sesiones registradas
                </TableCell>
              </TableRow>
            ) : (
              data.data.map((session) => (
                <TableRow key={session.id}>
                  <TableCell className="font-medium">{session.id}</TableCell>
                  <TableCell className="font-semibold">
                    {session.vehicle?.licensePlate || '-'}
                  </TableCell>
                  <TableCell>{session.parkingSpace?.number || '-'}</TableCell>
                  <TableCell>
                    {session.parkingSpace?.sector?.name || '-'}
                  </TableCell>
                  <TableCell>{session.checkInUser?.firstName || '-'}</TableCell>
                  <TableCell>{session.checkOutUser?.firstName || '-'}</TableCell>
                  <TableCell className="text-sm">
                    {formatDate(session.checkInTime)}
                  </TableCell>
                  <TableCell className="text-sm">
                    {formatDate(session.checkOutTime)}
                  </TableCell>
                  <TableCell className="text-right">
                    {formatDuration(session.duration)}
                  </TableCell>
                  <TableCell className="text-right font-medium">
                    {formatAmount(session.totalAmount)}
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        session.status === 'ACTIVE' ? 'default' : 'secondary'
                      }
                    >
                      {session.status === 'ACTIVE' ? 'ACTIVO' : 'COMPLETADO'}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {data.totalPages > 1 && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            Página {data.currentPage} de {data.totalPages} ({data.totalRecords}{' '}
            registros totales)
          </p>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="icon"
              onClick={() => onPageChange(1)}
              disabled={data.currentPage === 1}
            >
              <ChevronsLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={() => onPageChange(data.currentPage - 1)}
              disabled={data.currentPage === 1}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={() => onPageChange(data.currentPage + 1)}
              disabled={!data.hasNextPage}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={() => onPageChange(data.totalPages)}
              disabled={!data.hasNextPage}
            >
              <ChevronsRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
