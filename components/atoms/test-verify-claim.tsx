"use client";

import { useState } from "react";
import { useLazyQuery } from "@apollo/client";
import { GET_VERIFY_CLAIM } from "@/lib/graphql/queries";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function TestVerifyClaimQuery() {
  const [result, setResult] = useState<any>(null);

  // Fixed payload based on your example
  const payload = {
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
        console.log("Verify Claim Query successful:", data);
        setResult(data);
      },
      onError: (error) => {
        console.error("Verify Claim Query failed:", error);
        console.error("Error details:", error.graphQLErrors);
        console.error("Network error:", error.networkError);
      },
    }
  );

  const handleVerifyClaim = () => {
    console.log("Sending verify claim with input:", payload);

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
