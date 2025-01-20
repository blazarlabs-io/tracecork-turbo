import { Wine } from "@/types/db";
import { TriangleAlert } from "lucide-react";

export interface WinePublishProps {
  wine: Wine;
}

export const WinePublish = ({ wine }: WinePublishProps) => {
  return (
    <div className="mx-auto my-6 max-w-[520px] rounded-md border border-[#f2d450] bg-[#fffefb] p-4">
      <TriangleAlert className="mr-2 inline-block h-5 w-5 text-[#f2d450]" />
      <span>
        You are about to publish your wine. Please confirm to continue.
      </span>
    </div>
  );
};
