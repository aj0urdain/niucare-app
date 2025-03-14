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
import { Step1 } from "./step-1";
import { Step2 } from "./step-2";
import { Step3 } from "./step-3";

interface FormData {
  employeeNumber: string;
  claimType: string;
  amount: string;
}

const initialFormData: FormData = {
  employeeNumber: "",
  claimType: "",
  amount: "",
};

export function NewClaimModal() {
  const [open, setOpen] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const totalSteps = 3;

  const handleFormUpdate = (fieldName: keyof FormData, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [fieldName]: value,
    }));
  };

  const handleNext = () => {
    if (currentStep < totalSteps) {
      setCurrentStep((prev) => prev + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  const handleClose = () => {
    setOpen(false);
    setFormData(initialFormData);
    setCurrentStep(1);
  };

  const getStepTitle = () => {
    switch (currentStep) {
      case 1:
        return "Step 1: Basic Details";
      case 2:
        return "Step 2: Additional Info";
      case 3:
        return "Step 3: Review";
      default:
        return "New Claim";
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <Step1 formData={formData} onUpdateFormData={handleFormUpdate} />
        );
      case 2:
        return <Step2 />;
      case 3:
        return <Step3 />;
      default:
        return null;
    }
  };

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
        className="max-w-xl mx-auto min-h-[90vh] rounded-b-xl flex flex-col"
      >
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2">
            <FilePlus className="w-4 h-4" />
            {getStepTitle()}
          </SheetTitle>
          <SheetDescription>
            Step {currentStep} of {totalSteps}
          </SheetDescription>
        </SheetHeader>

        {/* Step content */}
        <div className="py-4 flex-1">{renderStepContent()}</div>

        {/* Navigation buttons */}
        <div className="flex justify-end gap-2 mt-6">
          {currentStep > 1 && (
            <Button variant="outline" onClick={handleBack}>
              Back
            </Button>
          )}
          <Button
            onClick={currentStep === totalSteps ? handleClose : handleNext}
          >
            {currentStep === totalSteps ? "Finish" : "Next"}
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}
