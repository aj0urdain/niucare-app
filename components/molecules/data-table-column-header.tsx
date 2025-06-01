/**
 * File: components/molecules/data-table-column-header.tsx
 * Description: Column header component for data tables with sorting and visibility controls
 * Author: Aaron J. Girton - https://github.com/aj0urdain
 * Created: 2025
 *
 * This component provides a column header for data tables with the following features:
 * - Sortable columns with ascending/descending indicators
 * - Column visibility toggle
 * - Custom icons support
 * - Responsive design
 */

import { Column } from "@tanstack/react-table";
import { ArrowDown, ArrowUp, ChevronsUpDown, EyeOff } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

/**
 * Props for the DataTableColumnHeader component
 * @template TData - The type of data in the table
 * @template TValue - The type of value in the column
 */
interface DataTableColumnHeaderProps<TData, TValue>
  extends React.HTMLAttributes<HTMLDivElement> {
  column: Column<TData, TValue>;
  title: string;
  icon?: React.ReactNode;
}

/**
 * DataTableColumnHeader Component
 *
 * A column header component for data tables that provides sorting and visibility controls.
 *
 * Features:
 * - Sortable columns with visual indicators
 * - Column visibility toggle
 * - Custom icon support
 * - Responsive design
 * - Keyboard navigation
 * - Screen reader support
 *
 * @param props - Component props
 * @returns {JSX.Element} Column header with sorting and visibility controls
 *
 * @example
 * ```tsx
 * <DataTableColumnHeader
 *   column={column}
 *   title="Name"
 *   icon={<UserIcon />}
 * />
 * ```
 */
export function DataTableColumnHeader<TData, TValue>({
  column,
  title,
  icon,
  className,
}: DataTableColumnHeaderProps<TData, TValue>) {
  if (!column.getCanSort()) {
    return (
      <div className={cn("flex items-center gap-2", className)}>
        {icon}
        {title}
      </div>
    );
  }

  return (
    <div className={cn("flex items-center space-x-2", className)}>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="sm"
            className="-ml-3 h-8 data-[state=open]:bg-accent"
          >
            <span>{title}</span>
            {column.getIsSorted() === "desc" ? (
              <ArrowDown className="h-2 w-2 text-muted-foreground/70" />
            ) : column.getIsSorted() === "asc" ? (
              <ArrowUp className="h-2 w-2 text-muted-foreground/70" />
            ) : (
              <ChevronsUpDown className="h-2 w-2 text-muted-foreground" />
            )}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start">
          <DropdownMenuItem onClick={() => column.toggleSorting(false)}>
            <ArrowUp className="h-2 w-2 text-muted-foreground/70" />
            Asc
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => column.toggleSorting(true)}>
            <ArrowDown className="h-2 w-2 text-muted-foreground/70" />
            Desc
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => column.toggleVisibility(false)}>
            <EyeOff className="h-2 w-2 text-muted-foreground/70" />
            Hide
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
