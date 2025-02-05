"use client";

import { WineNutritionalInfo } from "@/types/db";
import { useKjAndKcal } from "@/hooks/use-kj-and-kcal";
import { useExtraValidations } from "@/hooks/use-extra-validations";
import { useTranslationHandler } from "@/hooks/use-translation-handler";

export interface NutritionTableProps {
  data: WineNutritionalInfo;
  sugar: string;
  volume: string;
  abv: string;
}

export const NutritionTable = ({
  data,
  sugar,
  volume,
  abv,
}: NutritionTableProps) => {
  // * HOOKS
  const { t } = useTranslationHandler();
  const { kj, kcal } = useKjAndKcal(
    parseFloat(volume),
    parseFloat(sugar),
    parseFloat(abv),
  );

  return (
    <div className="flex w-full max-w-[640px] flex-col gap-3 rounded-md border p-6">
      <div className="w-full">
        <h2 className="text-xl font-black">
          {t("wineStepper.previewWine.nutritionTable.title")}
        </h2>
      </div>
      <div className="flex w-full items-center justify-end">
        <h2 className="text-sm">
          {`${t("wineStepper.previewWine.nutritionTable.perMlText")} 100 ml`}
        </h2>
      </div>
      <div className="h-2 w-full bg-border" />
      {/* * ENERGY */}
      <div className="flex w-full items-center justify-between">
        <span className="text-base font-bold">
          {t("wineStepper.previewWine.nutritionTable.energy")}
        </span>
        {/* <span className="text-base font-bold">{data.energy} kj</span> */}
        <span className="text-base font-bold">{kj} kj</span>
      </div>
      <div className="flex w-full items-center justify-between">
        <span className="text-base"></span>
        {/* <span className="text-base font-bold">
          {Math.round(parseInt(data.energy as string) / 4.184).toString()} kcal
        </span> */}
        <span className="text-base font-bold">{kcal} kcal</span>
      </div>
      <div className="h-[1px] w-full bg-border" />
      {/* * CARBOHYDRATES */}
      <div className="flex w-full items-center justify-between">
        <span className="text-base font-bold">
          {t("wineStepper.previewWine.nutritionTable.carbohydrates.label")}
        </span>
        <span className="text-base font-bold">
          {(parseFloat(data.carbohydrates as string) / 10)
            .toFixed(1)
            .toString()}{" "}
          g
        </span>
      </div>
      <div className="flex w-full items-center justify-between">
        <span className="text-base">
          {t(
            "wineStepper.previewWine.nutritionTable.carbohydrates.description",
          )}
        </span>
        <span className="text-base">
          {(parseFloat(sugar) / 10).toFixed(1).toString()} g
        </span>
      </div>
      <div className="h-[1px] w-full bg-border" />
      {/* * FAT */}
      <div className="flex w-full items-center justify-between">
        <span className="text-base font-bold">
          {t("wineStepper.previewWine.nutritionTable.fat.label")}
        </span>
        <span className="text-base font-bold">
          {(parseFloat(data.fat as string) / 10).toFixed(1).toString()} g
        </span>
      </div>
      <div className="flex w-full items-center justify-between">
        <span className="text-base">
          {t("wineStepper.previewWine.nutritionTable.fat.description")}
        </span>
        <span className="text-base">
          {(parseFloat(data.fat as string) / 10).toFixed(1).toString()} g
        </span>
      </div>
      <div className="h-[1px] w-full bg-border" />
      {/* * PROTEIN */}
      <div className="flex w-full items-center justify-between">
        <span className="text-base font-bold">
          {t("wineStepper.previewWine.nutritionTable.protein")}
        </span>
        <span className="text-base font-bold">
          {(parseFloat(data.protein as string) / 10).toFixed(1).toString()} g
        </span>
      </div>
      <div className="h-[1px] w-full bg-border" />
      {/* * SALT */}
      <div className="flex w-full items-center justify-between">
        <span className="text-base font-bold">
          {t("wineStepper.previewWine.nutritionTable.salt")}
        </span>
        <span className="text-base font-bold">
          {(parseFloat(data.salt as string) / 10).toFixed(1).toString()} g
        </span>
      </div>
      <div className="mt-4">
        <span className="text-base">
          Contains {parseInt(volume) / 100} portions of 100 ml
        </span>
      </div>
    </div>
  );
};
