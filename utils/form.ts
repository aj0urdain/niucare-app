import { UseFormReturn } from "react-hook-form";
import { FormStep } from "@/components/molecules/form-nav";

export const isSubsectionValid = (
  form: UseFormReturn<any>,
  fields: string[],
  formState: any
): { isValid: boolean; invalidCount: number; isStarted: boolean } => {
  let invalidCount = 0;
  let filledFieldCount = 0;

  for (const field of fields) {
    const value = form.getValues(field);
    const error = formState.errors[field];

    if (value) {
      filledFieldCount++;
    }

    if (!value || error) {
      invalidCount++;
    }

    if (field.includes(".")) {
      const [parent, child] = field.split(".");
      const parentValue = form.getValues(parent);
      if (parentValue?.[child]) {
        filledFieldCount++;
      }
      if (!parentValue?.[child]) {
        invalidCount++;
      }
    }
  }

  return {
    isValid: invalidCount === 0,
    invalidCount,
    isStarted: filledFieldCount > 0,
  };
};

export const calculateTotalProgress = (
  form: UseFormReturn<any>,
  formState: any,
  steps: FormStep[]
): number => {
  let totalFields = 0;
  let completedFields = 0;

  steps.forEach((step) => {
    step.subsections.forEach((sub) => {
      const { invalidCount, isValid } = isSubsectionValid(
        form,
        sub.fields,
        formState
      );
      totalFields += sub.fields.length;
      if (isValid) {
        completedFields += sub.fields.length;
      } else {
        completedFields += sub.fields.length - invalidCount;
      }
    });
  });

  return Math.round((completedFields / totalFields) * 100);
};
