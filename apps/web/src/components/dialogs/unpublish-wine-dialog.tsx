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

export interface PublishWineDialogProps {
  uid: string;
  wineId: string;
  collectionName: string;
  children: React.ReactNode;
}

export const UnpublishWineDialog = ({
  uid,
  wineId,
  collectionName,
  children,
}: PublishWineDialogProps) => {
  // * HOOKS
  const { user } = useAuth();

  const handleUnpublish = async () => {
    await db.wine.update(uid, wineId, {
      status: "draft",
      publicUrl: "",
    });

    // * TOAST
    toast({
      title: "Wine unpublished",
      description: `You have unpublished ${collectionName} successfully.`,
    });

    // * Send email to user
    await fetch("/api/send-email", {
      method: "POST",
      body: JSON.stringify({
        to: user?.email,
        templateId: "d-e5083bf8aa8447f180c4d5a58224cb70",
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
              <p>Unpublish wine</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Unpublish Wine</DialogTitle>
          <DialogDescription>
            By confirming, you accept to{" "}
            <span className="font-bold">unpublish</span> your wine. Your wine
            will be hidden from our public wine explorer.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="flex justify-end">
          <DialogClose asChild>
            <Button type="button" variant="ghost">
              Cancel
            </Button>
          </DialogClose>
          <DialogClose asChild>
            <Button type="button" variant="default" onClick={handleUnpublish}>
              Confirm
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
