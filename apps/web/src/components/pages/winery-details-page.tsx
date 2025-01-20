"use client";

import { Save } from "lucide-react";
import { WineryForm } from "@/components/forms/winery-form";
import { PageHeader } from "@/components/layouts/page-header";
import { Separator } from "@repo/ui/components/ui/separator";

export const WineryDetailsPage = () => {
  return (
    <div className="flex w-full flex-col gap-6">
      <div className="flex w-full items-end justify-between">
        <PageHeader
          title="Winery Details"
          subtitle="Set and update your winery details at any time."
        />
        {/* <div className="flex min-w-fit items-center gap-2">
          <Save size={16} className="text-primary" />
          <p className="text-xs font-medium text-muted-foreground">
            Autosave enabled
          </p>
        </div> */}
      </div>
      <Separator className="w-full" />
      <WineryForm />
    </div>
  );
};
