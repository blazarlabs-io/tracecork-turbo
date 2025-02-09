import { useRef, useState } from "react";
import ReCAPTCHA from "react-google-recaptcha";
import { sendRecaptchaService } from "~/src/services/auth";

export const useCaptcha = () => {
  const recaptchaRef = useRef<typeof ReCAPTCHA>(null);
  const [isVerified, setIsVerified] = useState(true);

  const handleExpired = () => {
    setIsVerified(false);
  };

  const handleCaptchaSubmission = async (token: string | null) => {
    try {
      if (!token) return;
      await sendRecaptchaService(token);
      setIsVerified(true);
    } catch (e) {
      setIsVerified(false);
    }
  };

  const handleChange = (token: string | null) => {
    handleCaptchaSubmission(token);
  };

  return { recaptchaRef, isVerified, handleExpired, handleChange };
};
