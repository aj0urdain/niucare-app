"use client";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useRouter, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { PasswordInput } from "@/components/atoms/password-input";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { useState, useEffect, useRef } from "react";
import { confirmResetPassword } from "aws-amplify/auth";
import { toast } from "sonner";

/**
 * Zod schema for reset password form validation
 * Requires a 6-digit code and a new password with confirmation
 */
const resetPasswordSchema = z
  .object({
    code: z.string().length(6, "Code must be 6 digits"),
    password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
      .regex(/[a-z]/, "Password must contain at least one lowercase letter")
      .regex(/[0-9]/, "Password must contain at least one number")
      .regex(
        /[^A-Za-z0-9]/,
        "Password must contain at least one special character"
      ),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

/**
 * ResetPasswordForm Component
 *
 * Renders a form for users to reset their password using a code sent to their email.
 *
 * @returns {JSX.Element} The rendered reset password form
 *
 * @example
 * ```tsx
 * <ResetPasswordForm />
 * ```
 */
export function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get("email");
  const [showPassword, setShowPassword] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const otpRef = useRef<HTMLInputElement>(null);

  const resetForm = useForm({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      code: "",
      password: "",
      confirmPassword: "",
    },
  });

  const onResetSubmit = async (data: z.infer<typeof resetPasswordSchema>) => {
    if (!email) {
      toast.error("Missing email for password reset");
      return;
    }
    try {
      await confirmResetPassword({
        username: email,
        confirmationCode: data.code,
        newPassword: data.password,
      });
      toast.success("Password reset successful! You can now sign in.");
      router.push("/auth?reset=success");
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to reset password";
      toast.error(errorMessage);
    }
  };

  const handleResendCode = async () => {
    setIsResending(true);
    // Resend code logic here (use email from URL param)
    setIsResending(false);
  };

  useEffect(() => {
    resetForm.reset({
      code: "",
      password: "",
      confirmPassword: "",
    });
    setTimeout(() => {
      // Try to focus the first OTP input via ref
      if (otpRef.current) {
        otpRef.current.focus();
      } else {
        // Fallback: focus the first input in the OTP group
        const el = document.querySelector(
          '[data-slot="input-otp-slot"] input'
        ) as HTMLInputElement | null;
        el?.focus();
      }
    }, 0);
  }, [resetForm]);

  if (!email) {
    router.push("/forgot-password");
    return null;
  }

  return (
    <Form {...resetForm}>
      <form
        onSubmit={resetForm.handleSubmit(onResetSubmit)}
        className={cn("flex flex-col w-full")}
      >
        <Card className="overflow-hidden">
          <CardContent className="p-6 md:p-8">
            <motion.div
              className="flex flex-col gap-6"
              layout
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{
                layout: { duration: 0.3 },
                opacity: { duration: 0.2 },
              }}
            >
              <motion.div
                layout
                className="flex flex-col items-center text-center"
              >
                <motion.h1 layout className="text-2xl font-bold">
                  Reset Password
                </motion.h1>
                <motion.p layout className="text-xs text-muted-foreground">
                  Enter the 6-digit code sent to {email}
                </motion.p>
              </motion.div>

              <FormField
                control={resetForm.control}
                name="code"
                render={({ field }) => (
                  <FormItem className="space-y-0">
                    <FormLabel className="text-xs font-normal opacity-60 ml-1">
                      Code
                    </FormLabel>
                    <FormControl>
                      <div className="flex">
                        <InputOTP
                          maxLength={6}
                          value={field.value}
                          onChange={field.onChange}
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
                    </FormControl>
                    <FormMessage className="text-xs ml-1" />
                  </FormItem>
                )}
              />

              <FormField
                control={resetForm.control}
                name="password"
                render={({ field }) => (
                  <FormItem className="space-y-0">
                    <FormLabel className="text-xs font-normal opacity-60 ml-1">
                      New Password
                    </FormLabel>
                    <FormControl>
                      <PasswordInput
                        {...field}
                        showPassword={showPassword}
                        onVisibilityChange={() =>
                          setShowPassword(!showPassword)
                        }
                      />
                    </FormControl>
                    <FormMessage className="text-xs ml-1" />
                  </FormItem>
                )}
              />

              <FormField
                control={resetForm.control}
                name="confirmPassword"
                render={({ field }) => (
                  <FormItem className="space-y-0">
                    <FormLabel className="text-xs font-normal opacity-60 ml-1">
                      Confirm Password
                    </FormLabel>
                    <FormControl>
                      <PasswordInput
                        {...field}
                        showPassword={showPassword}
                        onVisibilityChange={() =>
                          setShowPassword(!showPassword)
                        }
                      />
                    </FormControl>
                    <FormMessage className="text-xs ml-1" />
                  </FormItem>
                )}
              />

              <Button type="submit" className="w-full">
                Submit
              </Button>

              <Button
                type="button"
                variant="link"
                className="w-full"
                onClick={handleResendCode}
                disabled={isResending}
              >
                {isResending ? "Resending..." : "Resend Code"}
              </Button>
            </motion.div>
          </CardContent>
        </Card>
      </form>
    </Form>
  );
}
