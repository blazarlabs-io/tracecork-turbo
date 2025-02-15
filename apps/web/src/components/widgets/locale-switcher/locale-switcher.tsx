"use client";

import { LocaleSwitcherSelect } from "./locale-switcher-select";
import { useMemo } from "react";
import { useTranslationHandler } from "@/hooks/use-translation-handler";

export const LocaleSwitcher = () => {
  const { locale, msg } = useTranslationHandler();

  const items = useMemo(() => {
    if (!msg["language"] || typeof msg["language"] === "string") return [];
    const commongLang = msg["language"]["common-lang"];
    if (!commongLang || typeof commongLang === "string") return [];
    if (!Array.isArray(commongLang)) return [];
    return commongLang.map((v) => ({ value: v, label: v }));
  }, [msg["language"]]);

  const label = useMemo(() => {
    if (!msg["language"] || typeof msg["language"] === "string")
      return "Language";
    const { label } = msg["language"];
    if (!label || typeof label != "string") return "Language";
    return label;
  }, [msg["language"]]);

  return (
    <LocaleSwitcherSelect defaultValue={locale} items={items} label={label} />
  );
};
