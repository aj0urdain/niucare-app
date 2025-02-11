"use client";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

import { useRouter } from "next/navigation";
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

const forgotPasswordSchema = z.object({
  email: z.string().email("Must be a valid email"),
});

export function ForgotPasswordForm() {
  const router = useRouter();
  const form = useForm({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: "",
    },
  });

  const onSubmit = async (data: z.infer<typeof forgotPasswordSchema>) => {
    console.log(data);
    // Handle form submission
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
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
                  Reset Your Password
                </motion.h1>
                <motion.p layout className="text-xs text-muted-foreground">
                  Forgot your password?
                </motion.p>
              </motion.div>

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

              <motion.div layout>
                <Button type="submit" className="w-full">
                  Send Reset Email
                </Button>
              </motion.div>

              <motion.div
                layout
                className="text-center text-xs text-muted-foreground"
              >
                Already have an account?{" "}
                <Button
                  variant="link"
                  className="px-1 font-normal text-xs"
                  onClick={() => router.push("/auth")}
                >
                  Sign In!
                </Button>
              </motion.div>
            </motion.div>
          </CardContent>
        </Card>
      </form>
    </Form>
  );
}
