/**
 * File: components/molecules/data-table-column-toggle.tsx
 * Description: Column visibility toggle component for data tables
 * Author: Aaron J. Girton - https://github.com/aj0urdain
 * Created: 2025
 *
 * This component provides a dropdown menu for toggling column visibility in data tables.
 * It allows users to show/hide columns and customize their view of the data.
 */

"use client";

import { Table } from "@tanstack/react-table";
import { Settings2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

/**
 * Props for the DataTableViewOptions component
 * @template TData - The type of data in the table
 */
interface DataTableViewOptionsProps<TData> {
  table: Table<TData>;
}

/**
 * DataTableViewOptions Component
 *
 * A component that provides a dropdown menu for toggling column visibility in data tables.
 *
 * Features:
 * - Column visibility toggle
 * - Checkbox-based selection
 * - Responsive design
 * - Keyboard navigation
 * - Screen reader support
 * - Dynamic column titles
 *
 * @param props - Component props
 * @returns {JSX.Element} Column visibility toggle dropdown
 *
 * @example
 * ```tsx
 * <DataTableViewOptions
 *   table={table}
 * />
 * ```
 */
export function DataTableViewOptions<TData>({
  table,
}: DataTableViewOptionsProps<TData>) {
  return (
    <div className="grid w-fit min-w-fit items-center gap-1.5">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="outline"
            className="ml-auto flex min-w-fit justify-start"
          >
            <Settings2 className="h-4 w-4" />
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
