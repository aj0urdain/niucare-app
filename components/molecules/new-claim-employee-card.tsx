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
import { Dot } from "../atoms/dot";
import { Button } from "../ui/button";
import { Separator } from "../ui/separator";
import { useEmployeeStore } from "@/stores/employee-store";
import { useEmployeeData } from "@/lib/hooks/useEmployeeData";
import { useState } from "react";

interface NewClaimEmployeeCardProps {
  formState: string | null;
  setFormState: (formState: string | null) => void;
}

export function NewClaimEmployeeCard({
  formState,
  setFormState,
}: NewClaimEmployeeCardProps) {
  const { employeeNumber, setEmployeeNumber, employeeData } =
    useEmployeeStore();
  const { refetchEmployeeData } = useEmployeeData();
  const [loading, setLoading] = useState(false);

  const handleSearch = async () => {
    if (employeeNumber) {
      setLoading(true);
      try {
        await refetchEmployeeData();
        setFormState("VALID_EMPLOYEE");
      } catch (error) {
        console.error("Error fetching employee data:", error);
        setFormState("INVALID_EMPLOYEE");
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <Card className="h-fit min-h-[200px] border rounded-xl p-4 flex gap-4">
      <div className="flex flex-col items-start justify-between w-full">
        <CardHeader className="p-0">
          <CardTitle className="text-sm font-semibold text-muted-foreground flex items-end gap-1">
            <InputWithLabel
              label="Employee Number"
              icon={<User className="w-3 h-3" />}
              value={employeeNumber ?? ""}
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
          ) : loading ? (
            <p className="text-sm text-muted-foreground">Loading...</p>
          ) : formState === "INVALID_EMPLOYEE" ? (
            <div className="flex flex-col items-start gap-1">
              <div className="flex items-center gap-1">
                <BadgeX className="w-4 h-4 text-destructive" />
                <h2 className="text-sm font-semibold text-destructive">
                  Invalid Employee Number
                </h2>
              </div>
              <p className="text-xs text-destructive">
                No employee found with this ID. Please check and try again.
              </p>
            </div>
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

            <h2 className="text-sm font-semibold text-muted-foreground/75">
              {employeeData?.hasBankDetails
                ? "Verified"
                : employeeData && !employeeData.hasBankDetails
                ? "Not Verified"
                : loading
                ? "Checking..."
                : "Pending..."}
            </h2>
          </div>

          <p className="text-xs text-muted-foreground/75">
            {employeeData?.hasBankDetails
              ? "This policy holder has successfully linked their bank account."
              : employeeData && !employeeData.hasBankDetails
              ? "This policy holder has not linked their bank account yet."
              : loading
              ? "Checking bank details..."
              : "Waiting for employee number..."}
          </p>
        </CardContent>
      </div>
    </Card>
  );
}
