/**
 * File: components/atoms/columns-data.tsx
 * Description: Data table column definitions and cell components for claims management
 * Author: Aaron J. Girton - https://github.com/aj0urdain
 * Created: 2025
 *
 * This module provides column definitions and specialized cell components for the claims
 * data table. It includes functionality for viewing, managing, and interacting with
 * individual claims through a dropdown menu interface.
 */

"use client";

import { ColumnDef } from "@tanstack/react-table";
import {
  MoreHorizontal,
  XCircle,
  Filter,
  CircleCheckBig,
  CircleDashed,
  Trash,
  Copy,
  FileOutput,
  FileSpreadsheet,
  Paperclip,
} from "lucide-react";

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
import { cn } from "@/lib/utils";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useState } from "react";
import { useMutation } from "@apollo/client";
import { DELETE_CLAIM, GET_POLICYHOLDERCLAIMS } from "@/lib/graphql/queries";
import { useUserProfileStore } from "@/stores/user-profile-store";

/**
 * Claim type definition representing a single claim record
 * @property {string} id - Unique identifier for the claim
 * @property {('pending'|'approved'|'rejected'|'all')} status - Current status of the claim
 * @property {string} claimId - External claim identifier
 * @property {string} employeeNumber - Employee's identification number
 * @property {string} employeeName - Full name of the employee
 * @property {string} employeeGender - Employee's gender
 * @property {string} employeeDob - Employee's date of birth
 * @property {string} claimType - Type of claim being made
 * @property {number} amount - Monetary value of the claim
 * @property {string} description - Detailed description of the claim
 * @property {string} viewFiles - URL or reference to claim files
 * @property {string} userBucket - Storage bucket identifier for user files
 */
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
  userBucket: string;
};

/**
 * ActionsCell Component
 *
 * Provides a dropdown menu of actions for individual claims including:
 * - Copy claim/employee IDs
 * - View claim details
 * - View claim files
 * - Delete claim (for pending claims only)
 *
 * Features:
 * - Contextual actions based on claim status
 * - Confirmation dialog for destructive actions
 * - Toast notifications for user feedback
 * - Clipboard integration
 * - Navigation handling
 *
 * @param props - Component props
 * @param props.claim - The claim record to display actions for
 * @returns {JSX.Element} Dropdown menu with claim actions
 */
const ActionsCell = ({ claim }: { claim: Claim }) => {
  const router = useRouter();
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const { user } = useUserProfileStore();

  const [deleteClaim] = useMutation(DELETE_CLAIM, {
    refetchQueries: [
      {
        query: GET_POLICYHOLDERCLAIMS,
        variables: {
          userId: user?.userId,
          providerRegNumber: "",
          claimId: "",
          employeeNo: "",
          claimCode: "",
          status: "",
        },
      },
    ],
  });

  const handleViewDetails = (e: React.MouseEvent) => {
    e.stopPropagation();
    const params = new URLSearchParams();
    params.set("id", claim.id);
    params.set("sheetTab", "details");
    router.push(`?${params.toString()}`);
  };

  const handleViewFiles = (e: React.MouseEvent) => {
    e.stopPropagation();
    const params = new URLSearchParams();
    params.set("id", claim.id);
    params.set("sheetTab", "files");
    router.push(`?${params.toString()}`);
  };

  const handleDelete = async (e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      await deleteClaim({
        variables: {
          id: parseInt(claim.id),
        },
      });
      toast.success("Claim deleted successfully");
      setIsDeleteDialogOpen(false);
    } catch (error) {
      toast.error("Failed to delete claim");
      console.error("Error deleting claim:", error);
    }
  };

  return (
    <>
      <DropdownMenu>
        <Tooltip>
          <TooltipTrigger asChild>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className="h-8 w-8 p-0 hover:bg-muted-foreground/10 group/actions"
                onClick={(e) => e.stopPropagation()}
              >
                <span className="sr-only">Open menu</span>
                <MoreHorizontal className="h-4 w-4 group-hover/actions:rotate-90 transition-transform duration-200" />
              </Button>
            </DropdownMenuTrigger>
          </TooltipTrigger>
          <TooltipContent side="left">Actions</TooltipContent>
        </Tooltip>
        <DropdownMenuContent align="end" onClick={(e) => e.stopPropagation()}>
          <DropdownMenuLabel className="text-[0.6rem] text-muted-foreground font-normal select-none">
            Copy
          </DropdownMenuLabel>
          <DropdownMenuItem
            onClick={(e) => {
              e.stopPropagation();
              navigator.clipboard.writeText(claim.id);
              toast(
                <div className="flex flex-col items-start justify-start gap-1">
                  <div className="flex items-center gap-1">
                    <Copy className="h-2.5 w-2.5" />
                    <p className="text-xs text-muted-foreground">Copy</p>
                  </div>
                  <p>
                    Claim ID <span className="font-medium">{claim.id}</span> has
                    been copied to clipboard!
                  </p>
                </div>
              );
            }}
            className="cursor-pointer text-xs"
          >
            <Copy className="w-1 h-1 -mr-1" />
            Copy Claim ID
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={(e) => {
              e.stopPropagation();
              navigator.clipboard.writeText(claim.employeeNumber);
              toast(
                <div className="flex flex-col items-start justify-start gap-1">
                  <div className="flex items-center gap-1">
                    <Copy className="h-2.5 w-2.5" />
                    <p className="text-xs text-muted-foreground">Copy</p>
                  </div>
                  <p>
                    Employee ID{" "}
                    <span className="font-medium">{claim.employeeNumber}</span>{" "}
                    has been copied to clipboard!
                  </p>
                </div>
              );
            }}
            className="cursor-pointer text-xs"
          >
            <Copy className="w-1 h-1 -mr-1" />
            Copy Employee ID
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuLabel className="text-[0.6rem] text-muted-foreground font-normal select-none">
            View
          </DropdownMenuLabel>
          <DropdownMenuItem
            onClick={handleViewDetails}
            className="cursor-pointer text-xs"
          >
            <FileSpreadsheet className="w-1 h-1 -mr-1" />
            View Claim Details
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={handleViewFiles}
            className="cursor-pointer text-xs"
          >
            <FileOutput className="w-1 h-1 -mr-1" />
            View Claim Files
          </DropdownMenuItem>
          {claim.status === "pending" && (
            <>
              <DropdownMenuSeparator />
              <DropdownMenuLabel className="text-[0.6rem] text-muted-foreground font-normal select-none">
                Actions
              </DropdownMenuLabel>
              <DropdownMenuItem
                className="cursor-pointer text-xs text-destructive hover:text-destructive bg-transparent hover:bg-destructive/50 group/delete"
                onClick={(e) => {
                  e.stopPropagation();
                  setIsDeleteDialogOpen(true);
                }}
              >
                <div className="flex items-center gap-1 text-destructive">
                  <Trash className="w-4 h-4" />
                  <span>Delete Claim</span>
                </div>
              </DropdownMenuItem>
            </>
          )}
        </DropdownMenuContent>
      </DropdownMenu>

      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent onClick={(e) => e.stopPropagation()}>
          <DialogHeader>
            <DialogTitle>Delete Claim {claim.id}</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this claim? This action cannot be
              undone.
            </DialogDescription>
          </DialogHeader>

          <DialogFooter>
            <Button
              variant="ghost"
              onClick={(e) => {
                e.stopPropagation();
                setIsDeleteDialogOpen(false);
              }}
            >
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDelete}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

/**
 * FilesCell Component
 *
 * Displays a paperclip icon for claims that have associated files.
 * Features:
 * - Conditional rendering based on file presence
 * - Visual indicator for file attachments
 * - Consistent styling with design system
 *
 * @param props - Component props
 * @param props.claim - The claim record to check for files
 * @returns {JSX.Element | null} Paperclip icon if files exist, null otherwise
 */
const FilesCell = ({ claim }: { claim: Claim }) => {
  if (!claim.viewFiles || claim.viewFiles.trim() === "") {
    return null;
  }

  return (
    <div className="flex items-center justify-center">
      <Paperclip className="h-4 w-4 text-muted-foreground" />
    </div>
  );
};

/**
 * Column Definitions for Claims Data Table
 *
 * Defines the structure and behavior of each column in the claims data table.
 * Features:
 * - Sortable columns
 * - Custom cell renderers
 * - Status indicators with tooltips
 * - Formatted currency display
 * - Action menu integration
 *
 * Column Structure:
 * 1. Status - Visual indicator of claim status with tooltips
 * 2. Claim ID - Unique identifier for the claim
 * 3. Employee Number - Employee's identification number
 * 4. Amount - Formatted currency value in PGK
 * 5. Files - Visual indicator for attached files
 * 6. Actions - Dropdown menu for claim operations
 *
 * @type {ColumnDef<Claim>[]}
 */
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
          className="ml-4"
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
      return <DataTableColumnHeader column={column} title="Files" />;
    },
    cell: ({ row }) => {
      return <FilesCell claim={row.original} />;
    },
  },

  {
    id: "actions",
    cell: ({ row }) => {
      return <ActionsCell claim={row.original} />;
    },
  },
];
