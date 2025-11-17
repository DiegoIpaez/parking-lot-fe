'use client';

import { useRouter } from 'next/navigation';
import { LogOut, ParkingSquare, RefreshCw } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { UserRole } from '@/types';
import { useAuthStore } from '@/stores/auth.store';
import ButtonCs from './ui/custom/ButtonCs';
import { useQueryClient } from '@tanstack/react-query';

export function Topbar() {
  const queryClient = useQueryClient();
  const { user, logout } = useAuthStore();
  const router = useRouter();

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  const handleRefresh = () => {
    queryClient.invalidateQueries();
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between px-4">
        <div className="flex items-center gap-3">
          <ParkingSquare className="h-6 w-6 text-primary" />
          <h1 className="text-xl font-semibold">Sistema de Estacionamiento</h1>
        </div>
        <div className="flex items-center gap-4">
          <ButtonCs variant="outline" size="sm" onClick={handleRefresh}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Actualizar
          </ButtonCs>
          <div className="flex items-center gap-3">
            <div className="text-right">
              <p className="text-sm font-medium">
                {user?.firstName} {user?.lastName}
              </p>
              <Badge
                variant={
                  user?.role === UserRole.ADMIN ? 'default' : 'secondary'
                }
                className="text-xs"
              >
                {user?.role}
              </Badge>
            </div>
            <ButtonCs
              variant="ghost"
              size="icon"
              onClick={() => handleLogout()}
              title="Cerrar sesión"
            >
              <LogOut className="h-5 w-5" />
            </ButtonCs>
          </div>
        </div>
      </div>
    </header>
  );
}
