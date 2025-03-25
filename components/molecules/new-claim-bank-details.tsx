import { BadgeCheck, BadgeX, Landmark, Loader2 } from "lucide-react";
import { CardContent, CardHeader, CardTitle } from "../ui/card";
import { GET_HAS_BANK_DETAILS } from "@/lib/graphql/queries";
import { useLazyQuery } from "@apollo/client";
import { useState } from "react";
import React from "react";

interface NewClaimBankDetailsProps {
  employeeNumber: string;
  employeeData: any;
}

interface BankDetailsResponse {
  hasBankDetails: boolean;
}

export function NewClaimBankDetails({
  employeeNumber,
  employeeData,
}: NewClaimBankDetailsProps) {
  const [response, setResponse] = useState<BankDetailsResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  const [checkBankDetails, { loading }] = useLazyQuery(GET_HAS_BANK_DETAILS, {
    onCompleted: (data) => {
      setResponse(data);
      setError(null);
    },
    onError: (err) => {
      setError(err.message);
      setResponse(null);
    },
    fetchPolicy: "network-only",
  });

  // Effect to check bank details only when employeeData.id changes
  React.useEffect(() => {
    if (employeeData?.id) {
      checkBankDetails({
        variables: {
          employeeNo: employeeNumber,
          body: {},
        },
      });
    }
  }, [employeeData?.id, employeeNumber, checkBankDetails]);

  const showResult = !loading && response;
  const hasBankDetails = response?.hasBankDetails;

  return (
    <div className="flex relative flex-col items-start justify-between w-full">
      <Landmark className="absolute top-0 right-0 w-24 h-24 opacity-10" />
      <CardHeader className="p-0">
        <CardTitle className="text-xs font-semibold text-muted-foreground/75 flex items-center gap-1">
          <Landmark className="w-3 h-3" />
          Bank Details
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0 justify-end flex flex-col h-full gap-1">
        <div className="flex items-center gap-1">
          {showResult && hasBankDetails ? (
            <BadgeCheck className="w-3 h-3" />
          ) : showResult && !hasBankDetails ? (
            <BadgeX className="w-3 h-3" />
          ) : (
            <Loader2 className={`w-3 h-3 animate-spin`} />
          )}
          <h2 className="text-sm font-semibold text-muted-foreground/75">
            {showResult && hasBankDetails
              ? "Verified"
              : showResult && !hasBankDetails
              ? "Not Verified"
              : loading
              ? "Checking..."
              : "Pending..."}
          </h2>
        </div>

        <h1 className="text-xs text-muted-foreground/75">
          {showResult && hasBankDetails
            ? "This policy holder has successfully linked their bank account."
            : showResult && !hasBankDetails
            ? "This policy holder has not linked their bank account yet."
            : loading
            ? "Checking bank details..."
            : "Waiting for employee number..."}
        </h1>
      </CardContent>
    </div>
  );
}
