"use client";

import Image from "next/image";
import { useState } from "react";
import { Button } from "@repo/ui/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { useTranslationHandler } from "@/hooks/use-translation-handler";

export const PasswordResetSentPage = () => {
  // * HOOKS
  const { t } = useTranslationHandler();
  const router = useRouter();

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

  return (
    <div className="flex w-full max-w-[520px] flex-col items-center justify-center gap-4">
      <Image
        src="/images/verify-email.svg"
        alt="Logo"
        width={520}
        height={48}
      />
      <h2 className="mt-12 text-2xl font-bold">
        {t("authPages.passwordResetSent.title")}
      </h2>
      <p className="text-center">{t("authPages.passwordResetSent.message")}</p>
      <p className="text-center">
        {`${t("authPages.passwordResetSent.question")} `}
        {resendTimer ? (
          <span className="text-primary">
            {`${t("authPages.passwordResetSent.resendIn.message")} ${timeLeft} ${t("authPages.passwordResetSent.resendIn.units")}`}
          </span>
        ) : (
          <button
            className="text-primary underline"
            onClick={() => handleTimer()}
          >
            {t("authPages.passwordResetSent.resendButtonLable")}
          </button>
        )}
      </p>
      <Button
        type="button"
        variant="ghost"
        className="flex items-center gap-2"
        onClick={() => router.replace("/login")}
      >
        <ArrowLeft className="h-4 w-4" />
        {t("authPages.passwordResetSent.backButtonLable")}
      </Button>
    </div>
  );
};
