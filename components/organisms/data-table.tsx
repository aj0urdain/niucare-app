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
import { Registration } from "@/components/atoms/admin-registration-columns";
import { DataTableFilters } from "@/components/molecules/data-table-filters";
import { useState, useEffect } from "react";
import { ViewRegistrationModal } from "./view-registration-modal";

/**
 * Interface for filter values used in the data table
 * @property status - Filter by claim status
 * @property claimId - Filter by claim ID
 * @property employeeNumber - Filter by employee number
 * @property claimType - Filter by claim type
 */
interface FilterValues {
  status: string;
  claimId: string;
  employeeNumber: string;
  claimType: string;
}

/**
 * Props for the DataTable component
 * @template TData - Data type (Claim or Registration)
 * @template TValue - Value type for columns
 * @property columns - Column definitions for the table
 * @property data - Array of data to display
 * @property newClaimButton - Show new claim button (optional)
 * @property loading - Loading state (optional)
 * @property filters - Current filter values
 * @property onFilterChange - Callback for filter changes
 * @property hideFilters - Hide filter controls (optional)
 * @property hidePagination - Hide pagination controls (optional)
 * @property rowLimit - Limit number of rows displayed (optional)
 * @property initialClaimId - Initial claim ID to open in modal (optional)
 * @property type - Table type ("claim" or "registration")
 * @property visibleFilters - Array of visible filter keys (optional)
 */
interface DataTableProps<TData extends Claim | Registration, TValue> {
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
  type: "claim" | "registration";
  visibleFilters?: string[];
}

/**
 * DataTable Component
 *
 * Generic table component for displaying claims or registrations with support for filtering, sorting, pagination, and modals.
 * Handles row selection, modal opening, and filter state management.
 *
 * @template TData - Data type (Claim or Registration)
 * @template TValue - Value type for columns
 * @param {DataTableProps<TData, TValue>} props - Component props
 * @returns {JSX.Element} The rendered data table
 *
 * @example
 * ```tsx
 * <DataTable columns={columns} data={claims} filters={filters} onFilterChange={setFilters} type="claim" />
 * ```
 */
export function DataTable<TData extends Claim | Registration, TValue>({
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
  type,
  visibleFilters = [
    "status",
    "claimId",
    "employeeNumber",
    "claimType",
    "province",
    "type",
  ],
}: DataTableProps<TData, TValue>) {
  const router = useRouter();
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = useState({});
  const [selectedClaim, setSelectedClaim] = useState<Claim | null>(null);
  const [selectedRegistration, setSelectedRegistration] =
    useState<Registration | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [hasOpenedFromUrl, setHasOpenedFromUrl] = useState(false);

  // Handle initial claim selection from URL
  useEffect(() => {
    if (initialClaimId && data.length > 0 && !loading && type === "claim") {
      const claim = data.find(
        (item) => (item as Claim).claimId === initialClaimId
      ) as Claim;
      if (claim) {
        setSelectedClaim(claim);
        setIsModalOpen(true);
        setHasOpenedFromUrl(true);
      }
    }
  }, [initialClaimId, data, loading, type]);

  // Handle modal state changes
  const handleModalOpenChange = (open: boolean) => {
    setIsModalOpen(open);
    if (!open) {
      setSelectedClaim(null);
      setSelectedRegistration(null);
      // Only clear the URL if we've opened from URL and are now closing
      if (hasOpenedFromUrl) {
        router.replace(type === "claim" ? "/claims" : "/registrations", {
          scroll: false,
        });
        setHasOpenedFromUrl(false);
      }
    }
  };

  const handleRowClick = (row: { original: TData }) => {
    if (type === "claim") {
      setSelectedClaim(row.original as Claim);
    } else {
      setSelectedRegistration(row.original as Registration);
    }
    setIsModalOpen(true);
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
            visibleFilters={visibleFilters}
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
                    <span>
                      Loading {type === "claim" ? "claims" : "registrations"}...
                    </span>
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
                    e.preventDefault();
                    handleRowClick(row);
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
        {type === "claim" ? (
          <ViewClaimModal
            claim={selectedClaim}
            open={isModalOpen}
            onOpenChange={handleModalOpenChange}
          />
        ) : (
          <ViewRegistrationModal
            registration={selectedRegistration}
            open={isModalOpen}
            onOpenChange={handleModalOpenChange}
          />
        )}
      </div>

      {!hidePagination && <DataTablePagination table={table} />}
    </div>
  );
}
