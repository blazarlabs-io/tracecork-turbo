"use client";

import { AppSidebar } from "@/components/navigation/app-sidebar";
import { useTokenizer } from "~/src/context/tokenizer";
import { Tokenizer } from "@/components/widgets/tokenizer";

export const PrivateLayout = ({ children }: { children: React.ReactNode }) => {
  const { tokenizing } = useTokenizer();
  return (
    <>
      {/* {tokenizing && ( */}
      <div className="fixed z-50 flex items-center justify-center left-2 bottom-2">
        <Tokenizer />
      </div>
      {/* )} */}
      <AppSidebar>
        <main className="overflow-hidden p-1 sm:p-2 md:p-3 lg:p-6">
          {children}
        </main>
      </AppSidebar>
    </>
  );
};
