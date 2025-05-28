"use client";

import { useState } from "react";
import { confirmSignUp, signIn } from "aws-amplify/auth";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@/components/ui/input-otp";

interface VerifyEmailFormProps {
  email: string;
  password: string;
  onBack: () => void;
}

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
