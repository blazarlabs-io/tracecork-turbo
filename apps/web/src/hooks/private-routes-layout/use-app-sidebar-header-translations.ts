import { useMemo } from "react";
import { useTranslationHandler } from "../use-translation-handler";

export const useAppSidebarHeaderTranslations = () => {
  const { t, msg, locale } = useTranslationHandler();

  const dropDownMenu = useMemo(() => {
    const localMsg = msg[`${locale}`];
    if (!localMsg || typeof localMsg === "string") return [];
    const { dashboardGlobalComponents } = localMsg;
    if (
      !dashboardGlobalComponents ||
      typeof dashboardGlobalComponents === "string"
    )
      return [];
    const { topBar } = dashboardGlobalComponents;
    if (!topBar || typeof topBar === "string") return [];
    const { dropdown } = topBar;
    if (!Array.isArray(dropdown)) return [];
    return dropdown;
  }, [msg, locale]);

  return { t, dropDownMenu };
};
