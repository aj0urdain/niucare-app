import { ColumnDef } from "@tanstack/react-table";
import { Filter } from "lucide-react";
import { DataTableColumnHeader } from "@/components/molecules/data-table-column-header";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { FileDown } from "lucide-react";

export type AdminClaim = {
  id: string;
  providerRegNumber: string;
  claimId: string;
  employeeNumber: string;
  claimType: string;
  amount: number;
  description: string;
  status: "pending" | "approved" | "rejected";
  documents: string;
  reason?: string;
};

export const columns: ColumnDef<AdminClaim>[] = [
  {
    accessorKey: "providerRegNumber",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Provider" />
    ),
  },
  {
    accessorKey: "claimId",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Claim ID" />
    ),
  },
  {
    accessorKey: "employeeNumber",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Employee Number" />
    ),
  },
  {
    accessorKey: "claimType",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Claim" />
    ),
  },
  {
    accessorKey: "amount",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Amount (PGK)" />
    ),
    cell: ({ row }) => {
      const amount = parseFloat(row.getValue("amount"));
      return new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "PGK",
      }).format(amount);
    },
  },
  {
    accessorKey: "description",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Description" />
    ),
  },
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
    accessorKey: "documents",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="View Files" />
    ),
    cell: ({ row }) => {
      const documents = row.getValue("documents") as string;
      const files = documents;

      return files.length > 0 ? (
        <div className="flex items-center">
          <FileDown className="h-4 w-4 text-muted-foreground" />
        </div>
      ) : null;
    },
  },
  {
    id: "actions",
    header: "Action",
    cell: ({ row }) => {
      const status = row.getValue("status") as string;
      return (
        <div className="flex gap-2">
          <Button
            variant="destructive"
            size="sm"
            disabled={status !== "pending"}
          >
            REJECT
          </Button>
          <Button variant="default" size="sm" disabled={status !== "pending"}>
            APPROVE
          </Button>
        </div>
      );
    },
  },
];
