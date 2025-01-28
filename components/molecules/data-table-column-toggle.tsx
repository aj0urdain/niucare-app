"use client";

import { DropdownMenuTrigger } from "@radix-ui/react-dropdown-menu";
import { Table } from "@tanstack/react-table";
import { Filter, Settings2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";

interface DataTableViewOptionsProps<TData> {
  table: Table<TData>;
  label?: string;
  labelClassName?: string;
}

export function DataTableViewOptions<TData>({
  table,
  label = "Columns",
  labelClassName = "text-xs font-semibold text-muted-foreground/75 flex items-center gap-1",
}: DataTableViewOptionsProps<TData>) {
  return (
    <div className="grid w-fit min-w-40 items-center gap-1.5">
      <label className={labelClassName}>
        <Filter className="h-3 w-3" />
        {label}
      </label>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="outline"
            className="ml-auto flex min-w-40 justify-start"
          >
            <Settings2 className="h-4 w-4" />
            Columns
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          align="end"
          className="w-[150px]"
          style={{
            width: "var(--radix-popover-trigger-width)",
          }}
        >
          <DropdownMenuLabel>Toggle columns</DropdownMenuLabel>
          <DropdownMenuSeparator />
          {table
            .getAllColumns()
            .filter(
              (column) =>
                typeof column.accessorFn !== "undefined" && column.getCanHide()
            )
            .map((column) => {
              const columnDef = column.columnDef;
              let title = column.id;

              if (columnDef.header && typeof columnDef.header === "function") {
                const headerProps = columnDef.header({
                  column,
                  header: column.columnDef.header,
                  table: table,
                }) as any;
                if (headerProps?.props?.title) {
                  title = headerProps.props.title;
                }
              }

              return (
                <DropdownMenuCheckboxItem
                  key={column.id}
                  className="capitalize"
                  checked={column.getIsVisible()}
                  onCheckedChange={(value) => column.toggleVisibility(!!value)}
                >
                  {title}
                </DropdownMenuCheckboxItem>
              );
            })}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
