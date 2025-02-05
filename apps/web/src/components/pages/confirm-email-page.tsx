"use client";

import { useAuth } from "@/context/auth";
import { auth } from "@/lib/firebase/client";
import { applyActionCode } from "firebase/auth";
import Image from "next/image";
import { useEffect, useRef } from "react";
import { Button } from "@repo/ui/components/ui/button";
import { useTranslationHandler } from "@/hooks/use-translation-handler";

export const ConfirmEmailPage = ({ code }: any) => {
  const { t } = useTranslationHandler();
  const { user } = useAuth();
  const mountRef = useRef<boolean>(false);

  const handleContinueToTracecork = () => {
    user?.reload();
    if (typeof window !== "undefined") window.location.href = "/";
  };

  useEffect(() => {
    if (!mountRef.current && code && user) {
      const handleVerifyEmail = (auth: any, actionCode: string) => {
        applyActionCode(auth, actionCode)
          .then(async (resp) => {
            // * The user's email address has been verified. Send welcome email

            await fetch(`/api/send-email`, {
              method: "POST",
              body: JSON.stringify({
                to: user?.email,
                templateId: "d-542e3d2d7d544b44964da549d430c2b9",
                dynamic_template_data: {
                  user: (user?.displayName as string) || user?.email,
                },
              }),
            });
          })
          .catch((error) => {
            console.log(error);
          });
      };

      handleVerifyEmail(auth, code);
      mountRef.current = true;
    }
  }, [code, user]);

  return (
    <div className="flex h-full w-full flex-col items-center justify-center">
      <Image
        src="/images/email-confirmation.svg"
        alt="Logo"
        width={320}
        height={100}
      />
      <h1 className="text-3xl font-medium">
        {t("authPages.confirmEmail.title")}
      </h1>
      <p className="py-6 text-base font-normal text-muted-foreground">
        {t("authPages.confirmEmail.title")}
      </p>
      <Button size="lg" onClick={handleContinueToTracecork}>
        {t("authPages.confirmEmail.continueButtonLabel")}
      </Button>
    </div>
  );
};
