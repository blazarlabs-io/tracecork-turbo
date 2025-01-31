import { useMemo } from "react";
import { useTranslationHandler } from "../use-translation-handler";

export const useAppSidebarHeaderTranslations = () => {
  const { t, msg, locale } = useTranslationHandler();

  const itemsMenu = useMemo(() => {
    const localMsg = msg[`${locale}`];
    if (!localMsg || typeof localMsg === "string") return [];
    const { dashboardGlobalComponents } = localMsg;
    if (
      !dashboardGlobalComponents ||
      typeof dashboardGlobalComponents === "string"
    )
      return [];
    const { sideBar } = dashboardGlobalComponents;
    if (!sideBar || typeof sideBar === "string") return [];
    const { items } = sideBar;
    if (!Array.isArray(items)) return [];
    return items;
  }, [msg, locale]);

  return { t, itemsMenu };
};
