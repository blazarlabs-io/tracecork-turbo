import { cn } from "@repo/ui/lib/utils";
import { helix } from "ldrs";
import { useEffect, useRef, useState } from "react";

helix.register();

// Default values shown

export const TokenizingLoader = () => {
  return (
    <div className="bg-background animate-bounce shadow-md flex items-center justify-center gap-4 rounded-md">
      <div className="flex items-center justify-center h-[88px] bg-primary p-3 rounded-l-md">
        <l-helix size="48" speed="2.0" color="white"></l-helix>
      </div>
      <div className="flex flex-col items-start justify-center gap-1 max-w-56 pr-6 py-4">
        <p className="text-sm font-medium">Please wait</p>
        <p className="text-xs">
          We are tokenizing your wine data and will let you know when it is
          done.
        </p>
      </div>
    </div>
  );
};
