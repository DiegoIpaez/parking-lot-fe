import { FormField } from '@/components/ui/form';
import { GetResponse, ListQueryParams } from './reponses.type';

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
  | 'radio'
  | 'autocomplete';

export type FormField = {
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
  queryKey?: string;
  queryFn?: (queryParams: ListQueryParams) => Promise<GetResponse<unknown>>;
  queryParams?: Record<string, unknown>;
  mapOption?: (item: unknown) => FieldOption;
};
