/**
 * File: components/molecules/input-with-label.tsx
 * Description: Input component with label and error handling.
 * Author: Aaron J. Girton - https://github.com/aj0urdain
 * Created: 2025
 *
 * This component provides a form input with:
 * - Label
 * - Error handling
 * - Placeholder support
 * - Type customization
 * - Disabled state
 * - Form integration
 */

import React from "react";
import { Input } from "@/components/ui/input";
import {
  FormControl,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

/**
 * InputWithLabelProps interface
 *
 * Props for the InputWithLabel component.
 */
interface InputWithLabelProps {
  label: string;
  value: string | number | undefined;
  onChange: (value: string) => void;
  error?: string;
  placeholder?: string;
  type?: string;
  disabled?: boolean;
}

/**
 * InputWithLabel Component
 *
 * Provides a form input with label and error handling.
 *
 * Features:
 * - Label
 * - Error handling
 * - Placeholder support
 * - Type customization
 * - Disabled state
 * - Form integration
 *
 * @param label - Input label
 * @param value - Input value
 * @param onChange - Callback when value changes
 * @param error - Error message
 * @param placeholder - Placeholder text
 * @param type - Input type
 * @param disabled - Whether the input is disabled
 * @returns {JSX.Element} Input with label component
 *
 * @example
 * ```tsx
 * <InputWithLabel
 *   label="Email"
 *   value={email}
 *   onChange={setEmail}
 *   error={emailError}
 *   placeholder="Enter your email"
 *   type="email"
 * />
 * ```
 */
export function InputWithLabel({
  label,
  value,
  onChange,
  error,
  placeholder,
  type = "text",
  disabled = false,
}: InputWithLabelProps) {
  return (
    <FormItem>
      <FormLabel>{label}</FormLabel>
      <FormControl>
        <Input
          type={type}
          value={value || ""}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          disabled={disabled}
        />
      </FormControl>
      {error && <FormMessage>{error}</FormMessage>}
    </FormItem>
  );
}
