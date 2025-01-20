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
import { useAuth } from "@/context/auth";
import { toast } from "@/hooks/use-toast";
import { db } from "@/lib/firebase/services/db";

export interface RestoreWineDialogProps {
  uid: string;
  wineId: string;
  collectionName: string;
  children: React.ReactNode;
}

export const RestoreWineDialog = ({
  uid,
  wineId,
  collectionName,
  children,
}: RestoreWineDialogProps) => {
  // * HOOKS
  const { user } = useAuth();

  const handleRestore = async () => {
    await db.wine.update(uid, wineId, {
      status: "draft",
      publicUrl: "",
    });

    // * TOAST
    toast({
      title: "Wine restored",
      description: `You have restored ${collectionName} successfully.`,
    });

    // * Send email to user
    await fetch("/api/send-email", {
      method: "POST",
      body: JSON.stringify({
        to: user?.email,
        templateId: "d-82b6e4535ce740adb10e54eda0a0b77d",
        dynamic_template_data: {
          user: (user?.displayName as string) || user?.email,
          wineId: wineId,
        },
      }),
    });
  };
  return (
    <Dialog>
      <DialogTitle></DialogTitle>
      <DialogTrigger className="">
        <TooltipProvider>
          <Tooltip delayDuration={0}>
            <TooltipTrigger
              asChild
              className="flex h-9 w-9 items-center justify-center rounded-md bg-background"
            >
              {children}
            </TooltipTrigger>
            <TooltipContent>
              <p>Restore wine</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Restore Wine?</DialogTitle>
          <DialogDescription>
            By confirming, you accept to restore your wine.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Cancel</Button>
          </DialogClose>
          <DialogClose asChild>
            <Button onClick={handleRestore}>Confirm</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
