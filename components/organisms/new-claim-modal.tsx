"use client";

import { useState } from "react";
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
import { useEmployeeStore } from "@/stores/employee-store";
import { useClaimFormStore } from "@/stores/new-claim-form-store";

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
  | "FETCHING_EMPLOYEE_INFORMATION"
  | "INVALID_EMPLOYEE"
  | "VALID_EMPLOYEE"
  | "FETCHING_BANK_DETAILS"
  | "MISSING_BANK_DETAILS"
  | "ADDING_BANK_DETAILS"
  | "BANK_DETAILS_ADDED"
  | "BANK_DETAILS_ERROR"
  | "EXISTING_BANK_DETAILS"
  | "SELECTING_CLAIM_TYPE"
  | "CHECKING_FOR_PREVIOUS_CLAIMS"
  | "PREVIOUS_CLAIM_WARNING"
  | "NO_PREVIOUS_CLAIM"
  | "CLAIM_ADD_VERIFY"
  | "SUBMITTING_CLAIM_ADD_VERIFY"
  | "CLAIM_ADD_VERIFY_SUCCESS"
  | "CLAIM_ADD_VERIFY_ERROR"
  | "CLAIM_ADD"
  | "SUBMITTING_CLAIM"
  | "ADD_CLAIM_SUCCESS"
  | "ADD_CLAIM_ERROR";

export function NewClaimModal() {
  const [open, setOpen] = useState(false);
  const [formState, setFormState] = useState<FormState | null>(
    "PENDING_EMPLOYEE_NUMBER"
  );

  const { clearEmployeeData, clearEmployeeNumber } = useEmployeeStore();
  const { resetForm } = useClaimFormStore();

  const handleSheetClose = () => {
    setOpen(false);
    resetForm();
    clearEmployeeData();
    clearEmployeeNumber();
  };
  //   // Instead of immediate state updates, use conditions to prevent loops
  //   if (formState === null) {
  //     console.log("Setting form state to PENDING_EMPLOYEE_NUMBER");
  //     setFormState("PENDING_EMPLOYEE_NUMBER");
  //     return; // Add return to prevent further execution
  //   }

  //   if (formState === "PENDING_EMPLOYEE_NUMBER" && employeeData?.name) {
  //     console.log("Setting form state to FETCHING_BANK_DETAILS");
  //     setFormState("FETCHING_BANK_DETAILS");
  //     return;
  //   }

  //   if (formState === "FETCHING_BANK_DETAILS") {

  //     if (hasBankDetails === null) {
  //       return;
  //     }

  //     if (hasBankDetails) {
  //       setFormState("EXISTING_BANK_DETAILS");
  //     } else {
  //       setFormState("MISSING_BANK_DETAILS");
  //     }
  //     return;
  //   }

  //   if (formState === "MISSING_BANK_DETAILS") {
  //     console.log("Setting form state to ADDING_BANK_DETAILS");
  //     setFormState("ADDING_BANK_DETAILS");
  //     return;
  //   }

  //   if (formState === "BANK_DETAILS_ADDED" || formState === "EXISTING_BANK_DETAILS") {
  //     console.log("Setting form state to SELECTING_CLAIM_TYPE");
  //     setFormState("SELECTING_CLAIM_TYPE");
  //     return;
  //   }

  //   if (formState === "SELECTING_CLAIM_TYPE" && previousClaimData !== undefined) {
  //     console.log("Setting form state to ", previousClaimData ? "PREVIOUS_CLAIM_WARNING" : "CLAIM_ADD_VERIFY");
  //     setFormState(previousClaimData ? "PREVIOUS_CLAIM_WARNING" : "CLAIM_ADD_VERIFY");
  //     return;
  //   }

  //   // the API call is made, and once we get a response from the API, we can be in either one of the following states:
  //   // "VALID_EMPLOYEE"
  //   // "INVALID_EMPLOYEE"

  //   // if the employee is valid, we are now "FETCHING_BANK_DETAILS"

  //   // the API call is made, and once we get a response from the API, we can be in either one of the following states:
  //   // "HAS_BANK_DETAILS"
  //   // "ADDING_BANK_DETAILS"

  //   // if the employee does not have bank details, we are now "ADDING_BANK_DETAILS"

  //   // the API call is made, and once we get a response from the API, we can be in either one of the following states:
  //   // "BANK_DETAILS_ADDED"
  //   // "BANK_DETAILS_ERROR"

  //   // if the bank details are added OR if the employee already has bank details, we are now "SELECTING_CLAIM_TYPE"

  //   // once the employee selects a valid claim type, we make a call to the API using verifyclaim

  //   // the API call is made, and once we get a response from the API, we can be in either one of the following states:
  //   // "PREVIOUS_CLAIM_WARNING"
  //   // "NO_PREVIOUS_CLAIM"

  //   // if the employee has a previous claim, we are now "PREVIOUS_CLAIM_WARNING"
  //   // the employee will be shown a warning that they have a previous claim, and they will be asked to proceed
  //   // if they click proceed, we are now "CLAIM_ADD_VERIFY"

  //   // if the employee does not have a previous claim, we are straight to "CLAIM_ADD_VERIFY"
  //   // the employee fills in the form, and then clicks next

  //   // once the employee clicks next, we are now "SUBMITTING_CLAIM_ADD_VERIFY"
  //   // the API call is made, and once we get a response from the API, we can be in either one of the following states:
  //   // "CLAIM_ADD_VERIFY_SUCCESS"
  //   // "CLAIM_ADD_VERIFY_ERROR"

  //   // if the claim has an error, we are now "CLAIM_ADD_VERIFY_ERROR"
  //   // the employee will be shown an error message, and the form will be reset

  //   // if the claim is added successfully, we are now "CLAIM_ADD"

  //   // we are now on the final step, where the employee is asked to review their claim before submission
  //   // once they click submit, we are now "SUBMITTING_CLAIM"

  //   // the API call is made, and once we get a response from the API, we can be in either one of the following states:
  //   // "ADD_CLAIM_SUCCESS"
  //   // "ADD_CLAIM_ERROR"

  //   // if the claim is added successfully, we are now "ADD_CLAIM_SUCCESS"
  //   // the employee will be shown a success message, and the form will be closed and reset

  //   // if the claim has an error, we are now "ADD_CLAIM_ERROR"
  //   // the employee will be shown an error message

  // }, [formState, employeeData, hasBankDetails, previousClaimData]);

  return (
    <Sheet open={open} onOpenChange={handleSheetClose}>
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
            formState={formState}
            setFormState={setFormState as (formState: string | null) => void}
          />
          <NewClaimEmbeddedForm
            formState={formState}
            setFormState={setFormState as (formState: string | null) => void}
            setOpen={setOpen}
          />
        </div>
      </SheetContent>
    </Sheet>
  );
}
