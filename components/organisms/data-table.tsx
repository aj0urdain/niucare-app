"use client";

import * as React from "react";

import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import {
  CircleCheckBig,
  CircleDashed,
  CirclePlus,
  CircleX,
  Filter,
} from "lucide-react";

import { DataTablePagination } from "@/components/molecules/data-table-pagination";
import { DataTableViewOptions } from "@/components/molecules/data-table-column-toggle";

import { InputWithLabel } from "@/components/atoms/input-with-label";
import { ComboBoxResponsive } from "@/components/molecules/combobox-responsive";
import { NewClaimModal } from "./new-claim-modal";

import { ViewClaimModal } from "./view-claim-modal";
import { Claim } from "@/components/atoms/columns-data";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
}

export function DataTable<TData, TValue>({
  columns,
  data,
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});
  const [selectedClaim, setSelectedClaim] = React.useState<Claim | null>(null);
  const [isModalOpen, setIsModalOpen] = React.useState(false);

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  });

  return (
    <div>
      <div className="flex items-end justify-between py-4 gap-4">
        <div className="flex items-end justify-end h-full">
          <NewClaimModal />
        </div>
        <div className="flex items-end justify-end gap-4">
          <ComboBoxResponsive
            id="status"
            label="Status"
            icon={<Filter className="h-3 w-3" />}
            options={[
              {
                value: "all",
                label: "All Status",
                icon: (
                  <CirclePlus className="h-3 w-3 text-muted-foreground/75" />
                ),
              },
              {
                value: "pending",
                label: "Pending",
                icon: <CircleDashed className="h-3 w-3 text-yellow-500" />,
              },
              {
                value: "approved",
                label: "Approved",
                icon: <CircleCheckBig className="h-3 w-3 text-green-500" />,
              },
              {
                value: "rejected",
                label: "Rejected",
                icon: <CircleX className="h-3 w-3 text-red-500" />,
              },
            ]}
            value={
              (table.getColumn("status")?.getFilterValue() as string) ?? "all"
            }
            onValueChange={(value) =>
              table
                .getColumn("status")
                ?.setFilterValue(value === "all" ? "" : value)
            }
            placeholder="Filter by Status"
            className="p-0"
            triggerClassName="max-w-xs"
          />
          <InputWithLabel
            id="claimId"
            label="Claim ID"
            placeholder="Claim ID..."
            value={
              (table.getColumn("claimId")?.getFilterValue() as string) ?? ""
            }
            onChange={(event) =>
              table.getColumn("claimId")?.setFilterValue(event.target.value)
            }
            className="max-w-40"
            icon={<Filter className="h-3 w-3" />}
          />
          <InputWithLabel
            id="employeeNumber"
            label="Employee Number"
            placeholder="Employee Number..."
            value={
              (table.getColumn("employeeNumber")?.getFilterValue() as string) ??
              ""
            }
            onChange={(event) =>
              table
                .getColumn("employeeNumber")
                ?.setFilterValue(event.target.value)
            }
            className="max-w-40"
            icon={<Filter className="h-3 w-3" />}
          />
          <ComboBoxResponsive
            id="claimType"
            label="Claim Type"
            icon={<Filter className="h-3 w-3" />}
            options={[
              { value: "all", label: "All" },
              { value: "In-Patient Treatment", label: "In-Patient Treatment" },
              { value: "Pre-Hospitalization", label: "Pre-Hospitalization" },
              { value: "Post-Hospitalization", label: "Post-Hospitalization" },
              { value: "Dental Services", label: "Dental Services" },
              { value: "Optical", label: "Optical" },
              {
                value: "General Practitioner Consultation",
                label: "General Practitioner Consultation",
              },
              {
                value: "Specialist Consultation on Referral",
                label: "Specialist Consultation on Referral",
              },
              { value: "Pregnancy Pre-natal", label: "Pregnancy Pre-natal" },
              { value: "Pregnancy Childbirth", label: "Pregnancy Childbirth" },
              { value: "Pregnancy Post Natal", label: "Pregnancy Post Natal" },
            ]}
            value={
              (table.getColumn("claimType")?.getFilterValue() as string) ??
              "all"
            }
            onValueChange={(value) =>
              table
                .getColumn("claimType")
                ?.setFilterValue(value === "all" ? "" : value)
            }
            placeholder="Filter by Claim Type"
            className="w-[200px] p-0"
            triggerClassName="max-w-xs"
          />

          <DataTableViewOptions table={table} />
        </div>
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                  className="cursor-pointer dark:hover:bg-muted/50 hover:bg-muted"
                  onClick={(e) => {
                    // Check if the click target is within a button or the ViewFiles modal
                    const isViewFilesClick = (e.target as HTMLElement).closest(
                      '[data-view-files="true"]'
                    );
                    if (!isViewFilesClick) {
                      setSelectedClaim(row.original as Claim);
                      setIsModalOpen(true);
                    }
                  }}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
        <ViewClaimModal
          claim={selectedClaim}
          open={isModalOpen}
          onOpenChange={setIsModalOpen}
        />
      </div>

      <DataTablePagination table={table} />
    </div>
  );
}
