"use client";

import { Eye, EyeOff } from "lucide-react";

import { useState } from "react";
import { Button } from "@repo/ui/components/ui/button";
import { DialogClose } from "@repo/ui/components/ui/dialog";
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
import { useResetPasswordForm } from "~/src/hooks/auth/reset-password/useResetPasswordForm";
import { z } from "zod";
import { passwordResetFormSchema } from "@/data/form-schemas";

type Props = {
  disalbed: boolean;
  form: ReturnType<typeof useResetPasswordForm>;
  onSubmit: (values: z.infer<typeof passwordResetFormSchema>) => Promise<void>;
};

export const ResetPasswordForm = ({ disalbed, form, onSubmit }: Props) => {
  // * HOOKS
  const { t } = useTranslationHandler();

  // * STATES
  const [passwordVisibility, setPasswordVisibility] = useState<boolean>(false);

  const handlePaswordVisibility = () => {
    setPasswordVisibility((old) => !old);
  };

  return (
    <>
      <div className="mb-4">
        <h1 className="text-center text-2xl font-semibold">reset</h1>
      </div>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="w-full space-y-4"
        >
          <FormField
            control={form.control}
            name={"newPassword"}
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  {t("manageAccount.changePassword.dialog.newPassword.label")}
                </FormLabel>
                <FormControl>
                  <div className="relative flex items-center rounded-md border border-border bg-background text-foreground">
                    <Input
                      disabled={disalbed}
                      type={passwordVisibility ? "text" : "password"}
                      placeholder={t(
                        "manageAccount.changePassword.dialog.newPassword.placeholder",
                      )}
                      {...field}
                      className="border-0 bg-transparent px-4 py-3 text-sm shadow-none"
                    />
                    <button
                      onClick={handlePaswordVisibility}
                      type="button"
                      className="absolute right-2"
                    >
                      {passwordVisibility ? (
                        <Eye className="h-4 w-4" />
                      ) : (
                        <EyeOff className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name={"confirmNewPassword"}
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  {t(
                    "manageAccount.changePassword.dialog.confirmPassword.label",
                  )}
                </FormLabel>
                <FormControl>
                  <div className="relative flex items-center rounded-md border border-border bg-background text-foreground">
                    <Input
                      disabled={disalbed}
                      type={passwordVisibility ? "text" : "password"}
                      placeholder={t(
                        "manageAccount.changePassword.dialog.confirmPassword.placeholder",
                      )}
                      {...field}
                      className="border-0 bg-transparent px-4 py-3 text-sm shadow-none"
                    />
                    <button
                      onClick={handlePaswordVisibility}
                      type="button"
                      className="absolute right-2"
                    >
                      {passwordVisibility ? (
                        <Eye className="h-4 w-4" />
                      ) : (
                        <EyeOff className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button
            disabled={!form.formState.isValid || disalbed}
            size="lg"
            type="submit"
            className="w-full"
          >
            {t("publicComponents.login.loginButtonLabel")}
          </Button>
        </form>
      </Form>
    </>
  );
};
