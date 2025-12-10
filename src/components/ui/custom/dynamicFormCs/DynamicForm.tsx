/* eslint-disable @typescript-eslint/no-explicit-any */
import clsx from 'clsx';
import { z as zod } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { SubmitHandler, useForm, UseFormReturn } from 'react-hook-form';
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
  isInitializing?: boolean;
  className?: string;
  form?: UseFormReturn<any>;
  onSubmit?: SubmitHandler<any>;
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
  form: externalForm,
  schema,
  isInitializing = false,
  defaultValues = {},
  className = '',
  okBtnProps,
  cancelBtnProps,
  onSubmit,
}: DynamicFormProps) {
  const internalForm = useForm({
    resolver: zodResolver(schema as any),
    defaultValues,
  });

  const form = externalForm ?? internalForm;

  return (
    <Form {...form}>
      <form
        onSubmit={onSubmit ? form.handleSubmit(onSubmit) : undefined}
        className={clsx('space-y-6', className)}
      >
        {fields.map((field) => (
          <DynamicInput
            key={field.name}
            field={field}
            form={form}
            isLoading={isInitializing}
          />
        ))}
        <DynamicFormFooterCs
          okBtnProps={okBtnProps}
          cancelBtnProps={cancelBtnProps}
        />
      </form>
    </Form>
  );
}
