import { useMemo } from "react";
import { useSystemVariables } from "~/src/context/system-variables";

type Props = {
  wineType: string;
  wienSweetness: string;
};

export const useSystemVariablesTranslations = ({
  wineType,
  wienSweetness,
}: Props) => {
  const { sweetness, wineTypes } = useSystemVariables();

  const wineTypeIndex = useMemo(() => {
    return wineTypes.findIndex((w) => w === wineType);
  }, [wineType]);

  const swwetnessTransData = useMemo(() => {
    if (wineType.toLowerCase() === "sparkling wine") {
      return {
        index: sweetness?.sparkling.findIndex((s) => s === wienSweetness),
        field: "sparkling",
      };
    } else if (wineType.toLowerCase() === "dessert wine") {
      return {
        index: sweetness?.dessert.findIndex((s) => s === wienSweetness),
        field: "dessert",
      };
    } else {
      return {
        index: sweetness?.other.findIndex((s) => s === wienSweetness),
        field: "other",
      };
    }
  }, [wienSweetness]);

  return {
    wineTypeIndex,
    swwetnessTransData,
  };
};
