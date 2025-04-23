"use client";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useRouter, useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ComboBoxResponsive } from "@/components/molecules/combobox-responsive-phone";
import ReactCountryFlag from "react-country-flag";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { COUNTRIES } from "@/lib/constants/countries";
import { useEffect, useState, Suspense } from "react";
import { PasswordInput } from "@/components/atoms/password-input";
import { toast } from "sonner";
import { signIn, getCurrentUser, signUp } from "aws-amplify/auth";
import { useQueryClient } from "@tanstack/react-query";

type SignUpData = {
  email: string;
  password: string;
  familyName: string;
  givenName: string;
  phoneCode: string;
  phone: string;
  confirmPassword: string;
};

type SignInData = {
  email: string;
  password: string;
};

const signUpSchema = z
  .object({
    familyName: z.string().min(2, "Family name must be at least 2 characters"),
    givenName: z.string().min(2, "Given name must be at least 2 characters"),
    phoneCode: z.string(),
    phone: z.string().min(6, "Phone number must be at least 6 digits"),
    email: z.string().email("Invalid email address"),
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

const signInSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});

const LoginFormContent = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const isSignUp = searchParams.get("mode") === "sign-up";
  const queryClient = useQueryClient();
  const form = useForm<SignUpData | SignInData>({
    resolver: zodResolver(isSignUp ? signUpSchema : signInSchema),
    defaultValues: {
      familyName: "",
      givenName: "",
      phoneCode: "+675",
      phone: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const [showPassword, setShowPassword] = useState(false);

  // Reset form when switching between sign-in and sign-up modes
  useEffect(() => {
    form.reset({
      familyName: "",
      givenName: "",
      phoneCode: "+675",
      phone: "",
      email: "",
      password: "",
      confirmPassword: "",
    });

    // Clear all form errors
    Object.keys(form.formState.errors).forEach((key) => {
      form.clearErrors(key as keyof typeof form.formState.errors);
    });
  }, [isSignUp, form]);

  const onSubmit = async (data: SignUpData | SignInData) => {
    try {
      if (isSignUp) {
        const signUpData = data as SignUpData;
        await signUp({
          username: signUpData.email,
          password: signUpData.password,
          options: {
            userAttributes: {
              given_name: signUpData.givenName,
              family_name: signUpData.familyName,
              phone_number: `${signUpData.phoneCode}${signUpData.phone}`,
            },
          },
        });
        toast.success("Account created successfully", {
          description: "Please check your email for verification instructions",
        });
        router.push("/auth?mode=sign-in");
      } else {
        const signInData = data as SignInData;
        const { isSignedIn, nextStep } = await signIn({
          username: signInData.email,
          password: signInData.password,
        });

        if (!isSignedIn && nextStep.signInStep !== "DONE") {
          throw new Error(`Sign in failed: ${nextStep.signInStep}`);
        }

        if (isSignedIn) {
          toast.success("Signed in successfully");
          router.push("/dashboard");
          router.refresh();
        }
      }
    } catch (error: unknown) {
      console.error("Authentication error:", error);

      try {
        const { username, userId, signInDetails } = await getCurrentUser();
        console.log("Current user:", {
          username,
          userId,
          signInDetails,
        });
        toast.info("You are already signed in");
        queryClient.invalidateQueries({ queryKey: ["userProfile"] });
        return;
      } catch (getUserError) {
        console.error("Error getting current user:", getUserError);
        toast.error("Error verifying current user");
      }

      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error("An unexpected error occurred");
      }
    }
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className={cn("flex flex-col w-full")}
      >
        <Card className="overflow-hidden">
          <CardContent className="grid p-0">
            <div className="p-6">
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
                    {isSignUp ? "Create An Account" : "Welcome Back"}
                  </motion.h1>
                  <motion.p layout className="text-sm text-muted-foreground">
                    {isSignUp
                      ? "Sign up to get started"
                      : "Login to your account"}
                  </motion.p>
                </motion.div>

                <AnimatePresence mode="popLayout">
                  {isSignUp && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{
                        duration: 0.3,
                        delay: 0.1,
                        height: {
                          duration: 0.4,
                        },
                        opacity: {
                          duration: 0.3,
                        },
                      }}
                    >
                      <div className="flex flex-col gap-6">
                        <div className="grid grid-cols-2 gap-4">
                          <FormField
                            control={form.control}
                            name="givenName"
                            render={({ field }) => (
                              <FormItem className={cn("space-y-1")}>
                                <FormLabel
                                  className={cn(
                                    "text-xs font-normal opacity-60 ml-1"
                                  )}
                                >
                                  Given (First) Name
                                </FormLabel>
                                <FormControl>
                                  <Input {...field} placeholder="John" />
                                </FormControl>
                                <FormMessage className={cn("text-xs ml-1")} />
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={form.control}
                            name="familyName"
                            render={({ field }) => (
                              <FormItem className={cn("space-y-1")}>
                                <FormLabel
                                  className={cn(
                                    "text-xs font-normal opacity-60 ml-1"
                                  )}
                                >
                                  Family (Last) Name
                                </FormLabel>
                                <FormControl>
                                  <Input {...field} placeholder="Smith" />
                                </FormControl>
                                <FormMessage className={cn("text-xs ml-1")} />
                              </FormItem>
                            )}
                          />
                        </div>

                        <div className="grid gap-2">
                          <Label
                            className={cn(
                              "text-xs font-normal opacity-60 ml-1"
                            )}
                          >
                            Phone Number
                          </Label>
                          <div className="flex gap-2">
                            <FormField
                              control={form.control}
                              name="phoneCode"
                              render={({ field }) => (
                                <ComboBoxResponsive
                                  options={COUNTRIES.map((country) => ({
                                    id: country.label,
                                    value: country.value,
                                    label: country.code,
                                    icon: (
                                      <ReactCountryFlag
                                        countryCode={country.code}
                                        svg
                                        className="h-3 w-auto mt-0.5"
                                      />
                                    ),
                                    displayLabel: (
                                      <div
                                        className="flex items-start gap-2"
                                        key={`${country.label}-${country.value}-${country.code}`}
                                      >
                                        <ReactCountryFlag
                                          countryCode={country.code}
                                          svg
                                          className="h-3 w-auto mt-0.5"
                                        />
                                        <div className="flex flex-col gap-0.5">
                                          <div>
                                            <h3 className="text-sm font-light">
                                              {country.label}
                                            </h3>
                                          </div>
                                          <div className="text-muted-foreground">
                                            <p className="text-xs font-light">
                                              {country.code} ({country.value})
                                            </p>
                                          </div>
                                        </div>
                                      </div>
                                    ),
                                    searchValue: `${country.label} ${country.code} ${country.value}`,
                                  }))}
                                  value={field.value}
                                  onValueChange={field.onChange}
                                  placeholder="Code"
                                  searchPlaceholder="Search.."
                                  className="w-full"
                                  triggerClassName="w-full"
                                />
                              )}
                            />
                            <FormField
                              control={form.control}
                              name="phone"
                              render={({ field }) => (
                                <FormItem className={cn("flex-1 space-y-1")}>
                                  <FormControl>
                                    <Input
                                      {...field}
                                      type="tel"
                                      placeholder="234 567 890"
                                    />
                                  </FormControl>
                                  <FormMessage className={cn("text-xs ml-1")} />
                                </FormItem>
                              )}
                            />
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem className={cn("space-y-1")}>
                      <FormLabel
                        className={cn("text-xs font-normal opacity-60 ml-1")}
                      >
                        Email
                      </FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          type="email"
                          placeholder="m@example.com"
                        />
                      </FormControl>
                      <FormMessage className={cn("text-xs ml-1")} />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem className={cn("space-y-1")}>
                      <div className="flex items-center justify-between">
                        <FormLabel
                          className={cn("text-xs font-normal opacity-60 ml-1")}
                        >
                          Password
                        </FormLabel>
                        {!isSignUp && (
                          <Button
                            variant="link"
                            className="px-0 font-normal text-xs"
                            onClick={() => router.push("/forgot-password")}
                          >
                            Forgot password?
                          </Button>
                        )}
                      </div>
                      <FormControl>
                        <PasswordInput
                          {...field}
                          showPassword={showPassword}
                          onVisibilityChange={() =>
                            setShowPassword(!showPassword)
                          }
                        />
                      </FormControl>
                      <FormMessage className={cn("text-xs ml-1")} />
                    </FormItem>
                  )}
                />

                <AnimatePresence mode="popLayout">
                  {isSignUp && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{
                        duration: 0.3,
                        delay: 0.1,
                        height: {
                          duration: 0.4,
                        },
                        opacity: {
                          duration: 0.3,
                        },
                      }}
                    >
                      <FormField
                        control={form.control}
                        name="confirmPassword"
                        render={({ field }) => (
                          <FormItem className={cn("space-y-1")}>
                            <FormLabel
                              className={cn(
                                "text-xs font-normal opacity-60 ml-1"
                              )}
                            >
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
                            <FormMessage className={cn("text-xs ml-1")} />
                          </FormItem>
                        )}
                      />
                    </motion.div>
                  )}
                </AnimatePresence>

                <motion.div layout>
                  <Button type="submit" className="w-full">
                    {isSignUp ? "Create Account" : "Sign In"}
                  </Button>
                </motion.div>

                <motion.div
                  layout
                  className="text-center text-xs text-muted-foreground"
                >
                  {isSignUp
                    ? "Already have an account? "
                    : "Don't have an account? "}
                  <Button
                    variant="link"
                    className="px-1 font-normal text-xs"
                    onClick={() => {
                      const mode = isSignUp ? "sign-in" : "sign-up";
                      router.push(`?mode=${mode}`, { scroll: false });
                    }}
                  >
                    {isSignUp ? "Sign In!" : "Sign Up!"}
                  </Button>
                </motion.div>
              </motion.div>
            </div>
            {/* <div className="relative hidden md:flex md:flex-col gap-4 dark:bg-[#810101]/50 bg-[#810101] items-center justify-center">
              <Image
                src="/images/psna-logo.avif"
                alt="Logo"
                width={600}
                height={600}
                className="w-32 h-auto object-cover"
              />
              <div>
                <h1 className="text-white text-2xl text-center font-bold mt-1.5">
                  Public Service Niucare Association
                </h1>
              </div>
            </div> */}
          </CardContent>
        </Card>
      </form>
    </Form>
  );
};

const LoginForm = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <LoginFormContent />
    </Suspense>
  );
};

export default LoginForm;
