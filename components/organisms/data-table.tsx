"use client";

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
import { useRouter } from "next/navigation";
import { DataTablePagination } from "@/components/molecules/data-table-pagination";
import { NewClaimModal } from "./new-claim-modal";
import { ViewClaimModal } from "./view-claim-modal";
import { Claim } from "@/components/atoms/columns-data";
import { DataTableFilters } from "@/components/molecules/data-table-filters";
import { useState, useEffect } from "react";

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
  filters: FilterValues;
  onFilterChange: (filters: FilterValues) => void;
  hideFilters?: boolean;
  hidePagination?: boolean;
  rowLimit?: number;
  initialClaimId?: string | null;
}

export function DataTable<TData, TValue>({
  columns,
  data,
  newClaimButton = false,
  loading = false,
  filters,
  onFilterChange,
  hideFilters = false,
  hidePagination = false,
  rowLimit,
  initialClaimId,
}: DataTableProps<TData, TValue>) {
  const router = useRouter();
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = useState({});
  const [selectedClaim, setSelectedClaim] = useState<Claim | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [hasOpenedFromUrl, setHasOpenedFromUrl] = useState(false);

  // Handle initial claim selection from URL
  useEffect(() => {
    if (initialClaimId && data.length > 0 && !loading) {
      const claim = data.find(
        (item) => (item as Claim).claimId === initialClaimId
      ) as Claim;
      if (claim) {
        setSelectedClaim(claim);
        setIsModalOpen(true);
        setHasOpenedFromUrl(true);
      }
    }
  }, [initialClaimId, data, loading]);

  // Handle modal state changes
  const handleModalOpenChange = (open: boolean) => {
    setIsModalOpen(open);
    if (!open) {
      setSelectedClaim(null);
      // Only clear the URL if we've opened from URL and are now closing
      if (hasOpenedFromUrl) {
        router.replace("/claims", { scroll: false });
        setHasOpenedFromUrl(false);
      }
    }
  };

  const table = useReactTable({
    data: rowLimit ? data.slice(0, rowLimit) : data,
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
      <div className="flex items-end justify-between py-4">
        <div className="flex items-end justify-end h-full">
          {newClaimButton && <NewClaimModal />}
        </div>
        {!hideFilters && (
          <DataTableFilters
            table={table}
            currentFilters={filters}
            onFilterChange={onFilterChange}
          />
        )}
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
              table.getRowModel().rows.map((row) => {
                const claim = row.original as Claim;
                return (
                  <TableRow
                    key={row.id}
                    data-state={row.getIsSelected() && "selected"}
                    className="cursor-pointer dark:hover:bg-muted/50 hover:bg-muted animate-slide-down-fade-in"
                    onClick={(e) => {
                      e.preventDefault();
                      setSelectedClaim(claim);
                      setIsModalOpen(true);
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
                );
              })
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
          onOpenChange={handleModalOpenChange}
        />
      </div>

      {!hidePagination && <DataTablePagination table={table} />}
    </div>
  );
}
