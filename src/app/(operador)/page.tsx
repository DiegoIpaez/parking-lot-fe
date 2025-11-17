"use client";

import { Loader2 } from "lucide-react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { sectorsService } from "@/services/sectors.service";
import { Topbar } from "@/components/topbar";
import { SectorCard } from "@/components/operator/sector-card";

export default function OperatorDashboard() {
  const queryClient = useQueryClient();

  const { data = [], isLoading } = useQuery({
    queryKey: ["sectors"],
    queryFn: sectorsService.getAll,
    select: (data) => data.data,
  });

  const handleRefresh = () => {
    queryClient.invalidateQueries();
  };

  return (
    <div className="min-h-screen bg-background">
      <Topbar onRefresh={handleRefresh} />

      <main className="container mx-auto px-4 py-8">
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin" />
          </div>
        ) : data.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No hay sectores disponibles</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {data?.map?.((sector) => (
              <SectorCard key={sector.id} sector={sector} />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
