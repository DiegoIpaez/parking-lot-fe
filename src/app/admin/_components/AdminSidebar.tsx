'use client';
import { Car, ChartSpline, CircleParking, Home, Users } from 'lucide-react';
import { SidebarMenuItemProps } from '@/types';
import SidebarCs from '@/components/ui/custom/sidebarCs/SidebarCs';
import { NavUser } from './NavUser';

const items: SidebarMenuItemProps[] = [
  {
    title: 'Inicio',
    url: '/',
    icon: Home,
    disabled: false,
  },
  {
    title: 'Dashboard',
    url: '/admin',
    icon: ChartSpline,
    disabled: false,
  },
  {
    title: 'Usuarios',
    url: '/admin/users',
    icon: Users,
    disabled: true,
  },
  {
    title: 'Sectores y espacios',
    url: '/admin/sectors',
    icon: CircleParking,
    disabled: true,
  },
  {
    title: 'Vehiculos',
    url: '/admin/vehicles',
    icon: Car,
    disabled: true,
    children: [
      {
        title: 'Lista de vehiculos',
        url: '/admin/vehicles',
        icon: Car,
        disabled: true,
      },
      {
        title: 'Tipos de vehiculos',
        url: '/admin/vehicle-types',
        icon: Car,
        disabled: false,
      },
    ],
  },
];

export default function AdminSidebar() {
  return <SidebarCs items={items} Footer={<NavUser />} title="ParkingLot" />;
}
