import {
  BadgeCheck,
  BadgeX,
  Mars,
  Venus,
  VenusAndMars,
  Loader2,
  RotateCcw,
  IdCard,
  Search,
  Landmark,
  XCircle,
} from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { InputWithLabel } from "../atoms/input-with-label";
import { Dot } from "@/components/atoms/dot";
import { Button } from "../ui/button";
import { Separator } from "@/components/ui/separator";
import { useEmployeeStore } from "@/stores/employee-store";
import { useEmployeeData } from "@/lib/hooks/useEmployeeData";
import { useState, useRef, useEffect } from "react";
import { useUserProfileStore } from "@/stores/user-profile-store";

export function NewClaimEmployeeCard() {
  const {
    employeeNumber,
    setEmployeeNumber,
    employeeData,
    clearEmployeeData,
    clearEmployeeNumber,
  } = useEmployeeStore();
  const { refetchEmployeeData } = useEmployeeData();
  const [loading, setLoading] = useState(false);
  const { user } = useUserProfileStore();
  const inputRef = useRef<HTMLInputElement>(null);
  const [isInvalid, setIsInvalid] = useState(false);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  const handleReset = () => {
    clearEmployeeData();
    clearEmployeeNumber();
    setIsInvalid(false);

    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  const handleSearch = async () => {
    if (employeeNumber) {
      setLoading(true);
      setIsInvalid(false);
      try {
        await refetchEmployeeData();
        // Check if we got valid employee data after the refetch
        if (!employeeData || !employeeData.name) {
          setIsInvalid(true);
        }
      } catch (error) {
        console.error("Error fetching employee data:", error);
        setIsInvalid(true);
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <Card
      className={`h-fit min-h-[200px] border rounded-xl p-4 flex gap-4 ${
        employeeData
          ? "animate-border-flash-green bg-green-50/50"
          : isInvalid
          ? "animate-border-flash-red border-red-400/20 bg-red-50/50"
          : ""
      }`}
    >
      <div className="flex flex-col items-start justify-between w-full">
        <CardHeader className="p-0">
          <CardTitle className="text-sm font-semibold text-muted-foreground flex flex-col gap-1.5">
            <div className="flex gap-2 w-full">
              <InputWithLabel
                ref={inputRef}
                label="Employee Number"
                icon={<IdCard className="w-4 h-4" />}
                value={employeeNumber || ""}
                onChange={(e) => {
                  setEmployeeNumber(e.target.value);
                  setIsInvalid(false);
                }}
                disabled={!!employeeData}
                className={
                  !employeeData
                    ? isInvalid
                      ? "ring-2 ring-red-500 focus-visible:ring-2 focus-visible:ring-red-500"
                      : !employeeNumber || employeeNumber.length < 3
                      ? "ring-2 ring-blue-700 focus-visible:ring-2 focus-visible:ring-blue-700"
                      : ""
                    : ""
                }
              />
              {employeeData ? (
                <Button
                  variant="outline"
                  size="icon"
                  onClick={handleReset}
                  className="mt-6 hover:bg-destructive/10 group"
                  title="Reset employee number"
                >
                  <RotateCcw className="h-4 w-4 animate-slide-down-fade-in group-hover:animate-spin-reverse" />
                </Button>
              ) : (
                <Button
                  onClick={handleSearch}
                  size="icon"
                  disabled={
                    !employeeNumber ||
                    employeeNumber.length < 3 ||
                    loading ||
                    isInvalid
                  }
                  className={`mt-6 ${
                    employeeNumber && employeeNumber.length >= 3 && !isInvalid
                      ? "bg-blue-700 hover:bg-blue-800 text-primary-foreground"
                      : isInvalid
                      ? "bg-red-500/10 hover:bg-red-500/20 text-red-500"
                      : ""
                  }`}
                >
                  {loading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : isInvalid ? (
                    <XCircle className="h-4 w-4" />
                  ) : (
                    <Search className="h-4 w-4 animate-slide-down-fade-in" />
                  )}
                </Button>
              )}
            </div>
            {!employeeData && !isInvalid && (
              <div className="animate-slide-down-fade-in">
                <p className="text-xs text-blue-700 dark:text-blue-400 animate-pulse">
                  Enter a valid employee number and click search...
                </p>
              </div>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {employeeData ? (
            <>
              <div className="flex items-center gap-1 animate-slide-right-fade-in">
                <BadgeCheck className="w-3 h-3" />
                <h2 className="text-xs font-semibold text-muted-foreground/75">
                  Verified
                </h2>
              </div>

              <h1 className="text-lg font-semibold text-foreground animate-slide-left-fade-in">
                {employeeData.name || "Unknown Name"}
              </h1>

              <div className="flex items-center gap-2 animate-slide-up-fade-in">
                <div className="flex items-center gap-1">
                  {employeeData.gender?.toLowerCase().startsWith("m") ? (
                    <Mars className="w-3 h-3" />
                  ) : employeeData.gender?.toLowerCase().startsWith("f") ? (
                    <Venus className="w-3 h-3" />
                  ) : (
                    <VenusAndMars className="w-3 h-3" />
                  )}
                  <p className="text-xs text-muted-foreground/75">
                    {employeeData.gender?.toLowerCase().startsWith("m")
                      ? "Male"
                      : employeeData.gender?.toLowerCase().startsWith("f")
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
          ) : isInvalid ? (
            <div className="flex flex-col gap-1 animate-slide-down-fade-in">
              <div className="flex items-center gap-1">
                <XCircle className="w-4 h-4 text-red-500" />
                <h2 className="text-sm font-semibold text-red-500">
                  Invalid Employee ID
                </h2>
              </div>
              <p className="text-xs text-muted-foreground/75">
                There was no employee associated with that ID, please check and
                try again
              </p>
            </div>
          ) : loading ? (
            <p className="text-sm text-muted-foreground">Loading...</p>
          ) : (
            <p className="text-sm text-muted-foreground"></p>
          )}
        </CardContent>
      </div>

      {user?.registration?.isPsnaProvider && (
        <>
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
              <div
                className="flex items-center gap-1 animate-slide-down-fade-in"
                key={employeeNumber}
              >
                {/* Waiting for employee number state */}
                {loading && <Loader2 className={`w-3 h-3 animate-spin`} />}

                {/* Bank details verified state */}
                {!loading && employeeData?.hasBankDetails && (
                  <BadgeCheck className="w-3 h-3" />
                )}

                {/* Bank details not verified state */}
                {!loading && employeeData && !employeeData.hasBankDetails && (
                  <BadgeX className="w-3 h-3" />
                )}

                {/* Invalid employee state */}
                {!loading && isInvalid && <></>}

                <h2 className="text-sm font-semibold text-muted-foreground/75">
                  {employeeData?.hasBankDetails
                    ? "Verified"
                    : employeeData && !employeeData.hasBankDetails
                    ? "Not Verified"
                    : loading
                    ? "Checking..."
                    : isInvalid
                    ? ""
                    : ""}
                </h2>
              </div>

              <p
                className={`text-xs ${
                  !employeeData && !loading
                    ? "text-muted-foreground/25"
                    : "text-muted-foreground/75"
                }`}
              >
                {employeeData?.hasBankDetails
                  ? "This policy holder has successfully linked their bank account."
                  : employeeData && !employeeData.hasBankDetails
                  ? "This policy holder has not linked their bank account yet."
                  : loading
                  ? "Checking bank details..."
                  : isInvalid
                  ? "Please enter a valid employee ID to check bank details"
                  : "Waiting for employee data"}
                {!employeeData && !loading && !isInvalid && (
                  <span className="after:content-[''] after:animate-ellipsis" />
                )}
              </p>
            </CardContent>
          </div>
        </>
      )}
    </Card>
  );
}
