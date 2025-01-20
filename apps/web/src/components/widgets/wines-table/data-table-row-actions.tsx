"use client";

import { useResponsiveSize } from "@/hooks/use-responsive-size";
import { DataTableRowActionsDesktop } from "./data-table-row-actions-desktop";
import { DataTableRowActionsMobile } from "./data-table-row-actions-mobile";

interface DataTableRowActionsProps<TData> {
  row: any;
}

export function DataTableRowActions<TData>({
  row,
}: DataTableRowActionsProps<TData>) {
  const { device } = useResponsiveSize();

  if (device === "mobile") {
    return <DataTableRowActionsMobile row={row} />;
  } else {
    return <DataTableRowActionsDesktop row={row} />;
  }
}
