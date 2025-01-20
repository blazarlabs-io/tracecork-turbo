import {
  FormField,
  FormItem,
  FormLabel,
  FormDescription,
  FormControl,
  FormMessage,
} from "@repo/ui/components/ui/form";
import { wineFormSchema } from "@/data/form-schemas";
import { sweetness } from "@/data/systemVariables";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectGroup,
  SelectItem,
} from "@repo/ui/components/ui/select";
import { z } from "zod";
import { useEffect, useState } from "react";

export interface WineTypeAndSweetnessFieldProps {
  form: any;
  wineTypes: string[];
  selectedWineType: string | null;
  selectedSweetness: string[] | null;
  autosave: boolean;
  onSubmit: (data: z.infer<typeof wineFormSchema>) => void;
}

export const WineTypeAndSweetnessField = ({
  form,
  wineTypes,
  selectedWineType,
  selectedSweetness,
  onSubmit,
  autosave,
}: WineTypeAndSweetnessFieldProps) => {
  // * STATES
  // const [selectedWineType, setSelectedWineType] = useState<string | null>(null);

  return (
    <div className="flex w-full items-start justify-start gap-4 rounded-lg border p-4">
      <FormField
        control={form.control}
        name="generalInfo.type"
        render={({ field }) => {
          return (
            <FormItem className="w-full">
              <div className="space-y-0.5">
                <FormLabel className="text-xl">Type of Wine</FormLabel>
                <FormDescription className="text-sm">
                  Choose the type of wine.
                </FormDescription>
              </div>
              <FormControl>
                <Select
                  onValueChange={(value) => {
                    if (value) {
                      // setSelectedWineType(value);
                      field.onChange(value);
                      if (autosave) {
                        onSubmit(
                          form.getValues() as z.infer<typeof wineFormSchema>,
                        );
                      }
                    }
                  }}
                  value={field.value}
                >
                  <SelectTrigger className="w-full shadow-none">
                    <SelectValue placeholder="Select a type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      {wineTypes.map((type: string) => (
                        <SelectItem key={type} value={type}>
                          {type}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </FormControl>
              <FormMessage />
            </FormItem>
          );
        }}
      />
      {selectedWineType && selectedSweetness && (
        <FormField
          control={form.control}
          name="profile.sweetness"
          render={({ field }) => {
            return (
              <FormItem className="flex w-full flex-col items-start justify-start">
                <div className="space-y-0.5">
                  <FormLabel className="text-xl">Sweetness</FormLabel>
                  <FormDescription className="text-sm">
                    Choose the sweetness of wine.
                  </FormDescription>
                </div>
                <FormControl>
                  <Select
                    onValueChange={(value) => {
                      if (value) {
                        field.onChange(value);
                        if (autosave) {
                          onSubmit(
                            form.getValues() as z.infer<typeof wineFormSchema>,
                          );
                        }
                      }
                    }}
                    value={field.value}
                  >
                    <SelectTrigger className="w-full capitalize shadow-none">
                      <SelectValue placeholder="Select sweetness" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        {selectedSweetness.map((type: string) => (
                          <SelectItem
                            key={type}
                            value={type}
                            className="capitalize"
                          >
                            {type}
                          </SelectItem>
                        ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormMessage />
              </FormItem>
            );
          }}
        />
      )}
    </div>
  );
};
