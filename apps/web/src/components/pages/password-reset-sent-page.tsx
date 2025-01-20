"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { Button } from "@repo/ui/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";

export const PasswordResetSentPage = () => {
  // * HOOKS
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
      <h2 className="mt-12 text-2xl font-bold">Password Reset Sent!</h2>
      <p className="text-center">
        Please check your email for a link to reset your password, remember to
        check your spam folder.
      </p>
      <p className="text-center">
        Didn&apos;t receive an email?{" "}
        {resendTimer ? (
          <span className="text-primary">Rensend in {timeLeft} seconds</span>
        ) : (
          <button
            className="text-primary underline"
            onClick={() => handleTimer()}
          >
            Resend
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
        Back to Login
      </Button>
    </div>
  );
};
