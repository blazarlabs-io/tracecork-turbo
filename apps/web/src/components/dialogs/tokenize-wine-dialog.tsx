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
import { toast } from "@/hooks/use-toast";
import { db } from "@/lib/firebase/services/db";

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
              </p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Tokenize Wine?</DialogTitle>
          <DialogDescription>
            By confirming, you accept to tokenize your wine on the{" "}
            <span className="font-bold">Cardano</span> blockchain.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Cancel</Button>
          </DialogClose>
          <DialogClose asChild>
            <Button onClick={handleTokenize}>Confirm</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
