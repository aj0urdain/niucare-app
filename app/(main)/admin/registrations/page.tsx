"use client";

import { columns } from "@/components/atoms/admin-registration-columns";
import { DataTable } from "@/components/organisms/data-table";
import { useQuery } from "@apollo/client";
import { GET_REGISTRATIONS } from "@/lib/graphql/queries";
import { useState } from "react";

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
  const [filters, setFilters] = useState<FilterValues>({
    status: "",
    province: "",
    type: "",
  });

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
      userId: registration.userId,
      registrationId: registration.luhnRegistrationNumber,
      email: registration.email,
      firstName: registration.public_officer_firstname,
      lastName: registration.public_officer_lastname,
      practiceName: registration.practice_Name,
      province: registration.practice_Province,
      type: registration.ptype,
      status: registration.status,
    })) || [];

  return (
    <div className="flex flex-col gap-6">
      <DataTable
        columns={columns}
        data={transformedData}
        loading={loading}
        error={error}
        filters={filters}
        onFilterChange={setFilters}
        type="registration"
        visibleFilters={["status", "type", "province"]}
      />
    </div>
  );
}
