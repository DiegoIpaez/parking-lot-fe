'use client';
import { Home } from 'lucide-react';
import { SidebarMenuItemProps } from '@/types';
import SidebarCs from '@/components/ui/custom/SidebarCs/SidebarCs';
import { NavUser } from './NavUser';

const items: SidebarMenuItemProps[] = [
  {
    title: 'Home',
    url: '/admin',
    icon: Home,
    disabled: false,
  },
];

export default function AdminSidebar() {
  return <SidebarCs items={items} Footer={<NavUser />} title="ParkingLot" />;
}
