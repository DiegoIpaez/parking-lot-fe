"use client";

import { useRouter } from "next/navigation";
import { LogOut, RefreshCw, ParkingSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { UserRole } from "@/types";
import { useAuthStore } from "@/stores/auth.store";

interface TopbarProps {
  onRefresh?: () => void;
}

export function Topbar({ onRefresh }: TopbarProps) {
  const { user, logout } = useAuthStore();
  const router = useRouter();

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between px-4">
        <div className="flex items-center gap-3">
          <ParkingSquare className="h-6 w-6 text-primary" />
          <h1 className="text-xl font-semibold">Sistema de Estacionamiento</h1>
        </div>

        <div className="flex items-center gap-4">
          {onRefresh && (
            <Button variant="outline" size="sm" onClick={onRefresh}>
              <RefreshCw className="h-4 w-4 mr-2" />
              Actualizar
            </Button>
          )}

          <div className="flex items-center gap-3">
            <div className="text-right">
              <p className="text-sm font-medium">{user?.name}</p>
              <Badge
                variant={
                  user?.role === UserRole.ADMIN ? "default" : "secondary"
                }
                className="text-xs"
              >
                {user?.role}
              </Badge>
            </div>

            <Button
              variant="ghost"
              size="icon"
              onClick={handleLogout}
              title="Cerrar sesión"
            >
              <LogOut className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}
