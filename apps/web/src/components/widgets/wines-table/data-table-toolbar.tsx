"use client";

import { Table } from "@tanstack/react-table";
import { X } from "lucide-react";

import { Button } from "@repo/ui/components/ui/button";
import { Input } from "@repo/ui/components/ui/input";
import { DataTableViewOptions } from "@/components/widgets/wines-table/data-table-view-options";

import { statuses } from "./data/data";
import { DataTableFacetedFilter } from "./data-table-faceted-filter";
import { cn } from "@/utils/shadcn";
import { useResponsiveSize } from "@/hooks/use-responsive-size";

interface DataTableToolbarProps<TData> {
  table: Table<TData>;
}

export function DataTableToolbar<TData>({
  table,
}: DataTableToolbarProps<TData>) {
  const isFiltered = table.getState().columnFilters.length > 0;

  const { device } = useResponsiveSize();

  return (
    <div
      className={cn(
        "flex items-center justify-between",
        device === "desktop" ? "justify-between" : "max-w-fit justify-start",
      )}
    >
      <div className="flex flex-1 items-center space-x-2">
        <Input
          placeholder="Filter by collection name..."
          value={
            (table
              .getColumn("generalInfo_collectionName")
              ?.getFilterValue() as string) ?? ""
          }
          onChange={(event) =>
            table
              .getColumn("generalInfo_collectionName")
              ?.setFilterValue(event.target.value)
          }
          className="h-8 w-[150px] lg:w-[250px]"
        />
        {table.getColumn("status") && (
          <DataTableFacetedFilter
            column={table.getColumn("status")}
            title="Status"
            options={statuses}
          />
        )}
        {isFiltered && (
          <Button
            variant="ghost"
            onClick={() => table.resetColumnFilters()}
            className="h-8 px-2 lg:px-3"
          >
            Reset
            <X />
          </Button>
        )}
      </div>
      <DataTableViewOptions table={table} />
    </div>
  );
}
