/* eslint-disable @typescript-eslint/no-explicit-any */
import type { FormField as FormFieldType } from '@/types';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Checkbox } from '@/components/ui/checkbox';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';

type DynamicInputProps = {
  field: FormFieldType;
  form: any;
  isLoading: boolean;
};

export default function DynamicInput({
  field,
  form,
  isLoading,
}: DynamicInputProps) {
  const {
    name,
    type,
    label,
    placeholder,
    description,
    options,
    disabled,
    accept,
    multiple,
  } = field;

  return (
    <FormField
      key={name}
      control={form.control}
      name={name}
      render={({ field: formField }) => (
        <FormItem>
          {label && <FormLabel>{label}</FormLabel>}
          <FormControl>
            {(() => {
              switch (type) {
                case 'text':
                case 'email':
                case 'password':
                case 'date':
                  return (
                    <Input
                      type={type}
                      placeholder={placeholder}
                      disabled={disabled || isLoading}
                      {...formField}
                    />
                  );

                case 'number':
                  return (
                    <Input
                      type="number"
                      placeholder={placeholder}
                      disabled={disabled || isLoading}
                      {...formField}
                      onChange={(event) =>
                        formField.onChange(event.target.valueAsNumber)
                      }
                    />
                  );

                case 'textarea':
                  return (
                    <Textarea
                      placeholder={placeholder}
                      disabled={disabled || isLoading}
                      {...formField}
                    />
                  );

                case 'select':
                  return (
                    <Select
                      onValueChange={formField.onChange}
                      defaultValue={formField.value}
                      disabled={disabled || isLoading}
                    >
                      <SelectTrigger className="cursor-pointer">
                        <SelectValue
                          placeholder={placeholder || 'Seleccionar...'}
                        />
                      </SelectTrigger>
                      <SelectContent>
                        {options?.map((option) => (
                          <SelectItem
                            className="cursor-pointer"
                            key={option.value}
                            value={option.value}
                          >
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  );
                case 'checkbox':
                  return (
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        checked={formField.value}
                        onCheckedChange={formField.onChange}
                        disabled={disabled || isLoading}
                      />
                      {label && (
                        <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                          {placeholder || label}
                        </label>
                      )}
                    </div>
                  );
                case 'switch':
                  return (
                    <div className="flex items-center space-x-2">
                      <Switch
                        checked={formField.value}
                        onCheckedChange={formField.onChange}
                        disabled={disabled || isLoading}
                      />
                      {placeholder && (
                        <label className="text-sm font-medium">
                          {placeholder}
                        </label>
                      )}
                    </div>
                  );
                case 'file':
                  return (
                    <Input
                      type="file"
                      accept={accept}
                      multiple={multiple}
                      disabled={disabled || isLoading}
                      onChange={(event) => {
                        const files = event.target.files;
                        if (multiple) {
                          formField.onChange(files ? Array.from(files) : []);
                        } else {
                          formField.onChange(files?.[0] || null);
                        }
                      }}
                    />
                  );
                default:
                  return (
                    <Input
                      placeholder={placeholder}
                      disabled={disabled || isLoading}
                      {...formField}
                    />
                  );
              }
            })()}
          </FormControl>
          {description && <FormDescription>{description}</FormDescription>}
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
