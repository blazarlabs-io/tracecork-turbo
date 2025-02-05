"use client";

import { useAuth } from "@/context/auth";
import Image from "next/image";
import { useState } from "react";
import { useTranslationHandler } from "@/hooks/use-translation-handler";

export const VerifyEmailPage = () => {
  // * HOOKS
  const { t } = useTranslationHandler();
  const { user } = useAuth();

  // * STATES
  const [resendTimer, setResendTimer] = useState<NodeJS.Timeout | null>(null);
  const [timeLeft, setTimeLeft] = useState<number>(30);

  // * HANDLERS
  const handleTimer = () => {
    let counter = timeLeft;
    setResendTimer(
      setInterval(() => {
        counter--;
        setTimeLeft(counter);
        if (counter <= 0) {
          clearInterval(resendTimer!);
          setResendTimer(null);
          setTimeLeft(30);
        }
      }, 1000),
    );
  };

  const handleResend = async () => {
    // * Send verification email
    await fetch("/api/send-verification-email", {
      method: "POST",
      body: JSON.stringify({
        email: user?.email,
      }),
    });
    handleTimer();
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
        {!resendTimer && (
          <button onClick={handleResend} className="font-bold text-primary">
            {t("authPages.verifyEmail.resendButtonLable")}
          </button>
        )}
        {resendTimer && (
          <p className="text-center text-muted-foreground">
            {`${t("authPages.verifyEmail.sendAgainIn.message")} ${timeLeft} ${t("authPages.verifyEmail.sendAgainIn.units")}`}
          </p>
        )}
      </div>
    </div>
  );
};
