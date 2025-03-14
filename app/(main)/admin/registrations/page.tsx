"use client";

import { useEffect, useState } from "react";
import { columns } from "@/components/atoms/admin-registration-columns";
import { DataTable } from "@/components/organisms/data-table";
import { useQuery } from "@apollo/client";
import { GET_REGISTRATIONS } from "@/lib/graphql/queries";
import { getCurrentUser } from "aws-amplify/auth";
import {
  CirclePlus,
  CircleCheckBig,
  CircleDashed,
  CircleX,
} from "lucide-react";

interface FilterValues {
  status: string;
  province: string;
  type: string;
}

interface Registration {
  id: string;
  userId: string;
  luhnRegistrationNumber: string;
  public_officer_firstname: string;
  public_officer_lastname: string;
  email: string;
  practice_Name: string;
  practice_Province: string;
  ptype: string;
  status: string;
}

export default function AdminRegistrationsPage() {
  const [userId, setUserId] = useState<string | null>(null);
  const [filters, setFilters] = useState<FilterValues>({
    status: "",
    province: "",
    type: "",
  });

  useEffect(() => {
    const getUserId = async () => {
      try {
        const { userId } = await getCurrentUser();
        setUserId(userId);
      } catch (error) {
        console.error("Error getting user ID:", error);
      }
    };
    getUserId();
  }, []);

  const { loading, error, data } = useQuery(GET_REGISTRATIONS, {
    variables: {
      province: filters.province,
      type: filters.type,
      status: filters.status,
    },
  });

  const transformedData =
    data?.registrations?.map((registration: Registration) => ({
      id: registration.id,
      registrationId: registration.luhnRegistrationNumber,
      email: registration.email,
      firstName: registration.public_officer_firstname,
      lastName: registration.public_officer_lastname,
      practiceName: registration.practice_Name,
      province: registration.practice_Province,
      type: registration.ptype,
      status:
        registration.status.toLowerCase() === "approved"
          ? "approved"
          : registration.status.toLowerCase() === "rejected"
          ? "rejected"
          : "pending",
    })) || [];

  const filterConfig = [
    {
      id: "status",
      label: "Status",
      type: "combobox",
      placeholder: "Filter by Status",
      options: [
        {
          id: "all",
          value: "",
          label: "All Status",
          icon: <CirclePlus className="h-3 w-3 text-muted-foreground/75" />,
        },
        {
          id: "pending",
          value: "Pending",
          label: "Pending",
          icon: <CircleDashed className="h-3 w-3 text-yellow-500" />,
        },
        {
          id: "approved",
          value: "Approved",
          label: "Approved",
          icon: <CircleCheckBig className="h-3 w-3 text-green-500" />,
        },
        {
          id: "rejected",
          value: "Rejected",
          label: "Rejected",
          icon: <CircleX className="h-3 w-3 text-red-500" />,
        },
      ],
    },
    {
      id: "type",
      label: "Type",
      type: "combobox",
      placeholder: "Filter by Type",
      options: [
        { id: "all", value: "", label: "All Types" },
        { id: "private", value: "private", label: "Private" },
        { id: "public", value: "public", label: "Public" },
      ],
    },
    {
      id: "province",
      label: "Province",
      type: "combobox",
      placeholder: "Filter by Province",
      options: [
        { id: "all", value: "", label: "All Provinces" },
        // Add your provinces here
      ],
    },
  ];

  return (
    <div className="flex flex-col gap-6">
      <DataTable
        columns={columns}
        data={transformedData}
        loading={loading}
        error={error}
        filters={filters}
        onFilterChange={setFilters}
        filterConfig={filterConfig}
      />
    </div>
  );
}
