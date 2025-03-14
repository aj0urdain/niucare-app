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

import { Loader2 } from "lucide-react";

import { DataTablePagination } from "@/components/molecules/data-table-pagination";

import { NewClaimModal } from "./new-claim/new-claim-modal";

import { ViewClaimModal } from "./view-claim-modal";
import { Claim } from "@/components/atoms/columns-data";
import { DataTableFilters } from "@/components/molecules/data-table-filters";

interface FilterValues {
  status: string;
  claimId: string;
  employeeNumber: string;
  claimType: string;
}

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  newClaimButton?: boolean;
  loading?: boolean;
  error?: Error;
  filters: FilterValues;
  onFilterChange: (filters: FilterValues) => void;
}

export function DataTable<TData, TValue>({
  columns,
  data,
  newClaimButton = false,
  loading = false,
  error = null,
  filters,
  onFilterChange,
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
          {newClaimButton && <NewClaimModal />}
        </div>
        <DataTableFilters
          table={table}
          currentFilters={filters}
          onFilterChange={onFilterChange}
        />
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
            {loading ? (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  <div className="flex items-center justify-center gap-2">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span>Loading claims...</span>
                  </div>
                </TableCell>
              </TableRow>
            ) : table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                  className="cursor-pointer dark:hover:bg-muted/50 hover:bg-muted animate-slide-down-fade-in"
                  onClick={(e) => {
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
                  No results found.
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
