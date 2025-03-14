"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Filter } from "lucide-react";
import { DataTableColumnHeader } from "@/components/molecules/data-table-column-header";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export type Registration = {
  id: string;
  registrationId: string;
  email: string;
  firstName: string;
  lastName: string;
  practiceName: string;
  province: string;
  type: string;
  status: "pending" | "approved" | "rejected";
};

export const columns: ColumnDef<Registration>[] = [
  {
    accessorKey: "status",
    header: ({ column }) => (
      <DataTableColumnHeader
        column={column}
        title="Status"
        icon={<Filter className="h-4 w-4 text-muted-foreground/70" />}
      />
    ),
    cell: ({ row }) => {
      const status = row.getValue("status") as string;
      return (
        <Button
          variant="ghost"
          className={cn(
            "flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs h-auto",
            status === "approved" &&
              "bg-green-900/25 text-green-800 dark:text-green-400 border border-green-700/50",
            status === "pending" &&
              "bg-yellow-900/25 text-yellow-800 dark:text-yellow-400 border border-yellow-700/50",
            status === "rejected" &&
              "bg-red-900/25 text-red-800 dark:text-red-400 border border-red-700/50"
          )}
        >
          {status.charAt(0).toUpperCase() + status.slice(1)}
        </Button>
      );
    },
  },
  {
    accessorKey: "registrationId",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Registration ID" />
    ),
  },
  {
    accessorKey: "email",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Email" />
    ),
  },

  {
    accessorKey: "firstName",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="First Name" />
    ),
  },
  {
    accessorKey: "lastName",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Last Name" />
    ),
  },
  {
    accessorKey: "practiceName",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Practice Name" />
    ),
  },
  {
    accessorKey: "province",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Province" />
    ),
  },
  {
    accessorKey: "type",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Type" />
    ),
    cell: ({ row }) => {
      const type = row.getValue("type") as string;
      return <div className="capitalize">{type}</div>;
    },
  },
];
