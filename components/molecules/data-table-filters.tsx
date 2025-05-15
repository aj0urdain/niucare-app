import { Table } from "@tanstack/react-table";
import {
  CirclePlus,
  CircleCheckBig,
  CircleDashed,
  CircleX,
  Filter,
} from "lucide-react";
import { ComboBoxResponsive } from "./combobox-responsive";
import { InputWithLabel } from "@/components/atoms/input-with-label";
import { DataTableViewOptions } from "./data-table-column-toggle";
import { useQuery } from "@apollo/client";
import { GET_CATALOGS } from "@/lib/graphql/queries";
import React from "react";

interface FilterValues {
  status: string;
  claimId: string;
  employeeNumber: string;
  claimType: string;
}

export interface CatalogOption {
  id: string;
  group: number;
  label: string;
  __typename: string;
}

interface DataTableFiltersProps<TData> {
  table: Table<TData>;
  onFilterChange: (filters: FilterValues) => void;
  currentFilters: FilterValues;
}

export function DataTableFilters<TData>({
  table,
  onFilterChange,
  currentFilters,
}: DataTableFiltersProps<TData>) {
  const { data: catalogsData } = useQuery(GET_CATALOGS);

  console.log(catalogsData);

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
    <div className="flex items-end justify-end gap-0">
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
        ]}
        value={currentFilters.status}
        onValueChange={(value) =>
          handleFilterChange("status", value === "all" ? "" : value)
        }
        placeholder="Filter by Status"
        className="p-0 max-w-48"
        triggerClassName="max-w-48"
      />
      <InputWithLabel
        id="claimId"
        label="Claim ID"
        placeholder="Claim ID..."
        value={currentFilters.claimId}
        onChange={(event) => handleFilterChange("claimId", event.target.value)}
        className="max-w-40"
        icon={<Filter className="h-3 w-3" />}
      />
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
      <DataTableViewOptions table={table} />
    </div>
  );
}
