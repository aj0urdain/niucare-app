"use client";

import { ColumnDef } from "@tanstack/react-table";
import {
  MoreHorizontal,
  XCircle,
  Filter,
  CircleCheckBig,
  CircleDashed,
  Trash,
  FileBadge,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { DataTableColumnHeader } from "@/components/molecules/data-table-column-header";
import { cn } from "@/lib/utils";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export type Claim = {
  id: string;
  status: "pending" | "approved" | "rejected" | "all";
  claimId: string;
  employeeNumber: string;
  employeeName: string;
  employeeGender: string;
  employeeDob: string;
  claimType: string;
  amount: number;
  description: string;
  viewFiles: string;
};

export const columns: ColumnDef<Claim>[] = [
  // {
  //   id: "select",
  //   header: ({ table }) => (
  //     <div className="px-4 pt-1">
  //       <Checkbox
  //         checked={
  //           table.getIsAllPageRowsSelected() ||
  //           (table.getIsSomePageRowsSelected() && "indeterminate")
  //         }
  //         onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
  //         aria-label="Select all"
  //       />
  //     </div>
  //   ),
  //   cell: ({ row }) => (
  //     <div className="px-4 pt-1">
  //       <Checkbox
  //         checked={row.getIsSelected()}
  //         onCheckedChange={(value) => row.toggleSelected(!!value)}
  //         aria-label="Select row"
  //       />
  //     </div>
  //   ),
  // },
  {
    accessorKey: "status",
    header: ({ column }) => {
      return (
        <DataTableColumnHeader
          column={column}
          title="Status"
          icon={<Filter className="h-4 w-4 text-muted-foreground/70" />}
        />
      );
    },
    cell: ({ row }) => {
      const status = row.getValue("status") as
        | "pending"
        | "approved"
        | "rejected";

      const statusConfig = {
        approved: {
          icon: CircleCheckBig,
          className:
            "bg-green-900/25 text-green-800 dark:text-green-400 font-semibold border border-green-700/50",
        },
        pending: {
          icon: CircleDashed,
          className:
            "bg-yellow-900/25 text-yellow-800 border font-semibold dark:text-yellow-400 border-yellow-700/50",
        },
        rejected: {
          icon: XCircle,
          className:
            "bg-red-900/25 text-red-800 border font-semibold dark:text-red-400 border-red-700/50",
          message: "Claim is invalid!",
        },
      };

      const Icon = statusConfig[status].icon;
      const message = statusConfig[status].message;

      const button = (
        <Button
          variant="ghost"
          className={cn(
            "flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs h-auto",
            statusConfig[status].className
          )}
        >
          <Icon className="h-3 w-3" />
          {status.charAt(0).toUpperCase() + status.slice(1)}
        </Button>
      );

      return (
        <div className="flex items-center">
          {message ? (
            <Tooltip>
              <TooltipTrigger asChild>{button}</TooltipTrigger>
              <TooltipContent
                side="right"
                className="text-xs bg-destructive text-destructive-foreground"
              >
                {message}
              </TooltipContent>
            </Tooltip>
          ) : (
            button
          )}
        </div>
      );
    },
  },
  {
    accessorKey: "claimId",
    header: ({ column }) => {
      return <DataTableColumnHeader column={column} title="Claim ID" />;
    },
    cell: ({ row }) => {
      return (
        <div className="font-bold text-foreground">
          {row.getValue("claimId")}
        </div>
      );
    },
  },
  {
    accessorKey: "employeeNumber",
    header: ({ column }) => {
      return <DataTableColumnHeader column={column} title="Employee Number" />;
    },
    cell: ({ row }) => {
      return (
        <div className="font-medium text-foreground">
          {row.getValue("employeeNumber")}
        </div>
      );
    },
  },
  {
    accessorKey: "amount",
    header: ({ column }) => {
      return <DataTableColumnHeader column={column} title="Amount (PGK)" />;
    },
    cell: ({ row }) => {
      const amount = parseFloat(row.getValue("amount"));
      const formatted = new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "PGK",
      }).format(amount);
      return <div className="font-medium">{formatted}</div>;
    },
  },
  {
    accessorKey: "claimType",
    header: ({ column }) => {
      return <DataTableColumnHeader column={column} title="Claim Type" />;
    },
  },
  {
    accessorKey: "description",
    header: ({ column }) => {
      return <DataTableColumnHeader column={column} title="Description" />;
    },
    cell: ({ row }) => {
      return (
        <div className="font-medium text-muted-foreground text-xs truncate">
          {row.getValue("description")}
        </div>
      );
    },
  },

  {
    accessorKey: "viewFiles",
    header: ({ column }) => {
      return <DataTableColumnHeader column={column} title="View Files" />;
    },
    cell: ({ row }) => {
      // const documents = row.getValue("documents")

      return (
        <Button variant="ghost">
          <FileBadge className="w-3 h-3" />
        </Button>
      );
    },
  },

  {
    id: "actions",
    cell: ({ row }) => {
      const claim = row.original;

      return (
        <DropdownMenu>
          <Tooltip>
            <TooltipTrigger asChild>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="h-8 w-8 p-0">
                  <span className="sr-only">Open menu</span>
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
            </TooltipTrigger>
            <TooltipContent side="left">Actions</TooltipContent>
          </Tooltip>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem
              onClick={() => navigator.clipboard.writeText(claim.id)}
            >
              Copy claim ID
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>View employee details</DropdownMenuItem>
            <DropdownMenuItem>View claim details</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-red-600 dark:text-red-400 font-semibold bg-destructive/10 hover:bg-destructive/20">
              <Trash className="h-4 w-4" />
              Delete claim
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
