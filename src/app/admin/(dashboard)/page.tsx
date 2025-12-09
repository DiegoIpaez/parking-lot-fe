'use client';

import { useMemo, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { type ColumnDef } from '@tanstack/react-table';
import { parkingSessionsService } from '@/services/parking-sessions.service';
import type {
  PaginatedResponse,
  ParkingSession,
  ParkingSessionFilters,
} from '@/types';
import { TableCs } from '@/components/ui/custom/TableCs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FiltersForm } from './_components/FiltersForm';
import { parkingSessionsColumns } from './_tables/parkingSessions.column';

export default function AdminPage() {
  const columns = useMemo<ColumnDef<ParkingSession>[]>(
    () => parkingSessionsColumns,
    []
  );
  const [filters, setFilters] = useState<ParkingSessionFilters>({
    page: 1,
    limit: 10,
  });

  const { data, isLoading } = useQuery({
    queryKey: ['parking-sessions', filters],
    queryFn: () => parkingSessionsService.getAll(filters),
  });

  const handleFiltersChange = (newFilters: ParkingSessionFilters) => {
    setFilters({ ...newFilters, limit: filters.limit });
  };

  const handlePageChange = (page: number) => {
    setFilters((prev) => ({ ...prev, page }));
  };

  return (
    <div className="container mx-auto px-4 pb-8">
      <Card>
        <CardHeader>
          <CardTitle>Historial de Sesiones</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <FiltersForm onFiltersChange={handleFiltersChange} />
          <TableCs
            isLoading={isLoading}
            columns={columns}
            data={data as PaginatedResponse<ParkingSession>}
            onPageChange={handlePageChange}
          />
        </CardContent>
      </Card>
    </div>
  );
}
