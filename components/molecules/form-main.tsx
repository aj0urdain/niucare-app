/**
 * File: components/molecules/form-main.tsx
 * Description: Main form component with step navigation and progress tracking
 * Author: Aaron J. Girton - https://github.com/aj0urdain
 * Created: 2025
 *
 * This component provides a multi-step form with the following features:
 * - Step navigation
 * - Progress tracking
 * - Form validation
 * - Responsive design
 * - Scrollable content
 */

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ChevronsLeft, ChevronsRight } from "lucide-react";
import { Form } from "@/components/ui/form";
import { UseFormReturn } from "react-hook-form";
import { FormStep } from "./form-nav";

/**
 * Props for the FormMain component
 */
interface FormMainProps {
  /** Array of form steps */
  steps: FormStep[];
  /** Current step index (1-based) */
  currentStep: number;
  /** Form instance from react-hook-form */
  form: UseFormReturn<any>;
  /** Callback function for previous step */
  onPrevStep: () => void;
  /** Callback function for next step */
  onNextStep: () => void;
  /** Callback function for form submission */
  onSubmit: (data: any) => void;
  /** Function to render the current step content */
  renderStep: () => React.ReactNode;
}

/**
 * FormMain Component
 *
 * A multi-step form component that handles step navigation and form submission.
 *
 * Features:
 * - Step navigation (previous/next)
 * - Progress tracking
 * - Form validation
 * - Responsive design
 * - Scrollable content
 * - Keyboard navigation
 * - Screen reader support
 *
 * @param props - Component props
 * @returns {JSX.Element} Multi-step form with navigation
 *
 * @example
 * ```tsx
 * <FormMain
 *   steps={steps}
 *   currentStep={1}
 *   form={form}
 *   onPrevStep={handlePrevStep}
 *   onNextStep={handleNextStep}
 *   onSubmit={handleSubmit}
 *   renderStep={renderCurrentStep}
 * />
 * ```
 */
export function FormMain({
  steps,
  currentStep,
  form,
  onPrevStep,
  onNextStep,
  onSubmit,
  renderStep,
}: FormMainProps) {
  return (
    <div className="flex flex-col w-full">
      <Card className="flex flex-col animate-slide-right-fade-in">
        <CardContent className="p-6 flex flex-col h-full">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold">
              {steps[currentStep - 1].title}
            </h1>
            <div className="flex justify-between items-center gap-2">
              {currentStep > 1 && (
                <Button
                  type="button"
                  onClick={onPrevStep}
                  variant="ghost"
                  className="gap-1"
                >
                  <ChevronsLeft className="w-3 h-3" />
                  {steps[currentStep - 2].title}
                </Button>
              )}
              <div className="ml-auto">
                {currentStep < steps.length ? (
                  <Button type="button" variant="default" onClick={onNextStep}>
                    <ChevronsRight className="w-3 h-3" />
                    {steps[currentStep].title}
                  </Button>
                ) : (
                  <Button type="submit" onClick={form.handleSubmit(onSubmit)}>
                    Submit
                  </Button>
                )}
              </div>
            </div>
          </div>
          <Separator className="my-6" />

          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              key={currentStep}
              className="flex flex-col animate-slide-left-fade-in"
            >
              <ScrollArea className="h-full max-h-[calc(100vh-260px)] w-full">
                {renderStep()}
              </ScrollArea>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
