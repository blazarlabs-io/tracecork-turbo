"use client";

import { useLocale, useTranslations, useMessages } from "next-intl";
import { LocaleSwitcherSelect } from "./locale-switcher-select";
import { useMemo } from "react";

export const LocaleSwitcher = () => {
  const t = useTranslations("LocaleSwitcher");
  const locale = useLocale();
  const messages = useMessages(); // Get all messages

  const items = useMemo(() => {
    messages["LocaleSwitcher"];
    if (!messages["LocaleSwitcher"]) return [];
    return Object.keys(messages["LocaleSwitcher"])
      .filter((key) => key.length <= 2)
      .map((key) => {
        return {
          value: key,
          label: t(`${key}`),
        };
      });
  }, [messages["LocaleSwitcher"]]);

  return (
    <LocaleSwitcherSelect
      defaultValue={locale}
      items={items}
      label={t("label")}
    />
  );
};
