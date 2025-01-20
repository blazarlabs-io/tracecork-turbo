import { PageHeader } from "@/components/layouts/page-header";
import { Separator } from "@repo/ui/components/ui/separator";
import { AutoSave } from "../forms/auto-save";

export const GeneralSettingsPage = () => {
  return (
    <div className="flex w-full flex-col gap-6">
      <PageHeader
        title="General Settings"
        subtitle="Manage all general settings."
      />
      <Separator className="w-full" />
      <AutoSave />
    </div>
  );
};
