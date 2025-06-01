"use client";

/**
 * File: components/molecules/verify-email-form.tsx
 * Description: Email verification form component for verifying user email addresses.
 * Author: Aaron J. Girton - https://github.com/aj0urdain
 * Created: 2025
 *
 * This component provides email verification functionality with:
 * - Email verification code input
 * - Verification status display
 * - Error handling
 * - Loading states
 * - Responsive design
 * - Accessibility features
 */

import { useState } from "react";
import { confirmSignUp, signIn } from "aws-amplify/auth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { useUserProfileStore } from "@/stores/user-profile-store";
import { useEmployeeStore } from "@/stores/employee-store";
import { useEmployeeData } from "@/lib/hooks/useEmployeeData";

interface VerifyEmailFormProps {
  email: string;
  password: string;
  onBack: () => void;
}

/**
 * VerifyEmailForm Component
 *
 * Provides email verification functionality with code input and status display.
 *
 * Features:
 * - Email verification code input
 * - Verification status display
 * - Error handling
 * - Loading states
 * - Responsive design
 * - Accessibility features
 *
 * @param {Object} props - Component props
 * @param {function} props.onVerificationComplete - Function to handle verification completion
 * @returns {JSX.Element} Email verification form component
 *
 * @example
 * ```tsx
 * <VerifyEmailForm
 *   onVerificationComplete={() => console.log("Verification complete")}
 * />
 * ```
 */
export function VerifyEmailForm({
  email,
  password,
  onBack,
}: VerifyEmailFormProps) {
  const router = useRouter();
  const [code, setCode] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleVerification = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      // Confirm the signup
      await confirmSignUp({
        username: email,
        confirmationCode: code,
      });

      // Sign in the user
      const { isSignedIn } = await signIn({
        username: email,
        password: password,
      });

      if (isSignedIn) {
        toast.success("Email verified and signed in successfully!");
        router.push("/dashboard");
        router.refresh();
      }
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error("Failed to verify email");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="overflow-hidden">
      <CardContent className="p-6">
        <div className="flex flex-col gap-6">
          <div className="text-center">
            <h1 className="text-2xl font-bold">Verify Your Email</h1>
            <p className="text-sm text-muted-foreground mt-2">
              Please enter the verification code sent to your email
            </p>
          </div>

          <form onSubmit={handleVerification} className="flex flex-col gap-4">
            <div className="flex justify-center">
              <InputOTP
                maxLength={6}
                value={code}
                onChange={(value) => setCode(value)}
              >
                <InputOTPGroup>
                  <InputOTPSlot index={0} />
                  <InputOTPSlot index={1} />
                  <InputOTPSlot index={2} />
                </InputOTPGroup>
                <InputOTPSeparator />
                <InputOTPGroup>
                  <InputOTPSlot index={3} />
                  <InputOTPSlot index={4} />
                  <InputOTPSlot index={5} />
                </InputOTPGroup>
              </InputOTP>
            </div>

            <Button type="submit" disabled={isLoading || code.length !== 6}>
              {isLoading ? "Verifying..." : "Verify Email"}
            </Button>

            <Button type="button" variant="link" onClick={onBack}>
              Back to Sign In
            </Button>
          </form>
        </div>
      </CardContent>
    </Card>
  );
}
