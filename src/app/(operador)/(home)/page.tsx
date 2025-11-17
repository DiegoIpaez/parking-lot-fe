'use client';

import { useQuery } from '@tanstack/react-query';
import { sectorsService } from '@/services/sectors.service';
import SpinnerCs from '@/components/ui/custom/SpinnerCs';
import { SectorCard } from './_components/SectorCard';

export default function OperatorDashboard() {
  const { data = [], isLoading } = useQuery({
    queryKey: ['sectors'],
    queryFn: sectorsService.getAll,
    select: (data) => data.data,
  });

  return (
    <div className="container mx-auto px-4 py-8">
      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <SpinnerCs className="h-8 w-8" />
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
    </div>
  );
}
