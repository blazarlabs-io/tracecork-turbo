import { useEffect } from "react";
import { NEXT_PUBLIC_APP_URL } from "../../utils/envConstants";

export function useDynamicDomainHandler(wineId: string) {
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      const newUrl = `${NEXT_PUBLIC_APP_URL}/explore/wine/${wineId}`;
      window.location.href = newUrl;
    }, 300);
    return () => {
      clearTimeout(timeoutId);
    };
  }, [wineId]);
}
