import {
  FormField,
  FormItem,
  FormLabel,
  FormDescription,
  FormControl,
  FormMessage,
} from "@repo/ui/components/ui/form";
import { wineFormSchema } from "~/src/features/wineries/data/form-schemas";
import { Input } from "@repo/ui/components/ui/input";
import { z } from "zod";

export interface WineNumberFieldProps {
  name: string;
  label: string;
  description: string;
  step?: number;
  min?: number;
  max?: number;
  form: any;
  autosave: boolean;
  readOnly?: boolean;
  complementaryText?: string;
  onSubmit: (data: z.infer<typeof wineFormSchema>) => void;
}

export const WineNumberField = ({
  name,
  label,
  description,
  step,
  min,
  max,
  form,
  readOnly = false,
  autosave,
  complementaryText,
  onSubmit,
}: WineNumberFieldProps) => {
  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => {
        return (
          <FormItem className="flex w-full flex-col items-start justify-start rounded-lg border p-4">
            <div className="space-y-0.5">
              <FormLabel className="text-xl">{label}</FormLabel>
              <FormDescription className="text-sm">
                {description}
              </FormDescription>
            </div>
            <FormControl>
              <div className="flex w-full items-center gap-2">
                <Input
                  type="number"
                  step={step || 1}
                  min={min || 0}
                  max={max}
                  readOnly={readOnly}
                  className="w-full shadow-none"
                  value={(field.value as string) || ""}
                  onChange={field.onChange}
                  onBlur={(e) => {
                    if (autosave) {
                      onSubmit(
                        form.getValues() as z.infer<typeof wineFormSchema>,
                      );
                    }
                  }}
                />
                {complementaryText && (
                  <p className="text-sm text-gray-500">{complementaryText}</p>
                )}
              </div>
            </FormControl>
            <FormMessage />
          </FormItem>
        );
      }}
    />
  );
};
