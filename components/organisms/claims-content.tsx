/**
 * File: components/organisms/claims-content.tsx
 * Description: Main content component for displaying and managing claims
 * Author: Aaron J. Girton - https://github.com/aj0urdain
 * Created: 2025
 */

"use client";

import { useState } from "react";
import { Claim, columns } from "@/components/atoms/columns-data";
import { DataTable } from "@/components/organisms/data-table";
import { Separator } from "@/components/ui/separator";
import { useQuery } from "@apollo/client";
import { GET_POLICYHOLDERCLAIMS } from "@/lib/graphql/queries";
import { useUserProfileStore } from "@/stores/user-profile-store";

/**
 * Interface for filter values used in claims table
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
 * Interface for policy holder claim data
 * @property id - Unique identifier for the claim
 * @property employeeNo - Employee number associated with the claim
 * @property providerRegNumber - Provider registration number
 * @property label - Claim type label
 * @property amount - Claim amount
 * @property description - Claim description
 * @property status - Claim status
 * @property documents - Associated documents
 * @property reason - Optional rejection reason
 * @property userBucket - Optional user bucket identifier
 */
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

/**
 * Props for the ClaimsContent component
 * @property initialClaimId - Optional initial claim ID to display
 */
interface ClaimsContentProps {
  initialClaimId?: string | null;
}

/**
 * ClaimsContent Component
 *
 * Main component for displaying and managing claims. Handles data fetching,
 * filtering, and display of claims in a data table format.
 *
 * @param {ClaimsContentProps} props - Component props
 * @returns {JSX.Element} The rendered claims content with data table
 *
 * @example
 * ```tsx
 * <ClaimsContent initialClaimId="123" />
 * ```
 */
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
      userBucket: claim.userBucket || "",
    })) || [];

  return (
    <div className="flex flex-col gap-6 pt-6">
      <DataTable
        columns={columns}
        data={transformedData}
        newClaimButton={true}
        loading={loading}
        filters={filters}
        onFilterChange={setFilters}
        initialClaimId={initialClaimId}
        type="claim"
        visibleFilters={["status", "claimId", "employeeNumber", "claimType"]}
      />
    </div>
  );
};
