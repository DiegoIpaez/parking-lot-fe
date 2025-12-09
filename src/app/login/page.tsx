'use client';

import * as zod from 'zod';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import { ParkingSquare } from 'lucide-react';
import { zodResolver } from '@hookform/resolvers/zod';
import { authService } from '@/services/auth.service';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import { useAuthStore } from '@/stores/auth.store';
import { setAuthCookieServer } from '../actions/auth.action';
import ButtonCs from '@/components/ui/custom/ButtonCs';

const loginSchema = zod.object({
  email: zod.string().email('Email inválido'),
  password: zod.string().min(1, 'Password requerido'),
});

type LoginFormValues = zod.infer<typeof loginSchema>;

export default function LoginPage() {
  const router = useRouter();

  const { login } = useAuthStore();

  const [isSubmit, setIsSubmit] = useState(false);

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = async (values: LoginFormValues) => {
    try {
      setIsSubmit(true);
      const data = await authService.login(values);

      await setAuthCookieServer(data.access_token);

      login(data.access_token, data.user);
      toast.success('Inicio de sesión exitoso. Bienvenido!');
      router.push('/');
    } catch {
      toast.error('Error de autenticación');
    } finally {
      setIsSubmit(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-background to-muted p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-4 text-center">
          <div className="flex justify-center">
            <div className="rounded-full bg-primary p-3">
              <ParkingSquare className="h-8 w-8 text-primary-foreground" />
            </div>
          </div>
          <div>
            <CardTitle className="text-2xl">Iniciar Sesión</CardTitle>
            <CardDescription>
              Ingresa tus credenciales para acceder al sistema
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input
                        type="email"
                        placeholder="tu@email.com"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Contraseña</FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        placeholder="••••••••"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <ButtonCs type="submit" className="w-full" isLoading={isSubmit}>
                Iniciar Sesión
              </ButtonCs>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
