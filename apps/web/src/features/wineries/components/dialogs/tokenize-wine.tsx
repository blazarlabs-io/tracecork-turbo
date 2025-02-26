import { Button } from "@repo/ui/components/ui/button";
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
// import { toast } from "@/hooks/use-toast";
// import { db } from "@/lib/firebase/services/db";
import { useTranslationHandler } from "@/hooks/use-translation-handler";
import MarkdownPreviewer from "../../../../components/markdown-previewer/MarkdownPreviewer";

export interface TokenizeWineDialogProps {
  uid: string;
  wineId: string;
  collectionName: string;
  children: React.ReactNode;
}

export const TokenizeWineDialog = ({
  uid,
  wineId,
  collectionName,
  children,
}: TokenizeWineDialogProps) => {
  const { t } = useTranslationHandler();
  const handleTokenize = async () => {
    // TODO: add tokination logic
    // * TOAST
    // toast({
    //   title: "Wine restored",
    //   description: `You have restored ${collectionName} successfully.`,
    // });
  };
  return (
    <Dialog>
      <DialogTitle></DialogTitle>
      <DialogTrigger
        className="disabled:opacity-50 disabled:hover:cursor-not-allowed"
        disabled
      >
        <TooltipProvider>
          <Tooltip delayDuration={0}>
            <TooltipTrigger
              asChild
              className="flex h-9 w-9 items-center justify-center rounded-md bg-background"
            >
              {children}
            </TooltipTrigger>
            <TooltipContent className="max-w-56">
              <p>
                Batch tokenization for supply chain tracking will be implemented
                soon
                {/* {t("myWines.table.rowsActions.3.tooltip")} */}
              </p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {t("dashboardGlobalComponents.dialogs.tokenizeWineDialog.title")}
          </DialogTitle>
          <DialogDescription>
            {/* By confirming, you accept to tokenize your wine on the{" "}
            <span className="font-bold">Cardano</span> blockchain. */}
            <MarkdownPreviewer
              content={t(
                "dashboardGlobalComponents.dialogs.tokenizeWineDialog.description",
              )}
            />
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">
              {t(
                "dashboardGlobalComponents.dialogs.tokenizeWineDialog.buttons.cancelButtonLabel",
              )}
            </Button>
          </DialogClose>
          <DialogClose asChild>
            <Button onClick={handleTokenize}>
              {t(
                "dashboardGlobalComponents.dialogs.tokenizeWineDialog.buttons.confirmButtonLabel",
              )}
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
