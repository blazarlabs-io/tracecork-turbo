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
import axios from "axios";
import { useEffect, useState } from "react";
import { useTokenizer } from "~/src/context/tokenizer";
import { mDataSample } from "~/src/data/mdata_sample";
import { ipfs } from "~/src/lib/pinata/services";
import { Wine } from "~/src/types/db";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@repo/ui/components/ui/tooltip";

export type UpdateTokenDialogProps = {
  batch: any;
  batchDetails: any;
  wine: Wine;
  children: React.ReactNode;
};

export const UpdateTokenDialog = ({
  batch,
  batchDetails,
  wine,
  children,
}: UpdateTokenDialogProps) => {
  const { updateBatchToken } = useTokenizer();

  const [open, setOpen] = useState<boolean>(false);

  const handleUpdate = async () => {
    setOpen(false);

    try {
      // * Upload image to pinata IPFS
      const imgIpfs = await ipfs.storage.uploadFile(
        wine.generalInfo.image,
        wine,
      );
      // * Update token data
      const updatedBatch = {
        batch_data: {
          info: JSON.stringify(wine),
          mdata: JSON.stringify(mDataSample),
          minscr: "",
        },
        batch_meta: {
          description:
            "This token binds a unique wine collection from tracecorck.com on the cardano blockchain.",
          image: imgIpfs,
          name: wine?.generalInfo.collectionName,
        },
        batch_quantity: [
          parseInt(wine?.generalInfo.collectionSize as string),
          parseInt(wine?.generalInfo.collectionSize as string),
        ],
      };
      // * Update token on blockchain using TWS
      updateBatchToken(batch.tokenRefId, updatedBatch, (data: any) => {
        console.log("UPDATE DONE", data);
      });
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger>
            <DialogTrigger className="border rounded-md border-input p-2 bg-[#aeff00]/30">
              {children}
            </DialogTrigger>
          </TooltipTrigger>
          <TooltipContent className="max-w-[224px]">
            <p>
              Update your token on the blockchain with all latest changes on
              your wine collection.
            </p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
      {/* <DialogTrigger className="border rounded-md border-input p-2 bg-primary/30">
        {children}
      </DialogTrigger> */}
      <DialogContent className="max-w-[640px]">
        <DialogHeader className="flex items-start justify-start">
          <div className="flex flex-row items-start justify-start gap-4">
            <div className="flex flex-col items-start justify-start gap-2">
              <DialogTitle className="">
                Update {batchDetails.batch_meta.name} Token
              </DialogTitle>
              <DialogDescription className="">
                If you continue, all changes you have done to your wine
                collection will be updated on the cardano's blockchain.
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>
        <DialogFooter>
          {/* <DialogClose asChild> */}
          <Button
            onClick={handleUpdate}
            type="button"
            variant="default"
            size="lg"
            className="min-w-[64px] mt-4"
          >
            Update
          </Button>
          {/* </DialogClose> */}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
