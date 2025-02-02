import { useMemo } from "react";
import { statuses } from "../data/data";
import { useTranslationHandler } from "@/hooks/use-translation-handler";

export const useGetStatuseOptions = () => {
  const { msg, locale } = useTranslationHandler();

  const options = useMemo(() => {
    const localMsg = msg[`${locale}`];
    if (!localMsg || typeof localMsg === "string") return [];
    const { myWines } = localMsg;
    if (!myWines || typeof myWines === "string") return [];
    const { filters } = myWines;
    if (!filters || typeof filters === "string") return [];
    const { status } = filters;
    if (!status || typeof status === "string") return [];
    const { states } = status;
    if (!states || typeof states === "string") return [];
    return statuses.map((s, i) => ({
      ...s,
      label: (states[i] as string) || "NA",
    }));
  }, [msg, locale]);

  return { options };
};
