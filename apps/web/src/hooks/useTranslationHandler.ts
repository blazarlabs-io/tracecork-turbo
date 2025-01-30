import { useLocale, useTranslations, useMessages } from "next-intl";
import { useEffect } from "react";

export const useTranslationHandler = () => {
  const locale = useLocale();
  const t = useTranslations(locale);
  const msg = useMessages();

  return { locale, t, msg };
};
