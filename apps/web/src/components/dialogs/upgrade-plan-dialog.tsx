import { LoaderCircle } from "lucide-react";
import { Button } from "@repo/ui/components/ui/button";
import {
  DialogHeader,
  DialogFooter,
  Dialog,
  DialogTitle,
  DialogTrigger,
  DialogContent,
  DialogDescription,
  DialogClose,
} from "@repo/ui/components/ui/dialog";
import { toast } from "@/hooks/use-toast";
import { useState } from "react";
import { useAuth } from "@/context/auth";
import "./upgrade-plan-dialog-styles.css";
import { useTranslationHandler } from "@/hooks/use-translation-handler";
import MarkdownPreviewer from "../markdown-previewer/MarkdownPreviewer";

export const UpgradePlanDialog = () => {
  const { t } = useTranslationHandler();
  // * HOOKS
  const { user } = useAuth();

  // * STATES
  const [sending, setSending] = useState<boolean>(false);

  // * METHODS
  const handlePlanUpgradeRequest = () => {
    // Send email
    fetch("/api/send-email", {
      method: "POST",
      body: JSON.stringify({
        to: process.env.NEXT_PUBLIC_TRACECORK_EMAIL as string,
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
        setSending(false);
        toast({
          title: "Upgrade request sent",
          description: "We will get back to you as soon as possible.",
        });
      })
      .catch((error) => {
        console.error(error);
        setSending(false);
        toast({
          variant: "destructive",
          title: "Something went wrong",
          description: "Please try again later.",
        });
      });
  };

  return (
    <>
      {user && (
        <Dialog>
          <DialogTitle></DialogTitle>
          <DialogTrigger className="max-w-fit rounded-full bg-gradient-to-br from-primary to-[#AAFF7F] px-4 py-2 text-xs text-foreground">
            {t("dashboardHome.avatarCard.upgradeButtonLabel")}
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {t("dashboardGlobalComponents.dialogs.upgradeWineDialog.title")}
              </DialogTitle>
              <DialogDescription className="dialgo-description">
                <MarkdownPreviewer
                  content={t(
                    "dashboardGlobalComponents.dialogs.upgradeWineDialog.description",
                  )}
                />
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <DialogClose asChild onClick={handlePlanUpgradeRequest}>
                {sending ? (
                  <LoaderCircle className="animate-spin" />
                ) : (
                  <Button>
                    {t(
                      "dashboardGlobalComponents.dialogs.upgradeWineDialog.buttons.confirmButtonLabel",
                    )}
                  </Button>
                )}
              </DialogClose>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </>
  );
};
