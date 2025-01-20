"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
} from "@repo/ui/components/ui/form";
import { Switch } from "@repo/ui/components/ui/switch";
import { toast } from "@/hooks/use-toast";
import { autosaveFormSchema } from "@/data/form-schemas";
import { db } from "@/lib/firebase/services/db";
import { useAuth } from "@/context/auth";
import { DbResponse } from "@/types/db";
import { useWinery } from "@/context/winery";
import { useEffect, useRef } from "react";

export const AutoSave = () => {
  // * HOOKs
  const { user } = useAuth();
  const { winery } = useWinery();

  const form = useForm<z.infer<typeof autosaveFormSchema>>({
    resolver: zodResolver(autosaveFormSchema),
    defaultValues: {
      autosave: false,
    },
  });

  // * REFS
  const mountRef = useRef<boolean>(false);

  // * HANDLERS
  const onSubmit = (data: z.infer<typeof autosaveFormSchema>) => {
    // * UPDATE WINERY
    db.winery
      .update(user?.uid, { settings: { autosave: data.autosave } })
      .then((res: DbResponse) => {
        // console.log(res);
      })
      .catch((error: DbResponse) => {
        console.log(error);
      });

    // * TOAST
    toast({
      title: "Autosave enabled",
      description: `You have ${data.autosave ? "enabled" : "disabled"} autosave for your account. You can turn it off anytime.`,
    });
  };

  useEffect(() => {
    if (!mountRef.current && winery) {
      mountRef.current = true;
      // * SET AUTOSAAVE VALUE FROM WINERY DB
      if (
        winery.settings?.autosave !== undefined &&
        winery.settings.autosave !== null
      )
        form.setValue("autosave", winery.settings.autosave);
    }
  }, [winery]);

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="w-full space-y-6">
        <div>
          <h3 className="mb-4 text-lg font-medium">Save Settings</h3>
          <div className="space-y-4">
            <FormField
              control={form.control}
              name="autosave"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
                  <div className="space-y-0.5">
                    <FormLabel>Autosave</FormLabel>
                    <FormDescription>
                      Enable autosave for your account.
                    </FormDescription>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={(value) => {
                        field.onChange(value);
                        form.handleSubmit(onSubmit)();
                      }}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
          </div>
        </div>
      </form>
    </Form>
  );
};
