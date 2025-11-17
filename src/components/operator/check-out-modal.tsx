"use client";

import { useMutation } from "@tanstack/react-query";
import { es } from "date-fns/locale";
import { formatDistanceToNow } from "date-fns";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Car, Clock, User } from "lucide-react";
import { parkingSessionsService } from "@/services/parking-sessions.service";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ParkingSessionStatus, type ParkingSession } from "@/types";
import { useAuthStore } from "@/stores/auth.store";

interface CheckOutModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  session: ParkingSession;
  onSuccess: () => void;
}

export function CheckOutModal({
  open,
  onOpenChange,
  session,
  onSuccess,
}: CheckOutModalProps) {
  const { user } = useAuthStore();
  const { toast } = useToast();

  const checkOutMutation = useMutation({
    mutationFn: () => {
      if (!user) throw new Error("Usuario no autenticado");

      return parkingSessionsService.complete(session.id, {
        checkOutTime: new Date().toISOString(),
        checkOutUserId: user.id,
        status: ParkingSessionStatus.COMPLETED,
      });
    },
    onSuccess: () => {
      toast({
        title: "Salida registrada",
        description: `Sesión finalizada correctamente`,
      });
      onOpenChange(false);
      onSuccess();
    },
    onError: (error: any) => {
      toast({
        title: "Error al registrar salida",
        description: error.response?.data?.message || "Ocurrió un error",
        variant: "destructive",
      });
    },
  });

  const handleCheckOut = () => {
    checkOutMutation.mutate();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Información de Sesión</DialogTitle>
          <DialogDescription>
            Espacio {session.parkingSpace?.number} -{" "}
            {session.parkingSpace?.sector?.name}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="flex items-center gap-3 p-3 bg-muted rounded-lg">
            <Car className="h-5 w-5 text-muted-foreground" />
            <div className="flex-1">
              <p className="text-sm font-medium">Vehículo</p>
              <p className="text-lg font-semibold">
                {session.vehicle?.licensePlate}
              </p>
              {session.vehicle?.vehicleType && (
                <p className="text-xs text-muted-foreground">
                  {session.vehicle.vehicleType.name}
                </p>
              )}
            </div>
          </div>

          <div className="flex items-center gap-3 p-3 bg-muted rounded-lg">
            <Clock className="h-5 w-5 text-muted-foreground" />
            <div className="flex-1">
              <p className="text-sm font-medium">Hora de Entrada</p>
              <p className="text-sm">
                {new Date(session.checkInTime).toLocaleString("es-ES")}
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                Hace{" "}
                {formatDistanceToNow(new Date(session.checkInTime), {
                  locale: es,
                })}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-3 bg-muted rounded-lg">
            <User className="h-5 w-5 text-muted-foreground" />
            <div className="flex-1">
              <p className="text-sm font-medium">Usuario de Entrada</p>
              <p className="text-sm">
                {session.checkInUser?.firstName || "N/A"}
              </p>
            </div>
          </div>

          <div className="flex items-center justify-between p-3 bg-primary/10 rounded-lg">
            <span className="text-sm font-medium">Estado</span>
            <Badge
              variant={session.status === "ACTIVE" ? "default" : "secondary"}
            >
              {session.status === "ACTIVE" ? "ACTIVO" : "COMPLETADO"}
            </Badge>
          </div>
        </div>

        <div className="flex justify-end gap-2 mt-4">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={checkOutMutation.isPending}
          >
            Cerrar
          </Button>
          {session.status === "ACTIVE" && (
            <Button
              onClick={handleCheckOut}
              disabled={checkOutMutation.isPending}
            >
              {checkOutMutation.isPending && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              Finalizar Sesión
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
