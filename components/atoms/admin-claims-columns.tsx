/**
 * File: components/atoms/admin-claims-columns.tsx
 * Description: Column definitions for the admin claims data table
 * Author: Aaron J. Girton - https://github.com/aj0urdain
 * Created: 2025
 *
 * This module provides column definitions and cell renderers for the admin claims
 * data table. It includes status indicators, formatted text display, and consistent
 * styling across all columns.
 */

import { ColumnDef } from "@tanstack/react-table";
import { Filter } from "lucide-react";
import { DataTableColumnHeader } from "@/components/molecules/data-table-column-header";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { FileDown } from "lucide-react";

/**
 * AdminClaim type definition
 * Represents a single claim record in the admin table
 *
 * @property {string} id - Unique identifier for the claim
 * @property {string} providerRegNumber - Provider's registration number
 * @property {string} claimId - External claim identifier
 * @property {string} employeeNumber - Employee's identification number
 * @property {string} claimType - Type of claim being made
 * @property {number} amount - Monetary value of the claim
 * @property {string} description - Detailed description of the claim
 * @property {('pending'|'approved'|'rejected')} status - Current status of the claim
 * @property {string} documents - Associated documents
 * @property {string} [reason] - Optional reason for claim status
 */
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

/**
 * Column Definitions for Admin Claims Data Table
 *
 * Defines the structure and behavior of each column in the claims data table.
 * Features:
 * - Status indicators with tooltips
 * - Formatted currency display
 * - Consistent styling
 * - Sortable columns
 * - Responsive design
 *
 * Column Structure:
 * 1. Provider - Provider registration number
 * 2. Claim ID - Unique identifier
 * 3. Employee Number - Employee identification
 * 4. Claim Type - Type of claim
 * 5. Amount - Formatted currency value
 * 6. Description - Claim details
 * 7. Status - Visual status indicator
 * 8. Files - Document indicator
 * 9. Actions - Claim management buttons
 *
 * Status Configurations:
 * - Approved: Green with checkmark
 * - Pending: Yellow with dashed circle
 * - Rejected: Red with X
 *
 * @type {ColumnDef<AdminClaim>[]}
 */
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
      <DataTableColumnHeader column={column} title="Files" />
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
