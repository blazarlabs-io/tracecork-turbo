/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  forgotPasswordSchema,
  loginFormSchema,
  signUpFormSchema,
} from "@/data/form-schemas";
import type { Control, FieldPath } from "react-hook-form";
import { z } from "zod";
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@repo/ui/components/ui/form";
import { Input } from "@repo/ui/components/ui/input";

export interface AuthInputFieldProps {
  name: FieldPath<z.infer<typeof signUpFormSchema | typeof loginFormSchema>>;
  label?: string;
  placeholder: string;
  description?: string;
  inputType?: string;
  formControl: Control<
    z.infer<typeof signUpFormSchema | typeof loginFormSchema>,
    any
  >;
  isDisabled?: boolean;
}

export const AuthInputField: React.FC<AuthInputFieldProps> = ({
  name,
  label,
  placeholder,
  description,
  inputType,
  formControl,
  isDisabled,
}) => {
  return (
    <FormField
      control={formControl}
      name={name}
      disabled={isDisabled}
      render={({ field }) => (
        <FormItem>
          {label && <FormLabel>{label}</FormLabel>}
          <FormControl>
            <Input
              placeholder={placeholder}
              type={inputType || "text"}
              {...field}
            />
          </FormControl>
          {description && <FormDescription>{description}</FormDescription>}
          <FormMessage />
        </FormItem>
      )}
    />
  );
};
