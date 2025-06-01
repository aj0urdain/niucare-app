/**
 * File: components/atoms/admin-columns.tsx
 * Description: Column definitions for the admin provider data table
 * Author: Aaron J. Girton - https://github.com/aj0urdain
 * Created: 2025
 *
 * This module provides column definitions and cell renderers for the admin provider
 * data table. It includes dropdown menus for actions, formatted text display,
 * and consistent styling across all columns.
 */

"use client";

import { ColumnDef } from "@tanstack/react-table";
import { MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { DataTableColumnHeader } from "@/components/molecules/data-table-column-header";

/**
 * Provider type definition
 * Represents a single provider record in the admin table
 *
 * @property {string} id - Unique identifier for the provider
 * @property {string} registrationId - Provider's registration identifier
 * @property {string} email - Provider's email address
 * @property {string} firstName - Provider's first name
 * @property {string} lastName - Provider's last name
 * @property {string} practiceName - Name of the medical practice
 * @property {string} province - Province where the practice is located
 * @property {('private'|'public')} type - Type of provider
 * @property {string} [phone] - Optional phone number
 * @property {string} [medicalBoardRegNumber] - Optional medical board registration number
 * @property {number} [termsInPractice] - Optional years in practice
 * @property {string} [regExpiryDate] - Optional registration expiry date
 * @property {string} [businessType] - Optional business type
 * @property {string} [tinNumber] - Optional tax identification number
 * @property {string} [ipaNumber] - Optional IPA number
 * @property {string} [bankName] - Optional bank name
 * @property {string} [accountNumber] - Optional bank account number
 * @property {string} [accountName] - Optional bank account name
 * @property {string} [branchName] - Optional bank branch name
 * @property {boolean} [ipaCertificate] - Optional IPA certificate status
 * @property {boolean} [tinCertificate] - Optional TIN certificate status
 * @property {boolean} [medicalBoardCertificate] - Optional medical board certificate status
 */
export type Provider = {
  id: string;
  registrationId: string;
  email: string;
  firstName: string;
  lastName: string;
  practiceName: string;
  province: string;
  type: "private" | "public";
  phone?: string;
  medicalBoardRegNumber?: string;
  termsInPractice?: number;
  regExpiryDate?: string;
  businessType?: string;
  tinNumber?: string;
  ipaNumber?: string;
  bankName?: string;
  accountNumber?: string;
  accountName?: string;
  branchName?: string;
  ipaCertificate?: boolean;
  tinCertificate?: boolean;
  medicalBoardCertificate?: boolean;
};

/**
 * Column Definitions for Admin Provider Data Table
 *
 * Defines the structure and behavior of each column in the provider data table.
 * Features:
 * - Dropdown menu for actions
 * - Formatted text display
 * - Consistent styling
 * - Sortable columns
 * - Responsive design
 *
 * Column Structure:
 * 1. Registration ID - Provider's registration identifier
 * 2. Email - Provider's email address
 * 3. First Name - Provider's first name
 * 4. Last Name - Provider's last name
 * 5. Practice Name - Name of the medical practice
 * 6. Province - Location information
 * 7. Type - Provider type (private/public)
 * 8. Actions - Dropdown menu for provider operations
 *
 * Action Menu Options:
 * - Copy provider ID
 * - View details
 * - View documents
 * - Edit provider
 *
 * @type {ColumnDef<Provider>[]}
 */
export const columns: ColumnDef<Provider>[] = [
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
  {
    id: "actions",
    cell: ({ row }) => {
      const provider = row.original;

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem
              onClick={() => navigator.clipboard.writeText(provider.id)}
            >
              Copy provider ID
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>View details</DropdownMenuItem>
            <DropdownMenuItem>View documents</DropdownMenuItem>
            <DropdownMenuItem>Edit provider</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
