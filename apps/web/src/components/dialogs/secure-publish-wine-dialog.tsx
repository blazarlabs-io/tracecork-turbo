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
import { dynamicQrCodeTemplate } from "@/data/templates";
import { useQrCodeExists } from "@/hooks/use-qr-code-exists";
import { useQRCodesLimit } from "@/hooks/use-qr-codes-limit";
import { toast } from "@/hooks/use-toast";
import { db } from "@/lib/firebase/services/db";
import { storage } from "@/lib/firebase/services/storage";
import { useRouter } from "next/navigation";
import { useCallback, useState } from "react";
import { DynamicQrCodeGenerator } from "@/components/widgets/dynamic-qr-code-generator";

export interface SecurePublishWineDialogProps {
  uid: string;
  wineId: string;
  collectionName: string;
  isReadytoPublish: boolean;
  className?: string;
  children?: React.ReactNode;
  onChange?: (open: boolean) => void;
  onPublish?: (url: string) => void;
  onAction?: (state: string) => void;
}

export const SecurePublishWineDialog = ({
  uid,
  wineId,
  collectionName,
  isReadytoPublish,
  className,
  children,
  onPublish = async () => {},
  onAction = async () => {},
}: SecurePublishWineDialogProps) => {
  // * HOOKS

  const { qrCodesLeft } = useQRCodesLimit();
  const { qrCodeExists } = useQrCodeExists(uid, wineId);

  return (
    <>
      {qrCodeExists ? (
        <>
          {isReadytoPublish ? (
            <>
              {/* * PUBLISH WINE (OLD WINE) */}
              <PublishOldWineDialog
                uid={uid}
                wineId={wineId}
                collectionName={collectionName}
                onAction={onAction}
              >
                {children}
              </PublishOldWineDialog>
            </>
          ) : (
            <>
              {/* * MISSING FIELDS */}
              <MissingFieldsDialog wineId={wineId} onAction={onAction}>
                {children}
              </MissingFieldsDialog>
            </>
          )}
        </>
      ) : (
        <>
          {isReadytoPublish ? (
            <>
              {qrCodesLeft > 0 ? (
                <>
                  {/* * PUBLISH WINE (NEW WINE) */}
                  <PublishNewWineDialog
                    uid={uid}
                    wineId={wineId}
                    isReadytoPublish={isReadytoPublish}
                    collectionName={collectionName}
                    onPublish={onPublish}
                    onAction={onAction}
                  >
                    {children}
                  </PublishNewWineDialog>
                </>
              ) : (
                <>
                  {/* * QR CODE QUOTA EXCEEDED */}
                  <QrCodeQuaotaExceededDialog onAction={onAction}>
                    {children}
                  </QrCodeQuaotaExceededDialog>
                </>
              )}
            </>
          ) : (
            <>
              {/* * MISSING FIELDS */}
              <MissingFieldsDialog wineId={wineId} onAction={onAction}>
                {children}
              </MissingFieldsDialog>
            </>
          )}
        </>
      )}
    </>
  );
};

interface PublishOldWineDialogProps {
  children: React.ReactNode;
  uid: string;
  wineId: string;
  collectionName: string;
  onAction?: (state: string) => void;
}

const PublishOldWineDialog = ({
  children,
  uid,
  wineId,
  collectionName,
  onAction,
}: PublishOldWineDialogProps) => {
  // * HOOKS
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
      title: "Wine published",
      description: `You have published ${collectionName} successfully.`,
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
                <p>Publish wine</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Publish Wine</DialogTitle>
            <DialogDescription>
              By confirming, you accept to make public your registered wine,
              following all{" "}
              <span className="italic">EU Wine Labeling Regulations</span>. Your
              wine will be accessible by scanning our{" "}
              <span className="font-bold">Tracecork</span> generated QR code or
              by using our public and free wine explorer APP.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex justify-end">
            <DialogClose asChild>
              <span className="flex h-10 cursor-pointer items-center justify-center rounded-md px-6 text-foreground transition duration-200 ease-in-out hover:bg-muted">
                Cancel
              </span>
            </DialogClose>
            <DialogClose asChild onClick={handlePublish}>
              <span className="flex h-10 cursor-pointer items-center justify-center rounded-md bg-primary px-6 text-primary-foreground transition duration-200 ease-in-out hover:bg-primary/80">
                Confirm
              </span>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

const PublishNewWineDialog = ({
  children,
  uid,
  wineId,
  collectionName,
  onPublish,
  onAction,
}: SecurePublishWineDialogProps) => {
  // * HOOKS
  const router = useRouter();
  const { user } = useAuth();

  // * STATES
  const [qrCodeImageFile, setQrCodeImageFile] = useState<File | null>(null);

  // * HANDLE QR CODE
  const handleQrCode = useCallback(
    async (qrCodeImageFile: File) => {
      const qrCodeRes = await db.qrcode.getOne(uid, wineId);

      // * Check if wine has QR code already, if not, generate it
      if (!qrCodeRes.data) {
        storage.winery
          .upload(
            qrCodeImageFile,
            `wineries/${uid}/wines/${wineId}/`,
            (progress: any) => {
              // console.log("progress", progress);
            },
            (error: any) => {
              console.log(error);
            },
            async (url: any) => {
              //   setQrCodeUrl(url);
              if (onPublish) onPublish(url);
              //   form.setValue("qrCode", url);
              await db.wine.update(uid, wineId, {
                status: "published",
                publicUrl: `/explore/wine/${wineId}`,
                qrCode: url,
              });

              dynamicQrCodeTemplate.uid = uid as string;
              dynamicQrCodeTemplate.wineId = wineId;
              dynamicQrCodeTemplate.imageUrl = url;
              dynamicQrCodeTemplate.staticUrl = `${process.env.NEXT_PUBLIC_DYNAMIC_QR_CODES_STATIC_URL as string}${wineId}`;
              dynamicQrCodeTemplate.redirectUrl = `${process.env.NEXT_PUBLIC_DYNAMIC_QR_CODES_REDIRECT_URL as string}${wineId}`;

              // * Set dynamic QR code in DB
              await db.qrcode.set(uid, dynamicQrCodeTemplate);

              // * Send email to user
              await fetch("/api/send-email", {
                method: "POST",
                body: JSON.stringify({
                  to: user?.email,
                  templateId: "d-e43ea96c084e472abf812e22f2412c8e",
                  dynamic_template_data: {
                    user: (user?.displayName as string) || user?.email,
                    wineUrl: dynamicQrCodeTemplate.redirectUrl,
                    qrCodeUrl: dynamicQrCodeTemplate.imageUrl,
                  },
                }),
              });
            },
          )
          .then(() => {
            // console.log("Uploaded");
          })
          .catch((error: any) => console.log(error));
      } else {
        // console.log("QR CODE ALREADY EXISTS");
      }
      router.replace("/dashboard/my-wines");
    },
    [onPublish, router, uid, user?.email, wineId],
  );

  // * HANDLE PUBLISH WINE
  const handlePublish = useCallback(async () => {
    await db.wine.update(uid, wineId, {
      status: "published",
      publicUrl: `/explore/wine/${wineId}`,
    });

    // if (onPublish) await onPublish(qrCodeImageFile as File);
    await handleQrCode(qrCodeImageFile as File);

    if (typeof window !== "undefined") {
      window.open("/explore/wine/" + wineId, "_blank");
    }

    // * TOAST
    toast({
      title: "Wine published",
      description: `You have published ${collectionName} successfully.`,
    });

    if (onAction) onAction("PublishNewWineDialog");
  }, [uid, wineId, handleQrCode, qrCodeImageFile, collectionName, onAction]);

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
                <p>Publish wine</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Publish Wine</DialogTitle>
            <DialogDescription>
              By confirming, you accept to make public your registered wine,
              following all{" "}
              <span className="italic">EU Wine Labeling Regulations</span>. Your
              wine will be accessible by scanning our{" "}
              <span className="font-bold">Tracecork</span> generated QR code or
              by using our public and free wine explorer APP.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex justify-end">
            <DynamicQrCodeGenerator
              wineId={wineId}
              onGenerated={(file, base64) => {
                setQrCodeImageFile(file);
              }}
            />
            <DialogClose asChild>
              <span className="flex h-10 cursor-pointer items-center justify-center rounded-md px-6 text-foreground transition duration-200 ease-in-out hover:bg-muted">
                Cancel
              </span>
            </DialogClose>
            <DialogClose asChild onClick={handlePublish}>
              <span className="flex h-10 cursor-pointer items-center justify-center rounded-md bg-primary px-6 text-primary-foreground transition duration-200 ease-in-out hover:bg-primary/80">
                Confirm
              </span>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export interface QrCodeQuaotaExceededDialogProps {
  children: React.ReactNode;
  onAction?: (state: string) => void;
}

const QrCodeQuaotaExceededDialog = ({
  children,
  onAction = () => {},
}: QrCodeQuaotaExceededDialogProps) => {
  const router = useRouter();

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
                <p>Publish wine</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Unable to Publish Wine</DialogTitle>
            <DialogDescription>
              <span>
                You have reached your maximum number of QR codes. You cannot
                publish a wine without a QR code. Please{" "}
                <span
                  onClick={() => {
                    router.push("/pricing");
                    if (onAction) onAction("QrCodeQuaotaExceededDialog");
                  }}
                  className="cursor-pointer font-bold text-primary underline"
                >
                  upgrade your plan
                </span>{" "}
                in order to publish more wines.
              </span>
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex justify-end">
            <DialogClose asChild></DialogClose>
            <DialogClose asChild>
              <span className="flex h-10 cursor-pointer items-center justify-center rounded-md bg-primary px-6 text-primary-foreground transition duration-200 ease-in-out hover:bg-primary/80">
                Ok
              </span>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export interface MissingFieldsDialogProps {
  children: React.ReactNode;
  wineId: string;
  onAction?: (state: string) => void;
}

const MissingFieldsDialog = ({
  children,
  wineId,
  onAction = () => {},
}: MissingFieldsDialogProps) => {
  // * HOOKS
  const router = useRouter();

  // * HANDLE EDIT WINE
  const handleEdit = () => {
    router.push(`/dashboard/my-wines/editor/${wineId}`);
    if (onAction) onAction("MissingFieldsDialog");
  };

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
                <p>Publish wine</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Unable to Publish Wine</DialogTitle>
            <DialogDescription>
              <span>
                Your wine is missing required fields. Please fill in all{" "}
                <span className="font-bold text-destructive">required</span>{" "}
                fields before publishing.
              </span>
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex justify-end">
            <DialogClose asChild onClick={handleEdit}>
              <span className="flex h-10 cursor-pointer items-center justify-center rounded-md bg-primary px-6 text-primary-foreground transition duration-200 ease-in-out hover:bg-primary/80">
                Ok
              </span>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};
