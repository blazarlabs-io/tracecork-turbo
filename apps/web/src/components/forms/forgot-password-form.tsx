"use client";

import { forgotPasswordSchema } from "@/data/form-schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@repo/ui/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@repo/ui/components/ui/form";
import { Input } from "@repo/ui/components/ui/input";
import { useTranslationHandler } from "@/hooks/use-translation-handler";

export const ForgotPasswordForm = () => {
  // * HOOKS
  const { t } = useTranslationHandler();
  const router = useRouter();
  const form = useForm<z.infer<typeof forgotPasswordSchema>>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email:
        (typeof window !== "undefined" &&
          window.localStorage.getItem("email")) ||
        "",
    },
  });

  // * HANDLERS
  const onSubmit = async (values: z.infer<typeof forgotPasswordSchema>) => {
    const res = await fetch("/api/password-recovery", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: values.email,
        templateId: "d-96f3802db81c4cafbdcf92822ef1ee61",
      }),
    });

    router.push("/password-reset-sent");
  };
  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col items-center justify-center gap-2">
        <h2 className="text-2xl font-bold">
          {t("authPages.forgotPassword.title")}
        </h2>
        <span className="text-muted-foreground">
          {t("authPages.forgotPassword.message")}
        </span>
      </div>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="w-full space-y-4"
        >
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  {t("authPages.forgotPassword.email.label")}
                </FormLabel>
                <FormControl>
                  <Input
                    placeholder={t(
                      "authPages.forgotPassword.email.placeholder",
                    )}
                    type="email"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" className="w-full">
            {t("authPages.forgotPassword.sendButtonLable")}
          </Button>
          <Button
            type="button"
            variant="ghost"
            className="flex w-full items-center gap-2"
            onClick={() => router.back()}
          >
            <ArrowLeft className="h-4 w-4" />
            {t("authPages.forgotPassword.backButtonLable")}
          </Button>
        </form>
      </Form>
    </div>
  );
};
