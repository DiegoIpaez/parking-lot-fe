'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
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
import type { ParkingSessionFilters } from '@/types';

const filtersSchema = z.object({
  startDate: z.string().optional(),
  endDate: z.string().optional(),
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
      startDate: '',
      endDate: '',
      vehicleLicensePlate: '',
      status: 'ALL',
    },
  });

  const onSubmit = (values: FiltersFormValues) => {
    const filters: ParkingSessionFilters = {
      page: 1,
    };

    if (values.startDate) filters.startDate = values.startDate;
    if (values.endDate) filters.endDate = values.endDate;
    if (values.vehicleLicensePlate) filters.vehicleLicensePlate = values.vehicleLicensePlate;
    if (values.status && values.status !== 'ALL') filters.status = values.status as 'ACTIVE' | 'COMPLETED';

    onFiltersChange(filters);
  };

  const handleClear = () => {
    form.reset({
      startDate: '',
      endDate: '',
      vehicleLicensePlate: '',
      status: 'ALL',
    });
    onFiltersChange({ page: 1 });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <FormField
            control={form.control}
            name="startDate"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Fecha Desde</FormLabel>
                <FormControl>
                  <Input type="date" {...field} />
                </FormControl>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="endDate"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Fecha Hasta</FormLabel>
                <FormControl>
                  <Input type="date" {...field} />
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
          <Button type="submit">Aplicar Filtros</Button>
          <Button type="button" variant="outline" onClick={handleClear}>
            <FilterX className="h-4 w-4 mr-2" />
            Limpiar
          </Button>
        </div>
      </form>
    </Form>
  );
}
