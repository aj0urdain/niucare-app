/**
 * @file usePolicyHolder.ts
 * @description Custom hook for managing policyholder data and claims
 * @author Aaron J. Girton - https://github.com/aj0urdain
 * @created 2025
 */

import { useState, useEffect } from "react";
import { useQuery, useMutation } from "@apollo/client";
import {
  GET_POLICYHOLDERCLAIMS,
  ADD_POLICYHOLDERCLAIM,
} from "@/lib/graphql/queries";
import { Claim } from "@/lib/graphql/types";
import { useUserProfileStore } from "@/stores/user-profile-store";
/**
 * Interface for policyholder data state
 * @interface PolicyholderData
 * @property {Claim[]} claims - Array of claims associated with the policyholder
 * @property {boolean} hasClaims - Whether the policyholder has any claims
 * @property {boolean} hasNoClaims - Whether the policyholder has no claims
 * @property {boolean} hasPendingClaims - Whether the policyholder has any pending claims
 * @property {boolean} hasApprovedClaims - Whether the policyholder has any approved claims
 * @property {boolean} hasRejectedClaims - Whether the policyholder has any rejected claims
 * @property {boolean} hasDraftClaims - Whether the policyholder has any draft claims
 * @property {boolean} hasCompleteClaims - Whether the policyholder has any complete claims
 * @property {boolean} hasIncompleteClaims - Whether the policyholder has any incomplete claims
 * @property {boolean} hasSubmittedClaims - Whether the policyholder has any submitted claims
 * @property {boolean} hasNotSubmittedClaims - Whether the policyholder has any claims that are not submitted
 */
interface PolicyholderData {
  claims: Claim[];
  hasClaims: boolean;
  hasNoClaims: boolean;
  hasPendingClaims: boolean;
  hasApprovedClaims: boolean;
  hasRejectedClaims: boolean;
  hasDraftClaims: boolean;
  hasCompleteClaims: boolean;
  hasIncompleteClaims: boolean;
  hasSubmittedClaims: boolean;
  hasNotSubmittedClaims: boolean;
}

/**
 * Custom hook for managing policyholder data and claims
 * @returns {Object} Object containing policyholder data state and claim mutation
 * @property {PolicyholderData} policyholderData - Current state of policyholder claims
 * @property {Function} addClaim - Function to add a new claim
 * @property {boolean} loading - Whether the claims data is being loaded
 * @property {Error | undefined} error - Any error that occurred during claims operations
 *
 * @example
 * ```tsx
 * const { policyholderData, addClaim, loading, error } = usePolicyHolder();
 *
 * // Check if policyholder has claims
 * if (policyholderData.hasClaims) {
 *   // Handle policyholder with claims
 * }
 *
 * // Add a new claim
 * const handleAddClaim = async (claimData: ClaimInput) => {
 *   try {
 *     await addClaim(claimData);
 *     // Handle successful claim addition
 *   } catch (error) {
 *     // Handle claim addition error
 *   }
 * };
 * ```
 */
export const usePolicyHolder = () => {
  const { user } = useUserProfileStore();
  const [policyholderData, setPolicyholderData] = useState<PolicyholderData>({
    claims: [],
    hasClaims: false,
    hasNoClaims: true,
    hasPendingClaims: false,
    hasApprovedClaims: false,
    hasRejectedClaims: false,
    hasDraftClaims: false,
    hasCompleteClaims: false,
    hasIncompleteClaims: false,
    hasSubmittedClaims: false,
    hasNotSubmittedClaims: true,
  });

  const { data, loading, error } = useQuery(GET_POLICYHOLDERCLAIMS, {
    variables: { policyholderId: user?.userId },
    skip: !user?.userId,
  });

  const [addClaim] = useMutation(ADD_POLICYHOLDERCLAIM);

  useEffect(() => {
    if (data?.getPolicyholderClaims) {
      const claims = data.getPolicyholderClaims;
      setPolicyholderData({
        claims,
        hasClaims: claims.length > 0,
        hasNoClaims: claims.length === 0,
        hasPendingClaims: claims.some(
          (claim: Claim) => claim.status === "PENDING"
        ),
        hasApprovedClaims: claims.some(
          (claim: Claim) => claim.status === "APPROVED"
        ),
        hasRejectedClaims: claims.some(
          (claim: Claim) => claim.status === "REJECTED"
        ),
        hasDraftClaims: claims.some((claim: Claim) => claim.status === "DRAFT"),
        hasCompleteClaims: claims.some(
          (claim: Claim) => claim.status === "COMPLETE"
        ),
        hasIncompleteClaims: claims.some(
          (claim: Claim) => claim.status === "INCOMPLETE"
        ),
        hasSubmittedClaims: claims.some(
          (claim: Claim) => claim.status === "SUBMITTED"
        ),
        hasNotSubmittedClaims: claims.every(
          (claim: Claim) => claim.status !== "SUBMITTED"
        ),
      });
    }
  }, [data]);

  return {
    policyholderData,
    addClaim,
    loading,
    error,
  };
};
