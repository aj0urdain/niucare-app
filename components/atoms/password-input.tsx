/**
 * File: components/atoms/password-input.tsx
 * Description: Secure password input component with visibility toggle
 * Author: Aaron J. Girton - https://github.com/aj0urdain
 * Created: 2025
 *
 * This component provides a secure password input field with a visibility toggle feature.
 * It follows security best practices and accessibility guidelines while maintaining
 * a consistent design with the application's UI system.
 */

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Eye, EyeOff } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import * as React from "react";

/**
 * Props interface for the PasswordInput component
 * @extends React.InputHTMLAttributes<HTMLInputElement>
 * @property {string} [className] - Optional CSS classes for the input element
 * @property {boolean} showPassword - Boolean indicating if password is visible
 * @property {() => void} onVisibilityChange - Callback function to toggle password visibility
 *
 * @example
 * ```tsx
 * const [showPassword, setShowPassword] = useState(false);
 *
 * <PasswordInput
 *   id="password"
 *   showPassword={showPassword}
 *   onVisibilityChange={() => setShowPassword(!showPassword)}
 *   placeholder="Enter your password"
 * />
 * ```
 */
interface PasswordInputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  className?: string;
  showPassword: boolean;
  onVisibilityChange: () => void;
}

/**
 * PasswordInput Component
 *
 * A secure password input component with visibility toggle functionality.
 * Features:
 * - Password visibility toggle with icon
 * - Tooltip for accessibility
 * - Screen reader support
 * - Customizable styling
 * - Secure input handling
 * - Responsive design
 * - Keyboard navigation support
 *
 * Security Considerations:
 * - Default type is "password" for secure input
 * - Visibility toggle is optional and controlled by parent
 * - No password storage or validation (handled by parent)
 *
 * Accessibility Features:
 * - ARIA labels for screen readers
 * - Keyboard navigation support
 * - Tooltip for additional context
 * - Clear visual feedback
 *
 * @param props - Component props
 * @param ref - Forwarded ref for the input element
 * @returns {JSX.Element} Password input field with visibility toggle
 *
 * @example
 * ```tsx
 * // Basic usage with state management
 * const [showPassword, setShowPassword] = useState(false);
 *
 * <PasswordInput
 *   id="password"
 *   showPassword={showPassword}
 *   onVisibilityChange={() => setShowPassword(!showPassword)}
 *   placeholder="Enter your password"
 * />
 *
 * // With custom styling
 * <PasswordInput
 *   id="confirm-password"
 *   showPassword={showPassword}
 *   onVisibilityChange={() => setShowPassword(!showPassword)}
 *   className="w-full max-w-md"
 *   placeholder="Confirm your password"
 * />
 * ```
 */
export const PasswordInput = React.forwardRef<
  HTMLInputElement,
  PasswordInputProps
>(({ className, showPassword, onVisibilityChange, ...props }, ref) => {
  return (
    <div className="relative">
      <Input
        type={showPassword ? "text" : "password"}
        className={cn("pr-10", className)}
        ref={ref}
        {...props}
      />
      <TooltipProvider>
        <Tooltip delayDuration={100}>
          <TooltipTrigger asChild>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="absolute right-1 top-0 h-full px-4 py-2 hover:bg-transparent"
              onClick={onVisibilityChange}
            >
              {!showPassword ? (
                <EyeOff className="h-4 w-4 text-muted-foreground/70" />
              ) : (
                <Eye className="h-4 w-4 text-muted-foreground/70" />
              )}
              <span className="sr-only">
                {!showPassword ? "Show password" : "Hide password"}
              </span>
            </Button>
          </TooltipTrigger>
          <TooltipContent side="left" className="text-xs">
            {!showPassword ? "Show password" : "Hide password"}
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  );
});

PasswordInput.displayName = "PasswordInput";
