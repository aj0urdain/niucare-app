import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { forwardRef } from "react";

interface InputWithLabelProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  labelClassName?: string;
  containerClassName?: string;
  icon?: React.ReactNode;
}

export const InputWithLabel = forwardRef<HTMLInputElement, InputWithLabelProps>(
  (
    {
      label,
      id,
      labelClassName = "text-xs font-semibold text-muted-foreground/75 flex items-center gap-1",
      containerClassName,
      className = "",
      icon,
      ...props
    },
    ref
  ) => {
    return (
      <div
        className={cn(
          "grid w-full min-w-40 items-center gap-1.5",
          containerClassName
        )}
      >
        <div className="flex items-center gap-1.5">
          <Label htmlFor={id} className={labelClassName}>
            {icon}
            {label}
          </Label>
        </div>
        <Input
          id={id}
          className={cn(className, "text-xs max-w-40")}
          ref={ref}
          {...props}
        />
      </div>
    );
  }
);

InputWithLabel.displayName = "InputWithLabel";
