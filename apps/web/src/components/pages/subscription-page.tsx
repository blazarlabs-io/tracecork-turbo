"use client";

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
import { useAuth } from "@/context/auth";
import { useQRCodesLimit } from "@/hooks/use-qr-codes-limit";
import { toast } from "@/hooks/use-toast";
import { PageHeader } from "../layouts/page-header";
import { Button } from "@repo/ui/components/ui/button";
import { Separator } from "@repo/ui/components/ui/separator";
import { useResponsiveSize } from "@/hooks/use-responsive-size";
import { cn } from "@/utils/shadcn";
import { useTranslationHandler } from "@/hooks/use-translation-handler";
import MarkdownPreviewer from "../markdown-previewer/MarkdownPreviewer";

export const SubscriptionPage = () => {
  // * HOOKS
  const { t } = useTranslationHandler();
  const { user } = useAuth();
  const { qrCodesLimit, qrCodesLeft, planPrice, planName } = useQRCodesLimit();
  const { device } = useResponsiveSize();

  // * HANDLERS
  const handlePlanUpgradeRequest = () => {
    // Send email
    fetch("/api/send-email", {
      method: "POST",
      body: JSON.stringify({
        to: "c.tudorcotruta@gmail.com",
        templateId: "d-487c5c7d1a094e87a803125e891aac08",
        dynamic_template_data: {
          userEmail: user?.email,
        },
      }),
      headers: {
        "content-type": "application/json",
      },
    })
      .then(async (res) => {
        toast({
          title: "Upgrade request sent",
          description: "We will get back to you as soon as possible.",
        });
      })
      .catch((error) => {
        console.error(error);
        toast({
          variant: "destructive",
          title: "Something went wrong",
          description: "Please try again later.",
        });
      });
  };

  return (
    <div className="flex w-full flex-col gap-6">
      <PageHeader
        title={t("subscription.headline")}
        subtitle={t("subscription.subHeadline")}
      />
      <Separator className="w-full" />
      <div
        className={cn(
          "grid w-full",
          device === "mobile" ? "grid-cols-1" : "grid-cols-2",
        )}
      >
        <div className="grid w-full grid-cols-2 gap-x-8 rounded-[8px] border p-6 shadow-none">
          <div className="flex w-full flex-col items-start justify-between gap-8">
            <div className="flex items-center gap-2 pt-2">
              <div className="rounded-[4px] bg-foreground px-[6px] py-[3px]">
                <span className="text-sm capitalize text-background">
                  {planName}
                </span>
              </div>
              <span className="text-sm font-medium">
                {t("subscription.subscriptionCard.planText")}
              </span>
            </div>
            {device === "mobile" ? (
              <div className="flex flex-col items-center justify-center">
                {qrCodesLeft > 0 ? (
                  <span className="text-foreground">
                    {qrCodesLeft} / {qrCodesLimit} labels
                  </span>
                ) : (
                  <span className="text-destructive">
                    {qrCodesLeft} / {qrCodesLimit} labels
                  </span>
                )}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center">
                {qrCodesLeft > 0 ? (
                  <span className="text-foreground">
                    {`${qrCodesLeft} / ${qrCodesLimit} ${t("subscription.subscriptionCard.labelsRemainingText")}`}
                  </span>
                ) : (
                  <span className="text-destructive">
                    {`${qrCodesLeft} / ${qrCodesLimit} ${t("subscription.subscriptionCard.labelsRemainingText")}`}
                  </span>
                )}
              </div>
            )}
          </div>
          <div className="flex flex-col items-end justify-end gap-4">
            <div className="flex items-center justify-center gap-2">
              <span className="text-sm font-medium">€</span>
              <span className="text-5xl font-bold">{planPrice}</span>
              <span className="text-sm font-medium text-muted-foreground">
                {`/${t("subscription.subscriptionCard.perYearText")}`}
              </span>
            </div>
            <Dialog>
              <DialogTitle></DialogTitle>
              <DialogTrigger className="max-w-fit rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground">
                {t("subscription.subscriptionCard.upgradeButtonLabel")}
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>
                    {t(
                      "dashboardGlobalComponents.dialogs.upgradeWineDialog.title",
                    )}
                  </DialogTitle>
                  <DialogDescription>
                    <MarkdownPreviewer
                      content={t(
                        "dashboardGlobalComponents.dialogs.upgradeWineDialog.description",
                      )}
                    />
                    {/* Upgrade your plan to unlock all features. By clicking{" "}
                    <span className="font-bold">Upgrade</span> you accept to be
                    contacted by our sales team. */}
                  </DialogDescription>
                </DialogHeader>
                <DialogFooter>
                  <DialogClose asChild onClick={handlePlanUpgradeRequest}>
                    <Button>
                      {t(
                        "dashboardGlobalComponents.dialogs.upgradeWineDialog.buttons.confirmButtonLabel",
                      )}
                    </Button>
                  </DialogClose>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </div>
    </div>
  );
};
