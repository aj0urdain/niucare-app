/**
 * File: components/atoms/test-verify-claim.tsx
 * Description: Test component for verifying claim submissions
 * Author: Aaron J. Girton - https://github.com/aj0urdain
 * Created: 2025
 *
 * This component provides a test interface for verifying claim submissions
 * using Apollo GraphQL. It includes error handling, loading states, and
 * response display.
 */

"use client";

import { useState } from "react";
import { useLazyQuery } from "@apollo/client";
import { GET_VERIFY_CLAIM } from "@/lib/graphql/queries";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

/**
 * ClaimPayload type definition
 * Represents the payload for verifying a claim
 *
 * @property {string} employeeNo - Employee number
 * @property {string} claimCode - Code identifying the type of claim
 * @property {string} amount - Claim amount
 * @property {string} description - Optional description of the claim
 * @property {string} userId - ID of the user submitting the claim
 * @property {string} status - Current status of the claim
 * @property {number} claimGroup - Group identifier for the claim
 * @property {string} documents - Associated documents
 */
interface ClaimPayload {
  employeeNo: string;
  claimCode: string;
  amount: string;
  description: string;
  userId: string;
  status: string;
  claimGroup: number;
  documents: string;
}

/**
 * VerifyClaimResponse type definition
 * Represents the response from verifying a claim
 *
 * @property {boolean} success - Whether the verification was successful
 * @property {string} message - Response message
 * @property {object} data - Additional response data
 */
interface VerifyClaimResponse {
  success: boolean;
  message: string;
  data: Record<string, unknown>;
}

/**
 * TestVerifyClaimQuery Component
 *
 * A test component for verifying claim submissions using Apollo GraphQL.
 * Features:
 * - Fixed test payload
 * - GraphQL query execution
 * - Loading states
 * - Error handling
 * - Response display
 *
 * @returns {JSX.Element} Test interface for verifying claims
 *
 * @example
 * ```tsx
 * // Basic usage
 * <TestVerifyClaimQuery />
 *
 * // With custom styling
 * <div className="custom-container">
 *   <TestVerifyClaimQuery />
 * </div>
 * ```
 */
export function TestVerifyClaimQuery() {
  const [result, setResult] = useState<VerifyClaimResponse | null>(null);

  // Fixed payload based on your example
  const payload: ClaimPayload = {
    employeeNo: "10022495",
    claimCode: "1301",
    amount: "122",
    description: "",
    userId: "e98e7468-f0a1-7048-be8a-528296bf6821",
    status: "Pending",
    claimGroup: 4,
    documents: "",
  };

  const [verifyClaimQuery, { loading, error }] = useLazyQuery(
    GET_VERIFY_CLAIM,
    {
      fetchPolicy: "network-only",
      errorPolicy: "all",
      onCompleted: (data) => {
        setResult(data);
      },
      onError: (error) => {
        console.error("Verify Claim Query failed:", error);
        console.error("Error details:", error.graphQLErrors);
        console.error("Network error:", error.networkError);
      },
    }
  );

  /**
   * Handles the verification of a claim
   * Executes the GraphQL query with the fixed payload
   */
  const handleVerifyClaim = () => {
    verifyClaimQuery({
      variables: {
        input: payload,
      },
    });
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Test Verify Claim Query</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="p-2 bg-slate-100 rounded">
          <h3 className="font-medium mb-2">Using Fixed Payload:</h3>
          <pre className="text-xs overflow-auto whitespace-pre-wrap">
            {JSON.stringify(payload, null, 2)}
          </pre>
        </div>

        <Button
          className="w-full"
          onClick={handleVerifyClaim}
          disabled={loading}
        >
          {loading ? "Verifying..." : "Verify Claim"}
        </Button>

        {error && (
          <div className="p-2 border border-red-300 bg-red-50 rounded text-red-600">
            <p className="font-medium">Error:</p>
            <pre className="text-xs overflow-auto whitespace-pre-wrap">
              {JSON.stringify(error, null, 2)}
            </pre>
          </div>
        )}

        {result && (
          <div className="p-2 border border-green-300 bg-green-50 rounded">
            <p className="font-medium">Response:</p>
            <pre className="text-xs overflow-auto whitespace-pre-wrap">
              {JSON.stringify(result, null, 2)}
            </pre>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
