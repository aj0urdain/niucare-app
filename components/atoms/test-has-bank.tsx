/**
 * File: components/atoms/test-has-bank.tsx
 * Description: Test component for querying bank details status
 * Author: Aaron J. Girton - https://github.com/aj0urdain
 * Created: 2025
 *
 * This component provides a test interface for checking if a user has bank details
 * using three different methods: Apollo GraphQL, Direct Fetch, and Tanstack Query.
 * It demonstrates different approaches to data fetching and state management.
 */

"use client";

import { useState } from "react";
import { useLazyQuery } from "@apollo/client";
import { useMutation } from "@tanstack/react-query";
import { GET_HAS_BANK_DETAILS } from "@/lib/graphql/queries";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { fetchAuthSession } from "aws-amplify/auth";

/**
 * BankDetailsResponse type definition
 * Represents the response from checking bank details status
 *
 * @property {boolean} hasBankDetails - Indicates whether the user has bank details
 */
type BankDetailsResponse = {
  hasBankDetails: boolean;
};

/**
 * Helper function to fetch bank details directly from the API
 *
 * @param {string} employeeNo - The employee number to check
 * @returns {Promise<boolean>} Promise resolving to whether the user has bank details
 * @throws {Error} If no auth token is available or if the API request fails
 *
 * @example
 * ```typescript
 * try {
 *   const hasBankDetails = await directFetchBankDetails("00726281");
 *   console.log("Has bank details:", hasBankDetails);
 * } catch (error) {
 *   console.error("Error fetching bank details:", error);
 * }
 * ```
 */
const directFetchBankDetails = async (employeeNo: string): Promise<boolean> => {
  const session = await fetchAuthSession();
  const token = session.tokens?.accessToken?.toString() || "";

  if (!token) {
    throw new Error("No auth token available");
  }

  const apiEndpoint = process.env.NEXT_PUBLIC_API_ENDPOINT;
  const url = new URL(`${apiEndpoint}/claim/hasBankDetails`);
  url.searchParams.append("employeeNo", employeeNo);

  const response = await fetch(url.toString(), {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`API error (${response.status}): ${errorText}`);
  }

  return response.json();
};

/**
 * TestBankDetailsQuery Component
 *
 * A test component that demonstrates three different methods of checking bank details:
 * 1. Apollo GraphQL Query
 * 2. Direct Fetch API Call
 * 3. Tanstack Query Mutation
 *
 * Features:
 * - Multiple data fetching methods
 * - Loading states
 * - Error handling
 * - Response display
 * - Disabled states during loading
 *
 * @returns {JSX.Element} Test interface for checking bank details
 *
 * @example
 * ```tsx
 * // Basic usage
 * <TestBankDetailsQuery />
 *
 * // With custom styling
 * <div className="custom-container">
 *   <TestBankDetailsQuery />
 * </div>
 * ```
 */
export function TestBankDetailsQuery() {
  const [response, setResponse] = useState<BankDetailsResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const employeeNo = "00726281";

  // 1. Apollo GraphQL Implementation (already lazy by default)
  const [checkWithApollo, apolloState] = useLazyQuery(GET_HAS_BANK_DETAILS, {
    variables: {
      employeeNo,
      body: {},
    },
    fetchPolicy: "network-only",
    onCompleted: (data) => {
      setResponse(data);
      setError(null);
    },
    onError: (err) => {
      setError(err.message);
      setResponse(null);
    },
  });

  // 2. Direct Fetch Implementation (already manual)
  const handleDirectFetch = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await directFetchBankDetails(employeeNo);
      setResponse({ hasBankDetails: data });
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
      setResponse(null);
    } finally {
      setLoading(false);
    }
  };

  // 3. Tanstack Query Implementation using mutation instead of query
  // This ensures it doesn't run automatically
  const tanstackMutation = useMutation({
    mutationFn: () => directFetchBankDetails(employeeNo),
    onSuccess: (data) => {
      setResponse({ hasBankDetails: data });
      setError(null);
    },
    onError: (error: Error) => {
      setError(error.message);
      setResponse(null);
    },
  });

  const handleTanstackFetch = () => {
    tanstackMutation.mutate();
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Bank Details Query Test</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="p-2 bg-slate-100 rounded">
          <h3 className="font-medium mb-2">Using Employee Number:</h3>
          <pre className="text-xs">{employeeNo}</pre>
        </div>

        <div className="flex flex-col gap-2">
          <Button
            onClick={() => checkWithApollo()}
            disabled={
              apolloState.loading || loading || tanstackMutation.isPending
            }
          >
            {apolloState.loading ? "Loading..." : "1. Apollo GraphQL"}
          </Button>

          <Button
            variant="outline"
            onClick={handleDirectFetch}
            disabled={
              apolloState.loading || loading || tanstackMutation.isPending
            }
          >
            {loading ? "Loading..." : "2. Direct Fetch"}
          </Button>

          <Button
            variant="secondary"
            onClick={handleTanstackFetch}
            disabled={
              apolloState.loading || loading || tanstackMutation.isPending
            }
          >
            {tanstackMutation.isPending ? "Loading..." : "3. Tanstack Query"}
          </Button>
        </div>

        {error && (
          <div className="p-2 border border-red-300 bg-red-50 rounded text-red-600">
            <p className="font-medium">Error:</p>
            <pre className="text-xs">{error}</pre>
          </div>
        )}

        {response && !error && (
          <div className="p-2 border border-green-300 bg-green-50 rounded">
            <p className="font-medium">Response:</p>
            <pre className="text-xs overflow-auto whitespace-pre-wrap">
              {JSON.stringify(response, null, 2)}
            </pre>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
