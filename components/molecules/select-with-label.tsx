/**
 * File: components/molecules/select-with-label.tsx
 * Description: Select input component with label for form inputs.
 * Author: Aaron J. Girton - https://github.com/aj0urdain
 * Created: 2025
 *
 * This component provides select input functionality with:
 * - Label support
 * - Error handling
 * - Disabled state
 * - Placeholder support
 * - Responsive design
 * - Accessibility features
 */

import React from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  FormControl,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Label } from "@/components/ui/label";

interface Option {
  value: string;
  label: string;
}

interface SelectWithLabelProps {
  label: string;
  value: string | undefined;
  onChange: (value: string) => void;
  options?: Option[];
  error?: string;
  placeholder?: string;
  disabled?: boolean;
  children?: React.ReactNode;
}

/**
 * SelectWithLabel Component
 *
 * Provides a select input with label for form inputs.
 *
 * Features:
 * - Label support
 * - Error handling
 * - Disabled state
 * - Placeholder support
 * - Responsive design
 * - Accessibility features
 *
 * @param {Object} props - Component props
 * @param {string} props.label - Label text for the select input
 * @param {string} props.value - Current value of the select input
 * @param {function} props.onChange - Function to handle value changes
 * @param {string} [props.error] - Error message to display
 * @param {string} [props.placeholder] - Placeholder text
 * @param {boolean} [props.disabled] - Whether the select is disabled
 * @param {Array<{value: string, label: string}>} props.options - Options for the select input
 * @returns {JSX.Element} Select input component with label
 *
 * @example
 * ```tsx
 * <SelectWithLabel
 *   label="Select an option"
 *   value="option1"
 *   onChange={(value) => console.log(value)}
 *   options={[
 *     { value: "option1", label: "Option 1" },
 *     { value: "option2", label: "Option 2" }
 *   ]}
 * />
 * ```
 */
export function SelectWithLabel({
  label,
  value,
  onChange,
  options,
  error,
  placeholder = "Select an option",
  disabled = false,
  children,
}: SelectWithLabelProps) {
  return (
    <FormItem>
      <FormLabel>{label}</FormLabel>
      <FormControl>
        <Select value={value} onValueChange={onChange} disabled={disabled}>
          <SelectTrigger>
            <SelectValue placeholder={placeholder} />
          </SelectTrigger>
          <SelectContent>
            {children ||
              options?.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
          </SelectContent>
        </Select>
      </FormControl>
      {error && <FormMessage>{error}</FormMessage>}
    </FormItem>
  );
}
