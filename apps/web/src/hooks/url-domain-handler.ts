import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { useEffect } from "react";
import { NEXT_PUBLIC_EMAIL_VERIFICATION_REDIRECT_URL } from "../utils/envConstants";

const APP_URL = NEXT_PUBLIC_EMAIL_VERIFICATION_REDIRECT_URL;

export function urlDomailHandler() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (window.location.host === APP_URL) return;
      const queryParams = searchParams.toString();
      const newUrl = `${APP_URL}/${pathname}?${queryParams}`;
      router.replace(newUrl);
    }, 300);
    return () => {
      clearTimeout(timeoutId);
    };
  }, [pathname]);
}
