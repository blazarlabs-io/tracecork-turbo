import { MapItem } from "@/components/maps/map-item";
import {
  FormLabel,
  FormDescription,
  FormField,
  FormItem,
  FormControl,
  FormMessage,
} from "@repo/ui/components/ui/form";
import { Input } from "@repo/ui/components/ui/input";
import { wineryInfoFormSchema } from "@/data/form-schemas";
import { Coordinates } from "@/types/db";
import { z } from "zod";

export interface WineryHeadquartersFieldProps {
  form: any;
  coordinates: Coordinates | null;
  onCoordinatesChange: (position: any) => void;
  onSubmit: (data: z.infer<typeof wineryInfoFormSchema>) => void;
  autosave: boolean;
}

export const WineryHeadquartersField = ({
  form,
  coordinates,
  onCoordinatesChange,
  onSubmit,
  autosave,
}: WineryHeadquartersFieldProps) => {
  return (
    <div className="col-span-1 flex w-full flex-col gap-3 rounded-lg border p-4">
      <div className="space-y-0.5">
        <FormLabel className="text-xl">Headquarters</FormLabel>
        <FormDescription className="text-sm">
          Add the coordinates of your headquarters or find it on the map.
        </FormDescription>
      </div>
      <div className="flex w-full items-start justify-between gap-3">
        <FormField
          control={form.control}
          name="headquarters.lat"
          render={({ field }) => (
            <FormItem className="flex w-full flex-col items-start justify-start gap-[1.5px]">
              <FormLabel className="text-sm">Latitude</FormLabel>
              <FormControl className="">
                <Input
                  value={(field.value as string) || ""}
                  onChange={field.onChange}
                  className="w-full shadow-none"
                  onBlur={(e) => {
                    if (autosave) {
                      onSubmit(form.getValues());
                    }
                  }}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="headquarters.lng"
          render={({ field }) => (
            <FormItem className="flex w-full flex-col items-start justify-start gap-[1.5px]">
              <FormLabel className="text-sm">Longitude</FormLabel>
              <FormControl className="">
                <Input
                  value={(field.value as string) || ""}
                  onChange={field.onChange}
                  className="w-full shadow-none"
                  onBlur={(e) => {
                    if (autosave) {
                      onSubmit(form.getValues());
                    }
                  }}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
      <MapItem
        initialPosition={coordinates}
        onSave={(position) => {
          onCoordinatesChange(position);
        }}
        onCancel={() => {}}
      />
    </div>
  );
};
