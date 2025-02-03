"use client";

import { signUpFormSchema } from "@/data/form-schemas";
import { auth } from "@/lib/firebase/client";
import { cn } from "@/utils/shadcn";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  sendEmailVerification,
  signInWithPopup,
} from "firebase/auth";
import Image from "next/image";
import Link from "next/link";
import { useRef, useState } from "react";
import ReCAPTCHA from "react-google-recaptcha";
import { Control, useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@repo/ui/components/ui/button";
import { Form } from "@repo/ui/components/ui/form";
import { SignUpInputField } from "./fields/signup-input-field";
import { SignUpPasswordInputField } from "./signup-password-input-field";
import { useTranslationHandler } from "@/hooks/use-translation-handler";
import "./login-form-styles.css";
import MarkdownPreviewer from "../markdown-previewer/MarkdownPreviewer";

export const SignUpForm = () => {
  const { t } = useTranslationHandler();
  const provider = new GoogleAuthProvider();

  // * HOOKS
  const form = useForm<z.infer<typeof signUpFormSchema>>({
    resolver: zodResolver(signUpFormSchema),
    defaultValues: {
      email: "",
      password: "",
      confirmPassword: "",
    },
    mode: "onChange",
  });

  // * STATES
  const recaptchaRef = useRef<typeof ReCAPTCHA>(null);
  const [isVerified, setIsVerified] = useState(false);

  // * HANDLERS
  const onSubmit = (values: z.infer<typeof signUpFormSchema>) => {
    // * Create user with email and password
    createUserWithEmailAndPassword(auth, values.email, values.password)
      .then(async (userCredential) => {
        // Signed in
        const user = userCredential.user;

        console.log("USER:", user);

        await fetch("/api/send-verification-email", {
          method: "POST",
          body: JSON.stringify({
            email: user.email,
          }),
        });
      })

      // sendEmailVerification(user, {
      //   handleCodeInApp: true,
      //   url: process.env
      //     .NEXT_PUBLIC_EMAIL_VERIFICATION_REDIRECT_URL as string,
      // })
      //   .then(() => {
      //     // router.push("/verify-email");
      //   })
      //   .catch((error) => {
      //     const errorCode = error.code;
      //     const errorMessage = error.message;
      //     const email = error.customData.email;
      //     const credential = GoogleAuthProvider.credentialFromError(error);
      //     console.log(errorCode, errorMessage, email, credential);
      //   });
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        console.log(errorCode, errorMessage);
      });
  };

  const handleSignInWithGoogle = () => {
    signInWithPopup(auth, provider)
      .then((result) => {})
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

  return (
    <div className="mb-4 flex w-full min-w-[360px] max-w-[360px] flex-col gap-3 rounded-[12px] border p-6">
      <h1 className="pb-4 text-center text-2xl font-semibold">
        {t("publicComponents.signup.title")}
      </h1>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="w-full space-y-4"
        >
          <SignUpInputField
            name="email"
            placeholder={t("publicComponents.signup.email.placeholder")}
            inputType="email"
            formControl={
              form.control as Control<z.infer<typeof signUpFormSchema>>
            }
          />
          <SignUpPasswordInputField
            name="password"
            placeholder={t("publicComponents.signup.password.placeholder")}
            formControl={
              form.control as Control<z.infer<typeof signUpFormSchema>>
            }
          />
          <SignUpPasswordInputField
            name="confirmPassword"
            placeholder={t(
              "publicComponents.signup.confirmPassword.placeholder",
            )}
            formControl={
              form.control as Control<z.infer<typeof signUpFormSchema>>
            }
          />
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
            {t("publicComponents.signup.signUpButtonLabel")}
          </Button>
          <div className="flex items-center justify-center gap-3">
            <p className="text-sm leading-[20px] text-muted-foreground">
              {t("publicComponents.signup.loginText.text")}
            </p>
            <Link
              href="/login"
              className="text-sm font-bold text-primary underline"
            >
              {t("publicComponents.signup.loginText.buttonLabel")}
            </Link>
          </div>
        </form>
      </Form>
      <div className="flex w-full items-center justify-between gap-4 py-2">
        <div className="h-[1px] w-full bg-border" />
        <span className="min-w-fit">or</span>
        <div className="h-[1px] w-full bg-border" />
      </div>
      <button
        disabled={!isVerified}
        onClick={handleSignInWithGoogle}
        className="flex w-full min-w-[320px] max-w-[320px] items-center justify-center gap-3 rounded-md border border-border bg-foreground px-4 py-2 text-base text-background disabled:bg-slate-400 disabled:text-slate-300"
      >
        <Image
          src="/images/google-color-icon.svg"
          alt="Logo"
          width={24}
          height={24}
          className={cn(!isVerified && "opacity-30 grayscale")}
        />
        {t("publicComponents.signup.googleButtonLabel")}
      </button>
      <div className="mt-[16px]">
        <p className="text-xs leading-[20px] text-muted-foreground legal-text-container">
          <MarkdownPreviewer content={t("publicComponents.login.legalText")} />
        </p>
      </div>
    </div>
  );
};
