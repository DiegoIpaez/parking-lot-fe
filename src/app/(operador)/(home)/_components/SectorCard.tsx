'use client';

import { useQuery } from '@tanstack/react-query';
import { parkingSessionsService } from '@/services/parking-sessions.service';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';
import { ParkingSessionStatus, type Sector } from '@/types';
import { ParkingSpaceItem } from './ParkingSpaceItem';

type SectorCardProps = {
  sector: Sector;
};

export function SectorCard({ sector }: SectorCardProps) {
  const {
    data: activeSessions = [],
    isLoading: loadingSessions,
    refetch: refetchSessions,
  } = useQuery({
    queryKey: ['parking-sessions-active'],
    queryFn: () =>
      parkingSessionsService.getAll({ status: ParkingSessionStatus.ACTIVE }),
    select: (data) => data?.data,
  });

  const handleUpdate = () => {
    refetchSessions();
  };

  const getSessionForSpace = (spaceId: number) => {
    return activeSessions.find((session) => session.parkingSpaceId === spaceId);
  };

  const occupiedCount = sector?.parkingSpaces?.filter((space) =>
    getSessionForSpace(space.id)
  ).length;
  const totalCount = sector?.parkingSpaces?.length;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>{sector.name}</span>
          <span className="text-sm font-normal text-muted-foreground">
            {occupiedCount}/{totalCount} ocupados
          </span>
        </CardTitle>
        {sector.description && (
          <p className="text-sm text-muted-foreground">{sector.description}</p>
        )}
      </CardHeader>
      <CardContent>
        {loadingSessions ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-6 w-6 animate-spin" />
          </div>
        ) : sector?.parkingSpaces?.length === 0 ? (
          <p className="text-center text-sm text-muted-foreground py-4">
            No hay espacios en este sector
          </p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {sector?.parkingSpaces?.map((space) => (
              <ParkingSpaceItem
                key={space.id}
                space={space}
                session={getSessionForSpace(space.id)}
                onUpdate={handleUpdate}
              />
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
