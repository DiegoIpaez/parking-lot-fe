import type { ReactNode } from 'react';
import { z as zod } from 'zod';
import { useForm, UseFormReturn } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { ActionBtnProps, FormField as FormFieldType } from '@/types';
import { Form } from '@/components/ui/form';
import ButtonCs from '../ButtonCs';
import DynamicInput from './DynamicInput';

type DynamicFormProps = {
  fields: FormFieldType[];
  okBtnProps?: ActionBtnProps;
  cancelBtnProps?: ActionBtnProps;
  schema: zod.ZodSchema<any>;
  defaultValues?: Record<string, any>;
  isMounted?: boolean;
  className?: string;
  form?: UseFormReturn<any>;
};

function DynamicFormFooterCs({
  okBtnProps,
  cancelBtnProps,
}: Pick<DynamicFormProps, 'okBtnProps' | 'cancelBtnProps'>) {
  return (
    <div className="flex justify-end gap-2 mt-4">
      <ButtonCs
        type={cancelBtnProps?.type || 'button'}
        variant="outline"
        onClick={
          cancelBtnProps?.onClick ? () => cancelBtnProps?.onClick?.() : () => {}
        }
        disabled={cancelBtnProps?.disabled}
        isLoading={cancelBtnProps?.isLoading}
      >
        {cancelBtnProps?.children ?? 'Cancelar'}
      </ButtonCs>
      <ButtonCs
        type={okBtnProps?.type || 'submit'}
        onClick={okBtnProps?.onClick ? () => okBtnProps?.onClick?.() : () => {}}
        disabled={okBtnProps?.disabled}
        isLoading={okBtnProps?.isLoading}
      >
        {okBtnProps?.children ?? 'Enviar'}
      </ButtonCs>
    </div>
  );
}

export default function DynamicForm({
  fields,
  schema,
  defaultValues = {},
  isMounted = false,
  className = '',
  okBtnProps,
  cancelBtnProps,
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
            isLoading={isMounted}
          />
        ))}
        <DynamicFormFooterCs
          okBtnProps={okBtnProps}
          cancelBtnProps={cancelBtnProps}
        />
      </div>
    </Form>
  );
}
