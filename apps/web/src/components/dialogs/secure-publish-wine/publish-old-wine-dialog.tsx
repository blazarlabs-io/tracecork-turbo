import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@repo/ui/components/ui/dialog";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@repo/ui/components/ui/tooltip";
import { useAuth } from "@/context/auth";
import { toast } from "@/hooks/use-toast";
import { db } from "@/lib/firebase/services/db";
import { useCallback } from "react";
import { useTranslationHandler } from "@/hooks/use-translation-handler";
import MarkdownPreviewer from "../../markdown-previewer/MarkdownPreviewer";

interface PublishOldWineDialogProps {
  children: React.ReactNode;
  uid: string;
  wineId: string;
  collectionName: string;
  onAction?: (state: string) => void;
}

export const PublishOldWineDialog = ({
  children,
  uid,
  wineId,
  collectionName,
  onAction,
}: PublishOldWineDialogProps) => {
  // * HOOKS
  const { t } = useTranslationHandler();
  const { user } = useAuth();

  // * HANDLE PUBLISH WINE
  const handlePublish = useCallback(async () => {
    await db.wine.update(uid, wineId, {
      status: "published",
      publicUrl: `/explore/wine/${wineId}`,
    });

    if (typeof window !== "undefined") {
      window.open("/explore/wine/" + wineId, "_blank");
    }

    // * TOAST
    toast({
      title: t("toasts.wines.publishWine.title"),
      description: t("toasts.wines.publishWine.description", {
        name: collectionName,
      }),
    });

    // * Send email to user
    await fetch("/api/send-email", {
      method: "POST",
      body: JSON.stringify({
        to: user?.email,
        templateId: "d-dafcb6f19cf841b690457b8d91f30264",
        dynamic_template_data: {
          user: (user?.displayName as string) || user?.email,
          wineUrl: `${process.env.NEXT_PUBLIC_DYNAMIC_QR_CODES_REDIRECT_URL as string}${wineId}`,
        },
      }),
    });

    if (onAction) onAction("PublishOldWineDialog");
  }, [uid, wineId, collectionName, onAction]);

  return (
    <>
      <Dialog>
        <DialogTrigger className="">
          <TooltipProvider>
            <Tooltip delayDuration={0}>
              <TooltipTrigger asChild className="">
                {children}
              </TooltipTrigger>
              <TooltipContent>
                <p>{t("myWines.table.rowsActions.1.tooltip")}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {t("dashboardGlobalComponents.dialogs.publishWineDialog.title")}
            </DialogTitle>
            <DialogDescription>
              <MarkdownPreviewer
                content={t(
                  "dashboardGlobalComponents.dialogs.publishWineDialog.description",
                )}
              />
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex justify-end">
            <DialogClose asChild>
              <span className="flex h-10 cursor-pointer items-center justify-center rounded-md px-6 text-foreground transition duration-200 ease-in-out hover:bg-muted">
                {t(
                  "dashboardGlobalComponents.dialogs.publishWineDialog.buttons.cancelButtonLabel",
                )}
              </span>
            </DialogClose>
            <DialogClose asChild onClick={handlePublish}>
              <span className="flex h-10 cursor-pointer items-center justify-center rounded-md bg-primary px-6 text-primary-foreground transition duration-200 ease-in-out hover:bg-primary/80">
                {t(
                  "dashboardGlobalComponents.dialogs.publishWineDialog.buttons.confirmButtonLabel",
                )}
              </span>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};
