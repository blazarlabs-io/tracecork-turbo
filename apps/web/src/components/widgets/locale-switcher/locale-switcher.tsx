"use client";

import { LocaleSwitcherSelect } from "./locale-switcher-select";
import { useMemo } from "react";
import { useTranslationHandler } from "~/src/hooks/useTranslationHandler";

export const LocaleSwitcher = () => {
  const { t, locale, msg } = useTranslationHandler();

  const items = useMemo(() => {
    console.log(msg["LocaleSwitcher"]);
    if (!msg["LocaleSwitcher"]) return [];
    return Object.keys(msg["LocaleSwitcher"])
      .filter((key) => key.length <= 2)
      .map((key) => {
        return {
          value: key,

          label: key,
        };
      });
  }, [msg["LocaleSwitcher"]]);

  return (
    <LocaleSwitcherSelect
      defaultValue={locale}
      items={items}
      label={t("LocaleSwitcher.label")}
    />
  );
};
