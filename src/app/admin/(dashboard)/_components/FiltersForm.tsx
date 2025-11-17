'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { FilterX } from 'lucide-react';
import type { ParkingSessionFilters, ParkingSessionStatus } from '@/types';
import ButtonCs from '@/components/ui/custom/ButtonCs';

const filtersSchema = z.object({
  checkInTime: z.string().optional(),
  checkOutTime: z.string().optional(),
  vehicleLicensePlate: z.string().optional(),
  status: z.enum(['ALL', 'ACTIVE', 'COMPLETED']).optional(),
});

type FiltersFormValues = z.infer<typeof filtersSchema>;

interface FiltersFormProps {
  onFiltersChange: (filters: ParkingSessionFilters) => void;
}

export function FiltersForm({ onFiltersChange }: FiltersFormProps) {
  const form = useForm<FiltersFormValues>({
    resolver: zodResolver(filtersSchema),
    defaultValues: {
      checkInTime: '',
      checkOutTime: '',
      vehicleLicensePlate: '',
    },
  });

  const onSubmit = (values: FiltersFormValues) => {
    const filters: ParkingSessionFilters = {
      page: 1,
    };

    if (values.checkInTime)
      filters.checkInTime = new Date(values.checkInTime).toISOString();
    if (values.checkOutTime)
      filters.checkOutTime = new Date(values.checkOutTime).toISOString();
    if (values.vehicleLicensePlate)
      filters.vehicleLicensePlate = values.vehicleLicensePlate;
    if (values.status && values.status !== 'ALL')
      filters.status = values.status as ParkingSessionStatus;
    if (values.status === 'ALL') delete filters.status;

    onFiltersChange(filters);
  };

  const handleClear = () => {
    form.reset({
      checkInTime: '',
      checkOutTime: '',
      vehicleLicensePlate: '',
    });
    onFiltersChange({ page: 1 });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <FormField
            control={form.control}
            name="checkInTime"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Fecha Desde</FormLabel>
                <FormControl>
                  <Input type="datetime-local" {...field} />
                </FormControl>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="checkOutTime"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Fecha Hasta</FormLabel>
                <FormControl>
                  <Input type="datetime-local" {...field} />
                </FormControl>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="vehicleLicensePlate"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Patente</FormLabel>
                <FormControl>
                  <Input placeholder="Buscar por patente..." {...field} />
                </FormControl>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="status"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Estado</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Todos" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="ALL">Todos</SelectItem>
                    <SelectItem value="ACTIVE">Activo</SelectItem>
                    <SelectItem value="COMPLETED">Completado</SelectItem>
                  </SelectContent>
                </Select>
              </FormItem>
            )}
          />
        </div>
        <div className="flex gap-2">
          <ButtonCs type="submit">Aplicar Filtros</ButtonCs>
          <ButtonCs type="button" variant="outline" onClick={handleClear}>
            <FilterX className="h-4 w-4 mr-2" />
            Limpiar
          </ButtonCs>
        </div>
      </form>
    </Form>
  );
}
