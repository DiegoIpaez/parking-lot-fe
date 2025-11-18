import { FormField } from '@/components/ui/form';

export interface FieldOption {
  value: string;
  label: string;
}

export type FormFieldType =
  | 'text'
  | 'email'
  | 'password'
  | 'number'
  | 'textarea'
  | 'select'
  | 'checkbox'
  | 'switch'
  | 'date'
  | 'file'
  | 'radio';

export interface FormField {
  name: string;
  type: FormFieldType;
  label?: string;
  placeholder?: string;
  description?: string;
  options?: FieldOption[];
  required?: boolean;
  disabled?: boolean;
  accept?: string;
  multiple?: boolean;
}
