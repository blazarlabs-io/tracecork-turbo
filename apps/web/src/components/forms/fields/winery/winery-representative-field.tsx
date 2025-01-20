import {
  FormLabel,
  FormDescription,
  FormField,
  FormItem,
  FormControl,
  FormMessage,
} from "@repo/ui/components/ui/form";
import { PhoneInput } from "@/components/widgets/phone-input";
import { Input } from "@repo/ui/components/ui/input";
import { wineryInfoFormSchema } from "@/data/form-schemas";
import { z } from "zod";

export interface WineryRepresentativeFieldProps {
  form: any;
  onSubmit: (data: z.infer<typeof wineryInfoFormSchema>) => void;
  autosave: boolean;
}

export const WineryRepresentativeField = ({
  form,
  onSubmit,
  autosave,
}: WineryRepresentativeFieldProps) => {
  return (
    <div className="col-span-1 flex w-full flex-col gap-3 rounded-lg border p-4">
      <div className="space-y-0.5">
        <FormLabel className="text-xl">Winery Representative</FormLabel>
        <FormDescription className="text-sm">
          Enter the information of your winery’s representative person.
        </FormDescription>
      </div>
      <div className="flex flex-col items-start justify-start gap-3">
        <FormField
          control={form.control}
          name="representative.name"
          render={({ field }) => (
            <FormItem className="flex w-full flex-col items-start justify-start gap-[1.5px]">
              <FormLabel className="text-sm">Name</FormLabel>
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
          name="representative.email"
          render={({ field }) => (
            <FormItem className="flex w-full flex-col items-start justify-start gap-[1.5px]">
              <FormLabel className="text-sm">Email</FormLabel>
              <FormControl className="">
                <Input
                  value={(field.value as string) || ""}
                  onChange={field.onChange}
                  className="w-full shadow-none"
                  type="email"
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
          name="representative.phone"
          render={({ field }) => (
            <FormItem className="flex w-full flex-col items-start justify-start gap-[1.5px]">
              <FormLabel className="text-sm">Phone</FormLabel>
              <FormControl className="">
                <PhoneInput
                  value={(field.value as string) || ""}
                  onChange={field.onChange}
                  onErrorCapture={(error) => console.log(error)}
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
    </div>
  );
};
