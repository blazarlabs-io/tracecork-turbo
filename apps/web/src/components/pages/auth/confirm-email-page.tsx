"use client";

import { useAuth } from "@/context/auth";
import { auth } from "@/lib/firebase/client";
import {
  ActionCodeInfo,
  applyActionCode,
  checkActionCode,
} from "firebase/auth";
import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import { Button } from "@repo/ui/components/ui/button";
import { useTranslationHandler } from "@/hooks/use-translation-handler";
import { emailTemplates } from "@/utils/email-templates";
import { ConfirmEmailParamsType } from "@/types/authTypes";
import { useRouter } from "next/navigation";

export const ConfirmEmailPage = (params: ConfirmEmailParamsType) => {
  const { oobCode } = params;
  const router = useRouter();
  const { t } = useTranslationHandler();
  const { user } = useAuth();
  const mountRef = useRef<boolean>(false);
  const [isConfirming, setIsConfirming] = useState(true);
  const [isError, setIsError] = useState(false);

  const handleContinueToTracecork = () => {
    user?.reload();
    if (typeof window !== "undefined") window.location.href = "/";
  };

  const handleVerifyEmail = useCallback(
    async (action: ActionCodeInfo) => {
      if (action.operation !== "VERIFY_EMAIL")
        throw new Error("Operation not allowed");

      const userName = user ? user.displayName : "";
      const userEmail = user ? user.email : "";
      const dataEmail = action.data.email;
      const email = dataEmail || userEmail;
      if (!email) throw new Error("Email not found");

      await applyActionCode(auth, oobCode);
      // * The user's email address has been verified. Send welcome email
      await fetch(`/api/send-email`, {
        method: "POST",
        body: JSON.stringify({
          to: email,
          templateId: emailTemplates["welcome-email"],
          dynamic_template_data: {
            user: userName || email,
          },
        }),
      });
      setIsConfirming(false);
    },
    [oobCode, user],
  );

  const passwordResetHandler = useCallback(
    async (action: ActionCodeInfo) => {
      if (action.operation !== "PASSWORD_RESET")
        throw new Error("Operation not allowed");
      const queryParams = new URLSearchParams({ ...params });
      router.replace(`/password-reset?${queryParams.toString()}`);
    },
    [params],
  );

  const mainHandler = useCallback(async () => {
    try {
      setIsError(false);
      const action = await checkActionCode(auth, oobCode);
      if (action.operation === "VERIFY_EMAIL") {
        await handleVerifyEmail(action);
      } else if (action.operation === "PASSWORD_RESET") {
        passwordResetHandler(action);
      }
    } catch (error) {
      console.error(error);
      setIsError(true);
    }
  }, [oobCode, handleVerifyEmail, passwordResetHandler]);

  useEffect(() => {
    if (mountRef.current) return;
    const timeoutId = setTimeout(() => {
      mainHandler();
      mountRef.current = true;
    }, 300);
    return () => clearTimeout(timeoutId);
  }, [mainHandler]);

  return (
    <div className="flex h-full w-full flex-col items-center justify-center">
      {!isError && (
        <Image
          src="/images/email-confirmation.svg"
          alt="Logo"
          width={320}
          height={100}
        />
      )}
      {isError ? (
        <>
          <h1 className="text-3xl pb-4 font-medium">
            {t("authPages.confirmEmail.errorMessage")}
          </h1>
          <Button size="lg" onClick={handleContinueToTracecork}>
            {t("authPages.confirmEmail.continueButtonLabel")}
          </Button>
        </>
      ) : isConfirming ? (
        <h1 className="text-3xl pb-4 font-medium">
          {t("authPages.confirmEmail.confirmMessage")}
        </h1>
      ) : (
        <>
          <h1 className="text-3xl font-medium">
            {t("authPages.confirmEmail.title")}
          </h1>
          <p className="py-6 text-base font-normal text-muted-foreground">
            {t("authPages.confirmEmail.message")}
          </p>
          <Button size="lg" onClick={handleContinueToTracecork}>
            {t("authPages.confirmEmail.continueButtonLabel")}
          </Button>
        </>
      )}
    </div>
  );
};
