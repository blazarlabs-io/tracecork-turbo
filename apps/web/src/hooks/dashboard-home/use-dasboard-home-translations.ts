import { useMemo } from "react";
import { useTranslationHandler } from "../use-translation-handler";

export const useDashboardHomeTranslations = () => {
  const { t, msg, locale } = useTranslationHandler();

  const statCards = useMemo(() => {
    const localMsg = msg[`${locale}`];
    if (!localMsg || typeof localMsg === "string") return [];
    const { dashboardHome } = localMsg;
    if (!dashboardHome || typeof dashboardHome === "string") return [];
    const { statCards } = dashboardHome;
    if (!Array.isArray(statCards)) return [];
    return statCards;
  }, [msg, locale]);

  return { t, statCards };
};
