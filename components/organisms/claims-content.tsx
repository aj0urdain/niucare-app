"use client";

import { useState } from "react";
import { Claim, columns } from "@/components/atoms/columns-data";
import { DataTable } from "@/components/organisms/data-table";
import { Separator } from "@/components/ui/separator";
import { useQuery } from "@apollo/client";
import { GET_POLICYHOLDERCLAIMS } from "@/lib/graphql/queries";
import { useUserProfileStore } from "@/stores/user-profile-store";

interface FilterValues {
  status: string;
  claimId: string;
  employeeNumber: string;
  claimType: string;
}

interface PolicyHolderClaim {
  id: number;
  employeeNo: string;
  providerRegNumber: string;
  label: string;
  amount: number;
  description: string;
  status: string;
  documents: string;
  reason?: string;
  userBucket?: string;
}

interface ClaimsContentProps {
  initialClaimId?: string | null;
}

export const ClaimsContent = ({ initialClaimId }: ClaimsContentProps) => {
  const { user } = useUserProfileStore();
  const [filters, setFilters] = useState<FilterValues>({
    status: "",
    claimId: "",
    employeeNumber: "",
    claimType: "",
  });

  const { loading, data } = useQuery(GET_POLICYHOLDERCLAIMS, {
    variables: {
      userId: user?.permissions?.canApproveRegistration
        ? ""
        : user?.userId || "",
      providerRegNumber: "",
      claimId: filters.claimId,
      employeeNo: filters.employeeNumber,
      claimCode: filters.claimType,
      status: filters.status,
    },
    skip: !user?.userId,
  });

  const transformedData: Claim[] =
    data?.policyHolderClaims?.map((claim: PolicyHolderClaim) => ({
      id: claim.id.toString(),
      claimId: claim.id.toString(),
      amount: claim.amount,
      status: claim.status.toLowerCase(),
      claimType: claim.label,
      employeeNumber: claim.employeeNo,
      description: claim.description,
      viewFiles: claim.documents || "",
    })) || [];

  return (
    <div className="flex flex-col gap-6 pt-6">
      {!user?.permissions?.canApproveRegistration && (
        <>
          <div className="flex flex-col justify-start items-start gap-2">
            <h2 className="text-3xl font-bold">Claims</h2>
          </div>

          <Separator />
        </>
      )}
      <DataTable
        columns={columns}
        data={transformedData}
        newClaimButton={true}
        loading={loading}
        filters={filters}
        onFilterChange={setFilters}
        initialClaimId={initialClaimId}
      />
    </div>
  );
};
