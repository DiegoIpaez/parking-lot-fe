'use client';

import { useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { parkingSessionsService } from '@/services/parking-sessions.service';
import type {
  PaginatedResponse,
  ParkingSession,
  ParkingSessionFilters,
} from '@/types';
import { Topbar } from '@/components/topbar';
import SpinnerCs from '@/components/ui/custom/SpinnerCs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FiltersForm } from './_components/FiltersForm';
import { SessionsTable } from './_components/SessionsTable';

export default function AdminPage() {
  const queryClient = useQueryClient();
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

  const handleRefresh = () => {
    queryClient.invalidateQueries({ queryKey: ['parking-sessions'] });
  };

  return (
    <div className="min-h-screen bg-background">
      <Topbar />
      <div className="container mx-auto px-4 py-8">
        <Card>
          <CardHeader>
            <CardTitle>Historial de Sesiones</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <FiltersForm onFiltersChange={handleFiltersChange} />
            {isLoading ? (
              <div className="flex items-center justify-center py-12">
                <SpinnerCs className="h-8 w-8" />
              </div>
            ) : data ? (
              <SessionsTable
                data={data as PaginatedResponse<ParkingSession>}
                onPageChange={handlePageChange}
              />
            ) : null}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
