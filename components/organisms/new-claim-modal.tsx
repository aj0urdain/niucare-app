"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { FilePlus } from "lucide-react";

import { NewClaimEmployeeCard } from "@/components/molecules/new-claim-employee-card";
import { NewClaimEmbeddedForm } from "@/components/molecules/new-claim-embedded-form";
import { PolicyHolder } from "@/lib/hooks/usePolicyHolder";

export interface FormData {
  employeeNumber: string;
  claimType: string;
  amount: number;
  description: string;
  files: Array<{ id: string; name: string; type: string; size: number }>;
}

// Define form states to track the process
export type FormState =
  | "PENDING_EMPLOYEE_NUMBER"
  | "VALIDATING_EMPLOYEE"
  | "INVALID_EMPLOYEE"
  | "VALID_EMPLOYEE"
  | "MISSING_BANK_DETAILS"
  | "HAS_BANK_DETAILS"
  | "SELECTING_CLAIM_TYPE"
  | "PREVIOUS_CLAIM_WARNING"
  | "FILLING_FORM"
  | "VERIFICATION"
  | "SUBMITTING"
  | "SUBMISSION_ERROR"
  | "SUBMISSION_SUCCESS";

const initialFormData: FormData = {
  employeeNumber: "",
  claimType: "",
  amount: 0,
  description: "",
  files: [],
};

export function NewClaimModal() {
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState<FormData>(initialFormData);

  const [employeeData, setEmployeeData] = useState<PolicyHolder | null>(null);
  const [employeeNumber, setEmployeeNumber] = useState("");

  const [hasBankDetails, setHasBankDetails] = useState(false);

  const handleClose = () => {
    setOpen(false);
    setFormData(initialFormData);
    setEmployeeData(null);
    setEmployeeNumber("");
    setHasBankDetails(false);
  };

  useEffect(() => {
    console.log(`employeeData:`);
    console.log(employeeData);
    console.log(`hasBankDetails:`);
    console.log(hasBankDetails);
    return () => {
      console.log("unmounting");
    };
  }, [employeeData, hasBankDetails]);

  return (
    <Sheet open={open} onOpenChange={handleClose}>
      <Button
        onClick={() => setOpen(true)}
        className="font-semibold"
        variant="default"
      >
        <FilePlus className="w-4 h-4" />
        New Claim
      </Button>
      <SheetContent
        side="top"
        className="max-w-xl mx-auto min-h-[90vh] max-h-[90vh] rounded-b-xl flex flex-col h-full"
      >
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2">
            <FilePlus className="w-4 h-4" />
            New Claim
          </SheetTitle>
          <SheetDescription>
            Please fill in the details below to submit a new claim.
          </SheetDescription>
        </SheetHeader>
        <div className="flex flex-col gap-4 h-full">
          <NewClaimEmployeeCard
            employeeNumber={employeeNumber}
            setEmployeeNumber={setEmployeeNumber}
            employeeData={employeeData}
            setEmployeeData={setEmployeeData}
            hasBankDetails={hasBankDetails}
            setHasBankDetails={setHasBankDetails}
          />

          <NewClaimEmbeddedForm
            formData={formData}
            setFormData={setFormData}
            employeeData={employeeData}
            employeeNumber={employeeNumber}
            hasBankDetails={hasBankDetails}
          />
        </div>
      </SheetContent>
    </Sheet>
  );
}
