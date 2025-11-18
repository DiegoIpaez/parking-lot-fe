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
  onCancel?: () => void;
  cancelText?: ReactNode;
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
  onCancel,
  defaultValues = {},
  submitText = 'Enviar',
  cancelText = 'Cancelar',
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
        <div className="flex justify-end gap-2">
          {onCancel && (
            <ButtonCs type="button" variant="outline" onClick={onCancel}>
              {cancelText}
            </ButtonCs>
          )}
          <ButtonCs
            type="submit"
            onClick={form.handleSubmit(onSubmit)}
            disabled={isLoading}
            isLoading={isLoading}
          >
            {submitText}
          </ButtonCs>
        </div>
      </div>
    </Form>
  );
}
