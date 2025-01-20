"use client";

import { useAuth } from "@/context/auth";
import { sendEmailVerification, User } from "firebase/auth";
import Image from "next/image";
import { useRef, useState } from "react";

export const VerifyEmailPage = () => {
  // * HOOKS
  const { user } = useAuth();

  // * STATES
  const [resendTimer, setResendTimer] = useState<NodeJS.Timeout | null>(null);
  const [timeLeft, setTimeLeft] = useState<number>(30);

  // * REFS
  const mountRef = useRef<boolean>(false);

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
        We&apos;ve sent you an email
      </h2>
      <p className="text-center text-foreground">
        Please check your email inbox and follow the instructions in order to
        complete your account verification.
      </p>
      <div className="flex w-full items-center justify-center gap-2">
        <p className="text-center text-muted-foreground">
          Didn&apos;t receive the email?
        </p>
        {!resendTimer && (
          <button onClick={handleResend} className="font-bold text-primary">
            Resend
          </button>
        )}
        {resendTimer && (
          <p className="text-center text-muted-foreground">
            Send again in {timeLeft} seconds
          </p>
        )}
      </div>
    </div>
  );
};
