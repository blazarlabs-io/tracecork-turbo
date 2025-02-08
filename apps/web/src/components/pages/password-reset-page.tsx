"use client";

import Image from "next/image";
import { Button } from "@repo/ui/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { useTranslationHandler } from "@/hooks/use-translation-handler";
import { useCustomCountDown } from "@/hooks/use-custom-count-down";
import { sendPasswordRecoveryEmailService } from "@/services/auth/auth-emails-services";
import { useState } from "react";
import { cn } from "@repo/ui/lib/utils";
import { useGetForgotPassEmail } from "@/hooks/auth/useGetForgotPassEmail";
import { confirmPasswordReset } from "firebase/auth";
import { auth } from "@/lib/firebase/client";

export const PasswordResetPage = () => {
  const [isSubmiting, setIsSubmiting] = useState(false);
  // * HOOKS
  const { t } = useTranslationHandler();
  const router = useRouter();

  const { forgotPassEmail } = useGetForgotPassEmail();
  const { timeLeft, startCountDown } = useCustomCountDown(30);

  const resendHandler = async () => {
    try {
      confirmPasswordReset(auth, oobCode, newPassword);
      if (!forgotPassEmail) return;
      setIsSubmiting(true);
      await sendPasswordRecoveryEmailService(forgotPassEmail);
      startCountDown();
    } catch (error) {
      console.error("Error submiting forgot password request");
    } finally {
      setIsSubmiting(false);
    }
  };

  return <h1>Password Rest Page</h1>;
};
