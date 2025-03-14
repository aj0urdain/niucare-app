"use client";

import { useQuery } from "@apollo/client";
import { GET_POLICYHOLDERCLAIMS } from "@/lib/graphql/queries";
import { useEffect, useState } from "react";
import { getCurrentUser } from "aws-amplify/auth";

export function TestQueryComponent() {
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    const getUserId = async () => {
      try {
        const { userId } = await getCurrentUser();
        setUserId(userId);
        console.log("Got userId:", userId);
      } catch (error) {
        console.error("Error getting user ID:", error);
      }
    };
    getUserId();
  }, []);

  const { loading, error, data } = useQuery(GET_POLICYHOLDERCLAIMS, {
    variables: {
      userId: userId || "",
      providerRegNumber: "",
      claimId: "",
      employeeNo: "",
      claimCode: "",
      status: "",
    },
    skip: !userId,
    onCompleted: (data) => console.log("Query successful:", data),
    onError: (error) => {
      console.error("Query failed:", error);
      console.error("Error details:", error.graphQLErrors);
      console.error("Network error:", error.networkError);
    },
  });

  if (loading) return <div>Loading claims...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div>
      <h3>Policy Holder Claims Test</h3>
      <pre>{JSON.stringify(data?.policyHolderClaims, null, 2)}</pre>
    </div>
  );
}
