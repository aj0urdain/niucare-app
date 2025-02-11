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
