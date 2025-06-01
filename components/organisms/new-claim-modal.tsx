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

/**
 * Interface for new claim form data
 * @property employeeNumber - Employee number
 * @property claimType - Type of claim
 * @property amount - Claim amount
 * @property description - Claim description
 * @property files - Array of uploaded files
 */
export interface FormData {
  employeeNumber: string;
  claimType: string;
  amount: number;
  description: string;
  files: Array<{ id: string; name: string; type: string; size: number }>;
}

/**
 * Type for form state in the new claim modal
 */
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

/**
 * NewClaimModal Component
 *
 * Modal dialog for submitting a new claim. Guides the user through employee lookup, claim details, and file upload.
 *
 * @returns {JSX.Element} The rendered new claim modal
 *
 * @example
 * ```tsx
 * <NewClaimModal />
 * ```
 */
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

  return (
    <Sheet open={open} onOpenChange={handleSheetClose}>
      <Button onClick={() => setOpen(true)} variant="default" size="lg">
        <FilePlus className="w-5 h-5" />
        <span className="font-semibold">New Claim</span>
      </Button>
      <SheetContent
        side="top"
        className="max-w-xl mx-auto min-h-fit max-h-[90vh] rounded-b-xl flex flex-col h-full p-4"
      >
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2">
            <FilePlus className="w-4 h-4" />
            New Claim
          </SheetTitle>
          <SheetDescription>
            Please follow the prompts below to submit a new claim.
          </SheetDescription>
        </SheetHeader>
        <div className="flex flex-col gap-4 h-full">
          <NewClaimEmployeeCard />
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
