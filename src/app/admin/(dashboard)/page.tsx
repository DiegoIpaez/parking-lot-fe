'use client';

import { useMemo, useState } from 'react';
import { ChartSpline } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { type ColumnDef } from '@tanstack/react-table';

import { parkingSessionsService } from '@/services/parking-sessions.service';
import type {
  PaginatedResponse,
  ParkingSession,
  ParkingSessionFilters,
} from '@/types';
import DataTableCs from '@/components/ui/custom/DataTableCs';
import TitleAdmin from '../_components/TitleAdmin';
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
    <>
      <TitleAdmin
        title="Historial de Sesiones"
        icon={<ChartSpline className="w-6 h-6" />}
      />
      <div className="space-y-4">
        <FiltersForm onFiltersChange={handleFiltersChange} />
        <DataTableCs
          isLoading={isLoading}
          columns={columns}
          data={data as PaginatedResponse<ParkingSession>}
          onPageChange={handlePageChange}
        />
      </div>
    </>
  );
}
