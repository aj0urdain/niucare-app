/**
 * File: components/molecules/data-table-filters.tsx
 * Description: Data table filters component for filtering and managing table data.
 * Author: Aaron J. Girton - https://github.com/aj0urdain
 * Created: 2025
 *
 * This component provides filtering capabilities for data tables, including:
 * - Status filtering
 * - Type filtering
 * - Province filtering
 * - Claim ID filtering
 * - Employee number filtering
 * - Claim type filtering
 * - Column visibility toggle
 */

import { Table } from "@tanstack/react-table";
import {
  CirclePlus,
  CircleCheckBig,
  CircleDashed,
  CircleX,
  Filter,
  ThumbsUp,
  Building2,
  Landmark,
} from "lucide-react";
import { ComboBoxResponsive } from "./combobox-responsive";
import { InputWithLabel } from "@/components/atoms/input-with-label";
import { DataTableViewOptions } from "./data-table-column-toggle";
import { useQuery } from "@apollo/client";
import { GET_CATALOGS } from "@/lib/graphql/queries";
import React, { useEffect } from "react";

/**
 * FilterValues interface
 *
 * Defines the structure for filter values used in the data table.
 */
interface FilterValues {
  status: string;
  claimId: string;
  employeeNumber: string;
  claimType: string;
  type?: string;
  province?: string;
}

/**
 * CatalogOption interface
 *
 * Defines the structure for catalog options used in dropdowns.
 */
export interface CatalogOption {
  id: string;
  group: number;
  label: string;
  __typename: string;
}

/**
 * DataTableFiltersProps interface
 *
 * Props for the DataTableFilters component.
 */
interface DataTableFiltersProps<TData> {
  table: Table<TData>;
  onFilterChange: (filters: FilterValues) => void;
  currentFilters: FilterValues;
  visibleFilters: string[];
}

/**
 * DataTableFilters Component
 *
 * Provides filtering capabilities for data tables with multiple filter types.
 *
 * Features:
 * - Status filtering
 * - Type filtering
 * - Province filtering
 * - Claim ID filtering
 * - Employee number filtering
 * - Claim type filtering
 * - Column visibility toggle
 * - Responsive design
 * - Dynamic filter options
 *
 * @param table - The table instance from TanStack Table
 * @param onFilterChange - Callback when filters change
 * @param currentFilters - Current filter values
 * @param visibleFilters - Array of visible filter types
 * @returns {JSX.Element} Data table filters component
 *
 * @example
 * ```tsx
 * <DataTableFilters
 *   table={table}
 *   onFilterChange={handleFilterChange}
 *   currentFilters={filters}
 *   visibleFilters={["status", "type", "province"]}
 * />
 * ```
 */
export function DataTableFilters<TData>({
  table,
  onFilterChange,
  currentFilters,
  visibleFilters,
}: DataTableFiltersProps<TData>) {
  const { data: catalogsData } = useQuery(GET_CATALOGS);

  useEffect(() => {
    console.log(catalogsData);
  }, [catalogsData]);

  const claimTypeOptions = React.useMemo(() => {
    const options = [{ id: "all", value: "all", label: "All" }];

    if (catalogsData?.catalogs) {
      catalogsData.catalogs.forEach((catalog: CatalogOption) => {
        options.push({
          id: catalog.id,
          value: catalog.id,
          label: catalog.label,
        });
      });
    }

    return options;
  }, [catalogsData]);

  const handleFilterChange = (key: keyof FilterValues, value: string) => {
    const newFilters = {
      ...currentFilters,
      [key]: value,
    };
    onFilterChange(newFilters);
  };

  return (
    <div className="flex items-end justify-end gap-4">
      {visibleFilters.includes("status") && (
        <ComboBoxResponsive
          id="status"
          label="Status"
          icon={<Filter className="h-3 w-3" />}
          options={[
            {
              id: "all",
              value: "all",
              label: "All Status",
              icon: <CirclePlus className="h-3 w-3 text-muted-foreground/75" />,
            },
            {
              id: "pending",
              value: "pending",
              label: "Pending",
              icon: <CircleDashed className="h-3 w-3 text-yellow-500" />,
              className:
                "bg-yellow-900/25 text-yellow-800 dark:text-yellow-400 font-semibold border border-yellow-700/50",
            },
            {
              id: "approved",
              value: "approved",
              label: "Approved",
              icon: <CircleCheckBig className="h-3 w-3 text-green-500" />,
              className:
                "bg-green-900/25 text-green-800 dark:text-green-400 font-semibold border border-green-700/50",
            },
            {
              id: "rejected",
              value: "rejected",
              label: "Rejected",
              icon: <CircleX className="h-3 w-3 text-red-500" />,
              className:
                "bg-red-900/25 text-red-800 dark:text-red-400 font-semibold border border-red-700/50",
            },
            {
              id: "acknowledged",
              value: "acknowledged",
              label: "Acknowledged",
              icon: <ThumbsUp className="h-3 w-3 text-blue-500" />,
              className:
                "bg-blue-900/25 text-blue-800 dark:text-blue-400 font-semibold border border-blue-700/50",
            },
          ]}
          value={currentFilters.status}
          onValueChange={(value) =>
            handleFilterChange("status", value === "all" ? "" : value)
          }
          placeholder="Filter by Status"
          className="p-0 max-w-48"
          triggerClassName="max-w-48"
        />
      )}

      {visibleFilters.includes("type") && (
        <ComboBoxResponsive
          id="type"
          label="Type"
          icon={<Filter className="h-3 w-3" />}
          options={[
            {
              id: "all",
              value: "all",
              label: "All Types",
              icon: <CirclePlus className="h-3 w-3 text-muted-foreground/75" />,
            },
            {
              id: "private",
              value: "private",
              label: "Private",
              icon: <Building2 className="h-3 w-3 text-yellow-500" />,
              className: "",
            },
            {
              id: "public",
              value: "public",
              label: "Public",
              icon: <Landmark className="h-3 w-3 text-green-500" />,
              className: "",
            },
          ]}
          value={currentFilters.type}
          onValueChange={(value) =>
            handleFilterChange("type", value === "all" ? "" : value)
          }
          placeholder="Filter by Type"
        />
      )}

      {visibleFilters.includes("province") && (
        <ComboBoxResponsive
          id="province"
          label="Province"
          icon={<Filter className="h-3 w-3" />}
          options={[
            {
              id: "all",
              value: "all",
              label: "All Provinces",
            },
            {
              id: "Bougainville",
              value: "Bougainville",
              label: "Bougainville",
            },
            {
              id: "Central",
              value: "Central",
              label: "Central",
            },
            {
              id: "Chimbu (Simbu)",
              value: "Chimbu (Simbu)",
              label: "Chimbu (Simbu)",
            },
            {
              id: "Eastern Highlands",
              value: "Eastern Highlands",
              label: "Eastern Highlands",
            },
            {
              id: "East New Britain",
              value: "East New Britain",
              label: "East New Britain",
            },
            {
              id: "East Sepik",
              value: "East Sepik",
              label: "East Sepik",
            },
            {
              id: "Enga",
              value: "Enga",
              label: "Enga",
            },
            {
              id: "Gulf",
              value: "Gulf",
              label: "Gulf",
            },
            {
              id: "Madang",
              value: "Madang",
              label: "Madang",
            },
            {
              id: "Manus",
              value: "Manus",
              label: "Manus",
            },
            {
              id: "Milne Bay",
              value: "Milne Bay",
              label: "Milne Bay",
            },
            {
              id: "Morobe",
              value: "Morobe",
              label: "Morobe",
            },
            {
              id: "New Ireland",
              value: "New Ireland",
              label: "New Ireland",
            },
            {
              id: "Oro (Northern)",
              value: "Oro (Northern)",
              label: "Oro (Northern)",
            },
            {
              id: "Southern Highlands",
              value: "Southern Highlands",
              label: "Southern Highlands",
            },
            {
              id: "Western (Fly)",
              value: "Western (Fly)",
              label: "Western (Fly)",
            },
            {
              id: "Western Highlands",
              value: "Western Highlands",
              label: "Western Highlands",
            },
            {
              id: "West New Britain",
              value: "West New Britain",
              label: "West New Britain",
            },
            {
              id: "Sandaun (West Sepik)",
              value: "Sandaun (West Sepik)",
              label: "Sandaun (West Sepik)",
            },
            {
              id: "National Capital District",
              value: "National Capital District",
              label: "National Capital District",
            },
            {
              id: "Hela",
              value: "Hela",
              label: "Hela",
            },
            {
              id: "Jiwaka",
              value: "Jiwaka",
              label: "Jiwaka",
            },
          ]}
          value={currentFilters.province}
          onValueChange={(value) =>
            handleFilterChange("province", value === "all" ? "" : value)
          }
          placeholder="Filter by Province"
        />
      )}

      {visibleFilters.includes("claimId") && (
        <InputWithLabel
          id="claimId"
          label="Claim ID"
          placeholder="Claim ID..."
          value={currentFilters.claimId}
          onChange={(event) =>
            handleFilterChange("claimId", event.target.value)
          }
          className="max-w-40"
          icon={<Filter className="h-3 w-3" />}
        />
      )}
      {visibleFilters.includes("employeeNumber") && (
        <InputWithLabel
          id="employeeNumber"
          label="Employee Number"
          placeholder="Employee Number..."
          value={currentFilters.employeeNumber}
          onChange={(event) =>
            handleFilterChange("employeeNumber", event.target.value)
          }
          className="max-w-40"
          icon={<Filter className="h-3 w-3" />}
        />
      )}
      {visibleFilters.includes("claimType") && (
        <ComboBoxResponsive
          id="claimType"
          label="Claim Type"
          icon={<Filter className="h-3 w-3" />}
          options={claimTypeOptions}
          value={currentFilters.claimType}
          onValueChange={(value) =>
            handleFilterChange("claimType", value === "all" ? "" : value)
          }
          placeholder="None"
          className="p-0 max-w-[200px] overflow-hidden text-ellipsis whitespace-nowrap"
          triggerClassName="max-w-[200px] overflow-hidden text-ellipsis whitespace-nowrap"
        />
      )}
      <DataTableViewOptions table={table} />
    </div>
  );
}
