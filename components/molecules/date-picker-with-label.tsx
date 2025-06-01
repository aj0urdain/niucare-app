/**
 * File: components/molecules/date-picker-with-label.tsx
 * Description: Date picker component with label and error handling
 * Author: Aaron J. Girton - https://github.com/aj0urdain
 * Created: 2025
 *
 * This component provides a date picker with the following features:
 * - Label support
 * - Error message display
 * - Disabled state
 * - Form integration
 * - Responsive design
 */

import React from "react";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import {
  FormControl,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

/**
 * Props for the DatePickerWithLabel component
 */
interface DatePickerWithLabelProps {
  /** The label text for the date picker */
  label: string;
  /** The selected date value */
  value: Date | null | undefined;
  /** Callback function when date changes */
  onChange: (value: Date | null) => void;
  /** Optional error message to display */
  error?: string;
  /** Whether the date picker is disabled */
  disabled?: boolean;
}

/**
 * DatePickerWithLabel Component
 *
 * A date picker component that includes a label and error handling.
 *
 * Features:
 * - Label support
 * - Error message display
 * - Disabled state
 * - Form integration
 * - Responsive design
 * - Keyboard navigation
 * - Screen reader support
 *
 * @param props - Component props
 * @returns {JSX.Element} Date picker with label and error handling
 *
 * @example
 * ```tsx
 * <DatePickerWithLabel
 *   label="Birth Date"
 *   value={date}
 *   onChange={setDate}
 *   error="Please select a valid date"
 * />
 * ```
 */
export function DatePickerWithLabel({
  label,
  value,
  onChange,
  error,
  disabled = false,
}: DatePickerWithLabelProps) {
  return (
    <FormItem>
      <FormLabel>{label}</FormLabel>
      <FormControl>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className={cn(
                "w-full justify-start text-left font-normal",
                !value && "text-muted-foreground"
              )}
              disabled={disabled}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {value ? format(value, "PPP") : <span>Pick a date</span>}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="single"
              selected={value || undefined}
              onSelect={onChange}
              disabled={disabled}
              initialFocus
            />
          </PopoverContent>
        </Popover>
      </FormControl>
      {error && <FormMessage>{error}</FormMessage>}
    </FormItem>
  );
}
