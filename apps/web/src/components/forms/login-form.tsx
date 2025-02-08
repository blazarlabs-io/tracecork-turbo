"use client";

import { loginFormSchema } from "@/data/form-schemas";
import { toast } from "@/hooks/use-toast";
import { auth } from "@/lib/firebase/client";
import { firebaseAuthErrors } from "@/utils/firebaseAuthErrors";
import { cn } from "@/utils/shadcn";
import { zodResolver } from "@hookform/resolvers/zod";
import { signInWithEmailAndPassword } from "firebase/auth";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import ReCAPTCHA from "react-google-recaptcha";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@repo/ui/components/ui/button";
import { Form } from "@repo/ui/components/ui/form";
import { AuthInputField } from "./fields/auth-input-field";
import { PasswordInputField } from "./password-input-field";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@repo/ui/components/ui/tooltip";
import { useTranslationHandler } from "@/hooks/use-translation-handler";
import MarkdownPreviewer from "../markdown-previewer/MarkdownPreviewer";
import "./login-form-styles.css";
import { sendVerificationEmailService } from "@/services/auth";
import { NEXT_PUBLIC_CAPTCHA_SITE_KEY } from "@/utils/envConstants";
import { getFromLocalStorage, setToLocalStorage } from "@/utils/local-storage";
import { LoginStorage } from "@/types/authTypes";
import { LOGIN_CREDENTIALS_KEY } from "@/utils/authConstants";
import { useGoogleSignIn, useLoginCaptcha } from "@/hooks/auth";

export const LoginForm = () => {
  const { t } = useTranslationHandler();
  const router = useRouter();
  const [isSubmiting, setIsSubmiting] = useState(false);

  // * HOOKS
  const { recaptchaRef, isVerified, handleExpired, handleChange } =
    useLoginCaptcha();
  const { isGoogleLogin, handleSignInWithGoogle } = useGoogleSignIn();

  const form = useForm<z.infer<typeof loginFormSchema>>({
    resolver: zodResolver(loginFormSchema),
    defaultValues: {
      email:
        getFromLocalStorage<LoginStorage>(LOGIN_CREDENTIALS_KEY)?.email || "",
      password: "",
    },
  });

  // * HANDLERS
  const onSubmit = async (values: z.infer<typeof loginFormSchema>) => {
    try {
      setIsSubmiting(true);
      setToLocalStorage<LoginStorage>(LOGIN_CREDENTIALS_KEY, {
        email: values.email,
      });
      const userCredential = await signInWithEmailAndPassword(
        auth,
        values.email,
        values.password,
      );

      // Signed in
      const user = userCredential.user;

      if (user.emailVerified) {
        toast({
          variant: "default",
          title: t("toasts.auth.loginSuccess.title"),
          description: t("toasts.auth.loginSuccess.description"),
        });
      } else {
        toast({
          variant: "destructive",
          title: t("toasts.auth.verifyEmailError.title"),
          description: t("toasts.auth.verifyEmailError.description"),
        });
        await sendVerificationEmailService(values.email);
        router.push("/verify-email");
      }
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: t("toasts.globals.error.title"),
        description: t("toasts.globals.error.description", {
          message: firebaseAuthErrors[error.code],
        }),
      });
    } finally {
      setIsSubmiting(false);
    }
  };

  const handleForgotPassword = async () => {
    router.push("/forgot-password");
  };

  const isProcessing = isGoogleLogin || isSubmiting;

  return (
    <div className="flex w-full min-w-[360px] max-w-[360px] flex-col gap-3 rounded-[12px] border p-6">
      <div className="mb-4">
        <h1 className="text-center text-2xl font-semibold">
          {t("publicComponents.login.title")}
        </h1>
      </div>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger
            onClick={handleSignInWithGoogle}
            disabled={!isVerified}
            type="button"
            className="flex w-full min-w-[320px] max-w-[320px] items-center justify-center gap-3 rounded-md border border-border bg-foreground px-4 py-2 text-base text-background disabled:bg-slate-400 disabled:text-slate-300"
          >
            <Image
              src="/images/google-color-icon.svg"
              alt="Logo"
              width={24}
              height={24}
              className={cn(!isVerified && "opacity-30 grayscale")}
            />
            {t("publicComponents.login.googleButtonLabel")}
          </TooltipTrigger>
          <TooltipContent>
            <p>{t("publicComponents.login.googleButtonTooltip")}</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
      <div className="flex items-center justify-center gap-4 py-2">
        <div className="h-[1px] w-full bg-border" />
        <span className="min-w-fit">
          {t("publicComponents.login.separatorText")}
        </span>
        <div className="h-[1px] w-full bg-border" />
      </div>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="w-full space-y-4"
        >
          <AuthInputField
            name="email"
            placeholder={t("publicComponents.login.email.placeholder")}
            inputType="email"
            formControl={form.control}
            isDisabled={isProcessing}
          />
          <PasswordInputField
            name="password"
            placeholder={t("publicComponents.login.password.placeholder")}
            formControl={form.control}
            isDisabled={isProcessing}
          />
          <div className="flex w-full items-center justify-end text-sm">
            <button
              type="button"
              // href="/forgot-password"
              className="text-sm font-medium text-primary underline disabled:opacity-50"
              onClick={handleForgotPassword}
              disabled={isProcessing}
            >
              {t("publicComponents.login.forgotPassword.label")}
            </button>
          </div>
          <div className="flex w-full items-center justify-center">
            <ReCAPTCHA
              sitekey={NEXT_PUBLIC_CAPTCHA_SITE_KEY}
              ref={recaptchaRef}
              onChange={handleChange}
              onExpired={handleExpired}
            />
          </div>
          <Button
            disabled={!isVerified || !form.formState.isValid || isProcessing}
            size="lg"
            type="submit"
            className="w-full"
          >
            {t("publicComponents.login.loginButtonLabel")}
          </Button>
        </form>
      </Form>
      <div className="mt-4 flex items-center justify-center gap-2">
        <span className="text-sm">
          {t("publicComponents.login.register.text")}
        </span>
        <Link
          href="/signup"
          className="text-sm font-medium text-primary underline"
        >
          {t("publicComponents.login.register.buttonLabel")}
        </Link>
      </div>
      <div className="mt-[16px] min-w-[320px] max-w-[320px]">
        <p className="text-xs leading-[20px] text-muted-foreground legal-text-container">
          <MarkdownPreviewer content={t("publicComponents.login.legalText")} />
        </p>
      </div>
    </div>
  );
};
