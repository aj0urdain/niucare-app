"use client";

import { columns } from "@/components/atoms/admin-registration-columns";
import { DataTable } from "@/components/organisms/data-table";
import { useQuery } from "@apollo/client";
import { GET_REGISTRATIONS } from "@/lib/graphql/queries";
import { useState, useEffect } from "react";
import { ProtectedRouteProvider } from "@/providers/protected-route-provider";
import { useSearchParams, useRouter } from "next/navigation";
import { Separator } from "@/components/ui/separator";
import { FilePen } from "lucide-react";

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
  const router = useRouter();
  const searchParams = useSearchParams();

  const [filters, setFilters] = useState<FilterValues>({
    status: searchParams.get("status") || "",
    province: searchParams.get("province") || "",
    type: searchParams.get("type") || "",
  });

  // Update URL when filters change
  useEffect(() => {
    const params = new URLSearchParams();
    if (filters.status) params.set("status", filters.status);
    if (filters.province) params.set("province", filters.province);
    if (filters.type) params.set("type", filters.type);

    const newUrl = params.toString() ? `?${params.toString()}` : "";
    router.replace(newUrl, { scroll: false });
  }, [filters, router]);

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
    <ProtectedRouteProvider
      requiredPermissions={{ canApproveRegistration: true }}
    >
      <div className="flex items-center gap-2 mt-4">
        <FilePen className="h-8 w-8 animate-slide-down-fade-in" />
        <h1 className="text-4xl font-bold animate-slide-up-fade-in">
          Registrations
        </h1>
      </div>
      {/* <Separator className="my-8" /> */}
      <div className="flex flex-col gap-6 animate-slide-up-fade-in">
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
    </ProtectedRouteProvider>
  );
}
