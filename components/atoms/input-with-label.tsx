/**
 * File: components/atoms/input-with-label.tsx
 * Description: Reusable input component with label and optional icon
 * Author: Aaron J. Girton - https://github.com/aj0urdain
 * Created: 2025
 *
 * This component provides a standardized input field with a label and optional icon,
 * following the design system's styling guidelines. It's designed to be used across
 * the application for consistent form inputs.
 */

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { forwardRef } from "react";

/**
 * Props interface for the InputWithLabel component
 * @extends React.InputHTMLAttributes<HTMLInputElement>
 * @property {string} label - Text label for the input field
 * @property {string} [labelClassName] - Optional CSS classes for the label element
 * @property {string} [containerClassName] - Optional CSS classes for the container div
 * @property {React.ReactNode} [icon] - Optional icon to display next to the label
 *
 * @example
 * ```tsx
 * <InputWithLabel
 *   label="Username"
 *   id="username"
 *   icon={<UserIcon className="h-4 w-4" />}
 *   placeholder="Enter your username"
 * />
 * ```
 */
interface InputWithLabelProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  labelClassName?: string;
  containerClassName?: string;
  icon?: React.ReactNode;
}

/**
 * InputWithLabel Component
 *
 * A reusable input component that combines a label and input field with optional icon.
 * Features:
 * - Forwarded ref support for form integration
 * - Customizable styling for label and container
 * - Optional icon support for visual context
 * - Consistent text sizing and spacing
 * - Responsive design with min-width constraints
 * - Accessible label-input association
 *
 * @param props - Component props
 * @param ref - Forwarded ref for the input element
 * @returns {JSX.Element} Input field with label and optional icon
 *
 * @example
 * ```tsx
 * // Basic usage
 * <InputWithLabel label="Email" id="email" type="email" />
 *
 * // With custom styling
 * <InputWithLabel
 *   label="Password"
 *   id="password"
 *   type="password"
 *   labelClassName="text-sm font-bold"
 *   containerClassName="w-full"
 * />
 * ```
 */
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
