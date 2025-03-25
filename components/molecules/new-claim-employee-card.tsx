import {
  BadgeCheck,
  BadgeX,
  Landmark,
  Mars,
  Search,
  User,
  Venus,
  VenusAndMars,
  Loader2,
} from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { InputWithLabel } from "../atoms/input-with-label";
import { useState } from "react";
import { Dot } from "../atoms/dot";
import { Button } from "../ui/button";
import { useLazyQuery } from "@apollo/client";
import {
  GET_POLICY_HOLDER_BY_EMPLOYEE_NO,
  GET_HAS_BANK_DETAILS,
} from "@/lib/graphql/queries";
import { Separator } from "../ui/separator";
import { PolicyHolder } from "@/lib/hooks/usePolicyHolder";

interface NewClaimEmployeeCardProps {
  employeeNumber: string;
  setEmployeeNumber: (employeeNumber: string) => void;
  employeeData: PolicyHolder | null;
  setEmployeeData: (employeeData: PolicyHolder | null) => void;
  hasBankDetails: boolean;
  setHasBankDetails: (hasBankDetails: boolean) => void;
}

interface BankDetailsResponse {
  hasBankDetails: boolean;
}

export function NewClaimEmployeeCard({
  employeeNumber,
  setEmployeeNumber,
  employeeData,
  setEmployeeData,
  hasBankDetails,
  setHasBankDetails,
}: NewClaimEmployeeCardProps) {
  // Set up Apollo lazy queries
  const [getPolicyHolder, { loading }] = useLazyQuery(
    GET_POLICY_HOLDER_BY_EMPLOYEE_NO,
    {
      onCompleted: (data) => {
        if (data?.policyHolderByEmployeeNo?.[0]) {
          setEmployeeData(data.policyHolderByEmployeeNo[0]);
        } else {
          setEmployeeData(null);
        }
      },
      onError: (error) => {
        console.error("Error fetching policy holder:", error);
        setEmployeeData(null);
      },
      fetchPolicy: "network-only",
    }
  );

  const [checkBankDetails, { loading: bankLoading }] = useLazyQuery(
    GET_HAS_BANK_DETAILS,
    {
      onCompleted: (data) => {
        setHasBankDetails(data.hasBankDetails);
      },
      onError: (error) => {
        console.error("Error fetching bank details:", error);
        setHasBankDetails(false);
      },
      fetchPolicy: "network-only",
    }
  );

  const handleSearch = () => {
    if (employeeNumber) {
      // Reset bank response when searching
      setHasBankDetails(false);

      // Get policy holder data
      getPolicyHolder({
        variables: {
          employeeNo: employeeNumber,
        },
        onCompleted: (data) => {
          if (data?.policyHolderByEmployeeNo?.[0]) {
            setEmployeeData(data.policyHolderByEmployeeNo[0]);

            // Only check bank details after we have employee data
            checkBankDetails({
              variables: {
                employeeNo: employeeNumber,
                body: {},
              },
            });
          } else {
            setEmployeeData(null);
          }
        },
      });
    }
  };

  const showBankResult = !bankLoading && hasBankDetails;

  return (
    <Card className="h-fit min-h-[200px] border rounded-xl p-4 flex gap-4">
      <div className="flex flex-col items-start justify-between w-full">
        <CardHeader className="p-0">
          <CardTitle className="text-sm font-semibold text-muted-foreground flex items-end gap-1">
            <InputWithLabel
              label="Employee Number"
              icon={<User className="w-3 h-3" />}
              value={employeeNumber}
              onChange={(e) => setEmployeeNumber(e.target.value)}
            />
            <Button
              variant="default"
              size="icon"
              onClick={handleSearch}
              disabled={loading}
            >
              {loading ? "..." : <Search className="w-3 h-3" />}
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {employeeData ? (
            <>
              <div className="flex items-center gap-1">
                <BadgeCheck className="w-3 h-3" />
                <h2 className="text-xs font-semibold text-muted-foreground/75">
                  Verified
                </h2>
              </div>

              <h1 className="text-lg font-semibold text-foreground">
                {employeeData.name || "Unknown Name"}
              </h1>

              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1">
                  {employeeData.gender === "male" ||
                  employeeData.gender === "Male" ||
                  employeeData.gender === "M" ||
                  employeeData.gender === "m" ? (
                    <Mars className="w-3 h-3" />
                  ) : employeeData.gender === "female" ||
                    employeeData.gender === "Female" ||
                    employeeData.gender === "F" ||
                    employeeData.gender === "f" ? (
                    <Venus className="w-3 h-3" />
                  ) : (
                    <VenusAndMars className="w-3 h-3" />
                  )}
                  <p className="text-xs text-muted-foreground/75">
                    {employeeData.gender === "male" ||
                    employeeData.gender === "Male" ||
                    employeeData.gender === "M" ||
                    employeeData.gender === "m"
                      ? "Male"
                      : employeeData.gender === "female" ||
                        employeeData.gender === "Female" ||
                        employeeData.gender === "F" ||
                        employeeData.gender === "f"
                      ? "Female"
                      : "N/A"}
                  </p>
                </div>
                <Dot
                  size="tiny"
                  className="bg-muted-foreground/75 animate-pulse"
                />
                <p className="text-xs text-muted-foreground/75">
                  {employeeData.dateOfBirth
                    ? new Date(employeeData.dateOfBirth).toLocaleDateString()
                    : "N/A"}
                </p>
              </div>
            </>
          ) : loading ? (
            <p className="text-sm text-muted-foreground">Loading...</p>
          ) : (
            <p className="text-sm text-muted-foreground">
              Enter an employee number and click search
            </p>
          )}
        </CardContent>
      </div>

      <Separator orientation="vertical" className="h-full mx-2" />

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
            {showBankResult && hasBankDetails ? (
              <BadgeCheck className="w-3 h-3" />
            ) : showBankResult && !hasBankDetails ? (
              <BadgeX className="w-3 h-3" />
            ) : (
              <Loader2 className={`w-3 h-3 animate-spin`} />
            )}
            <h2 className="text-sm font-semibold text-muted-foreground/75">
              {showBankResult && hasBankDetails
                ? "Verified"
                : showBankResult && !hasBankDetails
                ? "Not Verified"
                : bankLoading
                ? "Checking..."
                : "Pending..."}
            </h2>
          </div>

          <h1 className="text-xs text-muted-foreground/75">
            {showBankResult && hasBankDetails
              ? "This policy holder has successfully linked their bank account."
              : showBankResult && !hasBankDetails
              ? "This policy holder has not linked their bank account yet."
              : bankLoading
              ? "Checking bank details..."
              : "Waiting for employee number..."}
          </h1>
        </CardContent>
      </div>
    </Card>
  );
}
