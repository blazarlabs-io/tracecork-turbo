"use client";

import { useHandleWineToEdit } from "~/src/features/wineries/hooks/use-handle-wine-to-edit";
import { Separator } from "@repo/ui/components/ui/separator";
import { useRouter } from "next/navigation";
import { WineDetailsPrivatePage } from "~/src/features/wineries/pages/wines/wine-details-private";

export interface WinePreviewProps {
  wineId: string;
}
export const WinePreview = ({ wineId }: WinePreviewProps) => {
  // * HOOKS
  const { wine } = useHandleWineToEdit(wineId);
  const router = useRouter();

  // * HANDLERS
  const handleBack = () => {
    router.back();
  };

  return (
    <div className="flex w-full flex-col gap-6">
      {wine && <WineDetailsPrivatePage wineId={wine.id} />}
      <Separator className="w-full" />
    </div>
  );
};
