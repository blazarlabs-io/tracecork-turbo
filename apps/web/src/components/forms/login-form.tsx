"use client";

import { loginFormSchema } from "@/data/form-schemas";
import { toast } from "@/hooks/use-toast";
import { auth } from "@/lib/firebase/client";
import { firebaseAuthErrors } from "@/utils/firebaseAuthErrors";
import { cn } from "@/utils/shadcn";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  GoogleAuthProvider,
  signInWithEmailAndPassword,
  signInWithPopup,
} from "firebase/auth";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
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
import { useTranslationHandler } from "@/hooks/useTranslationHandler";
import MarkdownPreviewer from "../markdown-previewer/MarkdownPreviewer";
import "./login-form-styles.css";

export const LoginForm = () => {
  const { t } = useTranslationHandler();
  const provider = new GoogleAuthProvider();

  // * HOOKS
  const form = useForm<z.infer<typeof loginFormSchema>>({
    resolver: zodResolver(loginFormSchema),
    defaultValues: {
      email:
        (typeof window !== "undefined" &&
          window.localStorage.getItem("email")) ||
        "",
      password:
        (typeof window !== "undefined" &&
          window.localStorage.getItem("password")) ||
        "",
    },
  });
  const router = useRouter();

  // * STATES
  const recaptchaRef = useRef<typeof ReCAPTCHA>(null);
  const [isVerified, setIsVerified] = useState(false);

  // * HANDLERS
  const onSubmit = (values: z.infer<typeof loginFormSchema>) => {
    if (typeof window !== "undefined") {
      window.localStorage.setItem("email", values.email);
      window.localStorage.setItem("password", values.password);
    }

    signInWithEmailAndPassword(auth, values.email, values.password)
      .then((userCredential) => {
        // Signed in
        const user = userCredential.user;

        if (user.emailVerified) {
          toast({
            description: "Login successful",
            title: "Success",
            variant: "default",
          });
        } else {
          toast({
            description: "Please verify your email",
            title: "Error",
            variant: "destructive",
          });
          router.push("/verify-email");
        }
      })
      .catch((error) => {
        toast({
          description: firebaseAuthErrors[error.code],
          title: "Error",
          variant: "destructive",
        });
      });
  };

  const handleSignInWithGoogle = () => {
    signInWithPopup(auth, provider)
      .then((result) => {
        // const user = result.user;
        // console.log(user);
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        const email = error.customData.email;
        const credential = GoogleAuthProvider.credentialFromError(error);
        console.log(errorCode, errorMessage, email, credential);
      });
  };

  const handleCaptchaSubmission = async (token: string | null) => {
    try {
      if (token) {
        await fetch("/api/recaptcha", {
          method: "POST",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ token }),
        });
        setIsVerified(true);
      }
    } catch (e) {
      setIsVerified(false);
    }
  };

  const handleChange = (token: string | null) => {
    handleCaptchaSubmission(token);
  };

  const handleExpired = () => {
    setIsVerified(false);
  };

  const handleForgotPassword = async () => {
    router.push("/forgot-password");
  };

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
            <p>Please check the I&apos;m not a robot checkbox</p>
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
          />
          <PasswordInputField
            name="password"
            placeholder={t("publicComponents.login.password.placeholder")}
            formControl={form.control}
          />
          <div className="flex w-full items-center justify-end text-sm">
            <button
              type="button"
              // href="/forgot-password"
              className="text-sm font-medium text-primary underline"
              onClick={handleForgotPassword}
            >
              {t("publicComponents.login.forgotPassword.label")}
            </button>
          </div>
          <div className="flex w-full items-center justify-center">
            <ReCAPTCHA
              sitekey={
                (process.env.NEXT_PUBLIC_CAPTCHA_SITE_KEY as string) || ""
              }
              ref={recaptchaRef}
              onChange={handleChange}
              onExpired={handleExpired}
            />
          </div>
          <Button
            disabled={!isVerified}
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
