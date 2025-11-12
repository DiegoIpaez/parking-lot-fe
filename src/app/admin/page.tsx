"use client";

import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { parkingSessionsService } from "@/services/parking-sessions.service";
import { ProtectedRoute } from "@/components/protected-route";
import { Topbar } from "@/components/topbar";
import { FiltersForm } from "@/components/admin/filters-form";
import { SessionsTable } from "@/components/admin/sessions-table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import type { PaginatedResponse, ParkingSession, ParkingSessionFilters } from "@/types";

function AdminContent() {
  const queryClient = useQueryClient();
  const [filters, setFilters] = useState<ParkingSessionFilters>({
    page: 1,
    limit: 10,
  });

  const { data, isLoading } = useQuery({
    queryKey: ["parking-sessions", filters],
    queryFn: () => parkingSessionsService.getAll(filters),
  });

  const handleFiltersChange = (newFilters: ParkingSessionFilters) => {
    setFilters({ ...newFilters, limit: filters.limit });
  };

  const handlePageChange = (page: number) => {
    setFilters((prev) => ({ ...prev, page }));
  };

  const handleRefresh = () => {
    queryClient.invalidateQueries({ queryKey: ["parking-sessions"] });
  };

  return (
    <div className="min-h-screen bg-background">
      <Topbar onRefresh={handleRefresh} />

      <main className="container mx-auto px-4 py-8">
        <Card>
          <CardHeader>
            <CardTitle>Historial de Sesiones</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <FiltersForm onFiltersChange={handleFiltersChange} />

            {isLoading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin" />
              </div>
            ) : data ? (
              <SessionsTable data={data as PaginatedResponse<ParkingSession>} onPageChange={handlePageChange} />
            ) : null}
          </CardContent>
        </Card>
      </main>
    </div>
  );
}

export default function AdminPage() {
  return (
    <ProtectedRoute allowedRoles={["ADMIN"]}>
      <AdminContent />
    </ProtectedRoute>
  );
}
