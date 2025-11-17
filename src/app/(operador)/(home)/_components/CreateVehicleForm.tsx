'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import * as z from 'zod';
import {
  vehiclesService,
  vehicleTypesService,
} from '@/services/vehicles.service';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import ButtonCs from '@/components/ui/custom/ButtonCs';
import { VEHICLE_BRANDS, VEHICLE_MODELS, VEHICLE_COLORS } from '@/constants';

const createVehicleSchema = z.object({
  licensePlate: z.string().min(1, 'La placa es requerida'),
  brand: z.string().min(1, 'La marca es requerida'),
  model: z.string().min(1, 'El modelo es requerido'),
  color: z.string().min(1, 'El color es requerido'),
  vehicleTypeId: z.string().min(1, 'Selecciona un tipo de vehículo'),
});

type CreateVehicleFormValues = z.infer<typeof createVehicleSchema>;

interface CreateVehicleFormProps {
  onSuccess: (vehicleId: number) => void;
  onCancel: () => void;
  isLoading?: boolean;
}

export function CreateVehicleForm({
  onSuccess,
  onCancel,
  isLoading: externalLoading,
}: CreateVehicleFormProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const form = useForm<CreateVehicleFormValues>({
    resolver: zodResolver(createVehicleSchema),
    defaultValues: {
      licensePlate: '',
      brand: '',
      model: '',
      color: '',
      vehicleTypeId: '',
    },
  });

  const selectedBrand = form.watch('brand');
  const availableModels = selectedBrand
    ? VEHICLE_MODELS[selectedBrand] || []
    : [];

  const { data: vehicleTypes = [], isLoading: loadingVehicleTypes } = useQuery({
    queryKey: ['vehicle-types'],
    queryFn: async () => vehicleTypesService.getAll(),
    select: (data) => data.data,
  });

  const createVehicleMutation = useMutation({
    mutationFn: vehiclesService.create,
    onSuccess: (newVehicle) => {
      queryClient.invalidateQueries({ queryKey: ['vehicles'] });
      toast({
        title: 'Vehículo registrado',
        description: 'El vehículo ha sido registrado exitosamente',
      });
      form.reset();
      onSuccess(newVehicle.id);
    },
    onError: () => {
      toast({
        title: 'Error al registrar vehículo',
        description: 'Ocurrió un error al registrar el vehículo',
        variant: 'destructive',
      });
    },
  });

  const onSubmit = (values: CreateVehicleFormValues) => {
    createVehicleMutation.mutate({
      licensePlate: values.licensePlate,
      brand: values.brand,
      model: values.model,
      color: values.color,
      vehicleTypeId: parseInt(values.vehicleTypeId),
    });
  };

  const isLoading =
    loadingVehicleTypes || createVehicleMutation.isPending || externalLoading;

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="licensePlate"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Placa</FormLabel>
              <FormControl>
                <Input
                  placeholder="ABC-123"
                  disabled={isLoading}
                  value={field.value ?? ''}
                  onChange={(e) => field.onChange(e.target.value)}
                  onBlur={field.onBlur}
                  ref={field.ref}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="brand"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Marca</FormLabel>
              <Select
                onValueChange={(value) => {
                  field.onChange(value);
                  form.setValue('model', '');
                }}
                value={field.value}
                disabled={isLoading}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecciona una marca" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {VEHICLE_BRANDS.map((brand) => (
                    <SelectItem key={brand} value={brand}>
                      {brand}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="model"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Modelo</FormLabel>
              <Select
                onValueChange={field.onChange}
                value={field.value}
                disabled={
                  isLoading || !selectedBrand || availableModels.length === 0
                }
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue
                      placeholder={
                        !selectedBrand
                          ? 'Primero selecciona una marca'
                          : availableModels.length === 0
                          ? 'No hay modelos disponibles'
                          : 'Selecciona un modelo'
                      }
                    />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {availableModels.map((model) => (
                    <SelectItem key={model} value={model}>
                      {model}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="color"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Color</FormLabel>
              <Select
                onValueChange={field.onChange}
                value={field.value}
                disabled={isLoading}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecciona un color" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {VEHICLE_COLORS.map((color) => (
                    <SelectItem key={color} value={color}>
                      {color}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="vehicleTypeId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Tipo de Vehículo</FormLabel>
              <Select
                onValueChange={field.onChange}
                value={field.value}
                disabled={isLoading}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecciona un tipo" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {vehicleTypes.map((type) => (
                    <SelectItem key={type.id} value={type.id.toString()}>
                      {type.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex justify-end gap-2">
          <ButtonCs
            type="button"
            variant="outline"
            onClick={onCancel}
            disabled={isLoading}
          >
            Cancelar
          </ButtonCs>
          <ButtonCs
            type="submit"
            disabled={isLoading}
            isLoading={createVehicleMutation.isPending}
          >
            Registrar Vehículo
          </ButtonCs>
        </div>
      </form>
    </Form>
  );
}

