/**
 * File: components/atoms/admin-registration-columns.tsx
 * Description: Column definitions for the admin registration data table
 * Author: Aaron J. Girton - https://github.com/aj0urdain
 * Created: 2025
 *
 * This module provides column definitions and cell renderers for the admin registration
 * data table. It includes status indicators, formatted text display, and consistent
 * styling across all columns.
 */

"use client";

import { ColumnDef } from "@tanstack/react-table";
import {
  CircleDashed,
  Filter,
  CircleCheckBig,
  XCircle,
  ThumbsUp,
} from "lucide-react";
import { DataTableColumnHeader } from "@/components/molecules/data-table-column-header";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from "@/components/ui/tooltip";

/**
 * Registration type definition
 * Represents a single registration record in the admin table
 *
 * @property {string} id - Unique identifier for the registration
 * @property {string} userId - User's unique identifier
 * @property {string} registrationId - External registration identifier
 * @property {string} email - User's email address
 * @property {string} firstName - User's first name
 * @property {string} lastName - User's last name
 * @property {string} practiceName - Name of the medical practice
 * @property {string} province - Province where the practice is located
 * @property {string} type - Type of registration
 * @property {('pending'|'approved'|'rejected'|'acknowledged')} status - Current status of the registration
 */
export type Registration = {
  id: string;
  userId: string;
  registrationId: string;
  email: string;
  firstName: string;
  lastName: string;
  practiceName: string;
  province: string;
  type: string;
  status: "pending" | "approved" | "rejected" | "acknowledged";
};

/**
 * Column Definitions for Admin Registration Data Table
 *
 * Defines the structure and behavior of each column in the registration data table.
 * Features:
 * - Status indicators with tooltips
 * - Formatted text display
 * - Consistent styling
 * - Sortable columns
 * - Responsive design
 *
 * Column Structure:
 * 1. Status - Visual indicator with tooltips
 * 2. Type - Registration type
 * 3. Registration ID - Unique identifier
 * 4. First Name - User's first name
 * 5. Last Name - User's last name
 * 6. Practice Name - Medical practice name
 * 7. Province - Location information
 *
 * Status Configurations:
 * - Approved: Green with checkmark
 * - Pending: Yellow with dashed circle
 * - Rejected: Red with X
 * - Acknowledged: Blue with thumbs up
 *
 * @type {ColumnDef<Registration>[]}
 */
export const columns: ColumnDef<Registration>[] = [
  {
    accessorKey: "status",
    header: ({ column }) => {
      return (
        <DataTableColumnHeader
          column={column}
          title="Status"
          icon={<Filter className="h-4 w-4 text-muted-foreground/70" />}
          className="ml-4"
        />
      );
    },
    cell: ({ row }) => {
      const status = (row.getValue("status") as string).toLowerCase() as
        | "pending"
        | "approved"
        | "rejected"
        | "acknowledged";

      const statusConfig = {
        approved: {
          icon: CircleCheckBig,
          className:
            "bg-green-900/25 text-green-800 dark:text-green-400 font-semibold border border-green-700/50",
          message: "",
        },
        pending: {
          icon: CircleDashed,
          className:
            "bg-yellow-900/25 text-yellow-800 border font-semibold dark:text-yellow-400 border-yellow-700/50",
          message: "",
        },
        rejected: {
          icon: XCircle,
          className:
            "bg-red-900/25 text-red-800 border font-semibold dark:text-red-400 border-red-700/50",
          message: "Claim is invalid!",
        },
        acknowledged: {
          icon: ThumbsUp,
          className:
            "bg-blue-900/25 text-blue-800 dark:text-blue-400 font-semibold border border-blue-700/50",
          message: "",
        },
      };

      const Icon = statusConfig[status].icon;
      const message = statusConfig[status].message;

      const button = (
        <Button
          variant="ghost"
          className={cn(
            "flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs h-auto ml-4",
            statusConfig[status].className
          )}
        >
          <Icon className="h-3 w-3" />
          <span className="text-xs font-semibold">
            {status.charAt(0).toUpperCase() + status.slice(1)}
          </span>
        </Button>
      );

      return (
        <div className="flex items-center">
          {message ? (
            <Tooltip>
              <TooltipTrigger asChild>{button}</TooltipTrigger>
              <TooltipContent side="right">{message}</TooltipContent>
            </Tooltip>
          ) : (
            button
          )}
        </div>
      );
    },
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
  {
    accessorKey: "registrationId",
    header: ({ column }) => (
      <DataTableColumnHeader
        column={column}
        title="Registration ID"
        className=""
      />
    ),
    cell: ({ row }) => {
      const registrationId = row.getValue("registrationId") as string;
      return <div className="font-semibold">{registrationId}</div>;
    },
  },
  // {
  //   accessorKey: "email",
  //   header: ({ column }) => (
  //     <DataTableColumnHeader column={column} title="Email" />
  //   ),
  // },

  {
    accessorKey: "firstName",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="First Name" />
    ),
    cell: ({ row }) => {
      const firstName = row.getValue("firstName") as string;
      return <div className="capitalize text-xs">{firstName}</div>;
    },
  },
  {
    accessorKey: "lastName",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Last Name" />
    ),
    cell: ({ row }) => {
      const lastName = row.getValue("lastName") as string;
      return <div className="capitalize text-xs">{lastName}</div>;
    },
  },
  {
    accessorKey: "practiceName",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Practice Name" />
    ),
    cell: ({ row }) => {
      const practiceName = row.getValue("practiceName") as string;
      return (
        <div className="capitalize text-xs text-muted-foreground">
          {practiceName}
        </div>
      );
    },
  },
  {
    accessorKey: "province",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Province" />
    ),
  },
];
