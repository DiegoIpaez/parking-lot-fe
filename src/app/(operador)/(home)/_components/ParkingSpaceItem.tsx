'use client';

import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import type { ParkingSpace, ParkingSession } from '@/types';
import { CheckInModal } from './CheckInModal';
import { CheckOutModal } from './CheckOutModal';

interface ParkingSpaceItemProps {
  space: ParkingSpace;
  session?: ParkingSession;
  onUpdate: () => void;
}

export function ParkingSpaceItem({
  space,
  session,
  onUpdate,
}: ParkingSpaceItemProps) {
  const [checkInOpen, setCheckInOpen] = useState(false);
  const [checkOutOpen, setCheckOutOpen] = useState(false);

  const isOccupied = session && session.status === 'ACTIVE';

  const handleClick = () => {
    if (isOccupied) {
      setCheckOutOpen(true);
    } else {
      setCheckInOpen(true);
    }
  };

  return (
    <>
      <Card
        className={cn(
          'p-4 cursor-pointer transition-all hover:shadow-md',
          isOccupied
            ? 'bg-red-950/30 border-red-900 hover:bg-red-950/40'
            : 'bg-green-950/30 border-green-900 hover:bg-green-950/40'
        )}
        onClick={handleClick}
      >
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-lg font-semibold">{space.number}</span>
              <Badge
                variant={isOccupied ? 'destructive' : 'default'}
                className={cn(
                  isOccupied
                    ? ''
                    : 'bg-green-700 hover:bg-green-800 text-white'
                )}
              >
                {isOccupied ? 'OCUPADO' : 'LIBRE'}
              </Badge>
            </div>
            {isOccupied && session?.vehicle && (
              <p className="text-sm text-muted-foreground">
                {session.vehicle.licensePlate}
              </p>
            )}
          </div>
        </div>
      </Card>

      {!isOccupied && (
        <CheckInModal
          open={checkInOpen}
          onOpenChange={setCheckInOpen}
          parkingSpace={space}
          onSuccess={onUpdate}
        />
      )}

      {isOccupied && session && (
        <CheckOutModal
          open={checkOutOpen}
          onOpenChange={setCheckOutOpen}
          session={session}
          onSuccess={onUpdate}
        />
      )}
    </>
  );
}
