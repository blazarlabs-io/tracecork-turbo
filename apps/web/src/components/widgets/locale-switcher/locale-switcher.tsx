"use client";

import { LocaleSwitcherSelect } from "./locale-switcher-select";
import { useMemo } from "react";
import { useTranslationHandler } from "@/hooks/use-translation-handler";

export const LocaleSwitcher = () => {
  const { locale, msg } = useTranslationHandler();

  const items = useMemo(() => {
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

  const label = useMemo(() => {
    if (!msg["LocaleSwitcher"] || typeof msg["LocaleSwitcher"] === "string")
      return "Language";
    const { label } = msg["LocaleSwitcher"];
    if (!label || typeof label != "string") return "Language";
    return label;
  }, [msg["LocaleSwitcher"]]);

  return (
    <LocaleSwitcherSelect defaultValue={locale} items={items} label={label} />
  );
};
