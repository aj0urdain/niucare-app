"use client";

import { useEffect, useState } from "react";
import { columns } from "@/components/atoms/admin-claims-columns";
import { DataTable } from "@/components/organisms/data-table";
import { useQuery } from "@apollo/client";
import { GET_POLICYHOLDERCLAIMS } from "@/lib/graphql/queries";
import { getCurrentUser } from "aws-amplify/auth";
import {
  CirclePlus,
  CircleCheckBig,
  CircleDashed,
  CircleX,
} from "lucide-react";

interface FilterValues {
  status: string;
  claimId: string;
  employeeNumber: string;
  claimType: string;
}

export default function AdminClaimsPage() {
  const [userId, setUserId] = useState<string | null>(null);
  const [filters, setFilters] = useState<FilterValues>({
    status: "",
    claimId: "",
    employeeNumber: "",
    claimType: "",
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

  const { loading, error, data } = useQuery(GET_POLICYHOLDERCLAIMS, {
    variables: {
      userId: "",
      providerRegNumber: "",
      claimId: filters.claimId,
      employeeNo: filters.employeeNumber,
      claimCode: filters.claimType,
      status: filters.status,
    },
  });

  const transformedData =
    data?.policyHolderClaims?.map((claim: any) => ({
      id: claim.id.toString(),
      providerRegNumber: claim.providerRegNumber,
      claimId: claim.id.toString(),
      employeeNumber: claim.employeeNo,
      claimType: claim.label,
      amount: claim.amount,
      description: claim.description,
      status: claim.status.toLowerCase(),
      documents: claim.documents,
      reason: claim.reason,
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
