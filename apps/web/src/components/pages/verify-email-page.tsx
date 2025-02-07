"use client";

import { useAuth } from "@/context/auth";
import Image from "next/image";
import { use, useState } from "react";
import { useTranslationHandler } from "@/hooks/use-translation-handler";
import { sendVerificationEmailService } from "~/src/services/auth/auth-emails-services";
import { useCustomCountDown } from "~/src/hooks/use-custom-count-down";
import { cn } from "@repo/ui/lib/utils";

export const VerifyEmailPage = () => {
  const [isSending, setIsSending] = useState(false);
  // * HOOKS
  const { t } = useTranslationHandler();
  const { user } = useAuth();

  const { timeLeft, startCountDown } = useCustomCountDown(30);

  const handleResend = async () => {
    try {
      if (!user || !user.email) return;
      setIsSending(true);
      // * Send verification email
      await sendVerificationEmailService(user.email);
      startCountDown();
    } catch (error) {
      console.error(error);
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="flex w-full max-w-[640px] flex-col items-center justify-center gap-6">
      <Image
        src="/images/verify-email.svg"
        alt="Verify Email"
        width={640}
        height={234}
      />
      <h2 className="text-center text-2xl font-bold text-foreground">
        {t("authPages.verifyEmail.title")}
      </h2>
      <p className="text-center text-foreground">
        {t("authPages.verifyEmail.message")}
      </p>
      <div className="flex w-full items-center justify-center gap-2">
        <p className="text-center text-muted-foreground">
          {t("authPages.verifyEmail.question")}
        </p>
        {timeLeft >= 0 ? (
          <p className="text-center text-muted-foreground">
            {t("authPages.verifyEmail.resendInMessage", {
              timeLeft,
            })}
          </p>
        ) : (
          <button
            onClick={handleResend}
            className={cn(
              "font-bold text-primary",
              isSending ? "opacity-50" : "opacity-100",
            )}
            disabled={isSending}
          >
            {t("authPages.verifyEmail.resendButtonLable")}
          </button>
        )}
      </div>
    </div>
  );
};
