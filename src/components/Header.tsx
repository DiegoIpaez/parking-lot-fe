'use client';

import { useRouter } from 'next/navigation';
import { ParkingSquare, RefreshCw } from 'lucide-react';
import { UserRole } from '@/types';
import { useAuthStore } from '@/stores/auth.store';
import ButtonCs from './ui/custom/ButtonCs';
import { useQueryClient } from '@tanstack/react-query';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import { UserCog, LogOut as LogOutIcon } from 'lucide-react';
import { getInitials } from '@/utils/user.util';
import Link from 'next/link';

export function Header() {
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
        <Link href={'/'} className="flex items-center gap-3">
          <ParkingSquare className="h-6 w-6 text-primary" />
          <h1 className="text-xl font-semibold">ParkingLot</h1>
        </Link>
        <div className="flex items-center gap-4">
          <ButtonCs variant="outline" size="sm" onClick={handleRefresh}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Actualizar
          </ButtonCs>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Avatar className="h-10 w-10 border border-muted-foreground/20 cursor-pointer">
                <AvatarFallback>
                  {getInitials({
                    firstName: user?.firstName || '',
                    lastName: user?.lastName || '',
                  })}
                </AvatarFallback>
              </Avatar>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="min-w-[180px]">
              <div className="px-3 py-2">
                <p className="text-sm text-center font-medium">
                  {user?.firstName} {user?.lastName}
                </p>
              </div>
              <DropdownMenuSeparator />
              {user?.role === UserRole.ADMIN && (
                <DropdownMenuItem onClick={() => router.push('/admin')}>
                  <UserCog className="mr-2 h-4 w-4" />
                  Panel Admin
                </DropdownMenuItem>
              )}
              <DropdownMenuItem onClick={handleLogout}>
                <LogOutIcon className="mr-2 h-4 w-4" />
                Cerrar sesión
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}
