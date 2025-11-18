import type { ReactNode } from 'react';
import { z as zod } from 'zod';
import { useForm, UseFormReturn } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { FormField as FormFieldType } from '@/types';
import { Form } from '@/components/ui//form';
import ButtonCs from '../ButtonCs';
import DynamicInput from './DynamicInput';

type DynamicFormProps = {
  fields: FormFieldType[];
  schema: zod.ZodSchema<any>;
  onSubmit: (data: any) => void;
  defaultValues?: Record<string, any>;
  submitText?: ReactNode;
  isLoading?: boolean;
  className?: string;
  form?: UseFormReturn<any>;
};

export default function DynamicForm({
  fields,
  schema,
  onSubmit,
  defaultValues = {},
  submitText = 'Enviar',
  isLoading = false,
  className = '',
  form: externalForm,
}: DynamicFormProps) {
  const internalForm = useForm({
    resolver: zodResolver(schema as any),
    defaultValues,
  });

  const form = externalForm || internalForm;

  return (
    <Form {...form}>
      <div className={`space-y-6 ${className}`}>
        {fields.map((field) => (
          <DynamicInput
            key={field.name}
            field={field}
            form={form}
            isLoading={isLoading}
          />
        ))}
        <ButtonCs
          onClick={form.handleSubmit(onSubmit)}
          disabled={isLoading}
          isLoading={isLoading}
          className="w-full"
        >
          {submitText}
        </ButtonCs>
      </div>
    </Form>
  );
}
