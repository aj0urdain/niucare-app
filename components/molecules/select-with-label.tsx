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
