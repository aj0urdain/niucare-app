import { cn } from "@/lib/utils";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { calculateTotalProgress } from "@/utils/form";
import { UseFormReturn } from "react-hook-form";

export type FormStep = {
  title: string;
  icon: React.ElementType;
  description: string;
  subsections: {
    title: string;
    fields: string[];
  }[];
};

interface FormNavProps {
  steps: FormStep[];
  currentStep: number;
  form: UseFormReturn<any>;
  title: string;
  subtitle: string;
  icon: React.ElementType;
  onStepChange: (step: number) => void;
}

export function FormNav({
  steps,
  currentStep,
  form,
  title,
  subtitle,
  icon: Icon,
  onStepChange,
}: FormNavProps) {
  return (
    <div className="w-1/4 min-w-[250px]">
      <div className="sticky top-4">
        <div className="rounded-lg border bg-muted text-card-foreground shadow-sm animate-slide-left-fade-in">
          <div className="p-4 flex flex-col gap-4">
            <div className="flex flex-col gap-1">
              <h3 className="font-bold text-xl">{title}</h3>
              <div className="flex items-center gap-1">
                <Icon className="w-3 h-3 text-muted-foreground" />
                <h4 className="text-sm font-medium">{subtitle}</h4>
              </div>
            </div>

            <Separator className="my-1" />

            <div className="space-y-2">
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>Progress</span>
                <span>
                  {calculateTotalProgress(form, form.formState, steps)}%
                </span>
              </div>
              <Progress
                value={calculateTotalProgress(form, form.formState, steps)}
                className="h-2 transition-all duration-300"
              />
            </div>

            <p className="text-xs text-muted-foreground">
              Please complete all of the fields in the form before verification
              and submission.
            </p>

            <Separator className="my-1" />

            <div className="space-y-0">
              {steps.map((s, i) => (
                <button
                  key={s.title}
                  onClick={() => onStepChange(i + 1)}
                  className={cn(
                    "flex w-full items-start gap-3 rounded-md p-2 text-sm transition-colors",
                    currentStep === i + 1
                      ? "bg-primary text-primary-foreground"
                      : "hover:bg-muted",
                    currentStep > i + 1 && "text-muted-foreground"
                  )}
                >
                  {/* Step content - same as original */}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
