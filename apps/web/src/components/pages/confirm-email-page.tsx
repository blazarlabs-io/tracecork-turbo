"use client";

import { useAuth } from "@/context/auth";
import { auth } from "@/lib/firebase/client";
import { applyActionCode, Auth, checkActionCode, User } from "firebase/auth";
import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import { Button } from "@repo/ui/components/ui/button";
import { useTranslationHandler } from "@/hooks/use-translation-handler";
import { emailTemplates } from "@/utils/email-templates";

export const ConfirmEmailPage = ({ code }: any) => {
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
    async (auth: Auth, actionCode: string, user: User | null) => {
      try {
        const acion = await checkActionCode(auth, actionCode);
        if (acion.operation !== "VERIFY_EMAIL")
          throw new Error("Operation not allowed");

        const userName = user ? user.displayName : "";
        const userEmail = user ? user.email : "";
        const dataEmail = acion.data.email;
        const email = dataEmail || userEmail;
        if (!email) throw new Error("Email not found");

        await applyActionCode(auth, actionCode);
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
        setIsError(false);
      } catch (error) {
        console.error("Error verifing email");
        setIsError(true);
      }
    },
    [],
  );

  useEffect(() => {
    if (mountRef.current) return;
    const timeoutId = setTimeout(() => {
      handleVerifyEmail(auth, code, user);
      mountRef.current = true;
    }, 300);
    return () => clearTimeout(timeoutId);
  }, [code, user, handleVerifyEmail]);

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
