/**
 * File: app/(auth)/layout.tsx
 * Description: Authentication layout component that provides a consistent wrapper for all auth-related pages
 * Author: Aaron J. Girton - https://github.com/aj0urdain
 * Created: 2025
 */

import { ThemeSwitcher } from "@/components/molecules/theme-switcher";
import { Separator } from "@/components/ui/separator";
import Image from "next/image";

/**
 * AuthLayout Component
 *
 * Provides a consistent layout wrapper for authentication-related pages including:
 * - Login
 * - Sign Up
 * - Forgot Password
 * - Password Reset
 *
 * Features:
 * - Centered content with responsive padding
 * - Niucare branding with logo
 * - Theme switcher
 * - Terms of service and privacy policy links
 *
 * @param props - Component props
 * @param props.children - Child components to be rendered within the layout
 * @returns {JSX.Element} The authentication layout with consistent styling and branding
 */
export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-svh flex-col items-center justify-center bg-muted p-6 md:p-10">
      <div className="w-full max-w-sm flex flex-col items-center justify-center from-[#810101] bg-linear-to-b dark:from-[#810101]/50 to-transparent rounded-xl">
        <div className="flex w-full h-full gap-2 items-center justify-center py-3 px-6">
          <Image
            src="/images/psna-logo.avif"
            alt="Logo"
            width={600}
            height={600}
            className="w-10 h-auto object-cover"
          />
          <p className="text-white font-semibold text-lg text-center">
            Niucare
          </p>
        </div>
        <div className="flex flex-col items-center justify-center w-full">
          {children}
        </div>
      </div>
      <Separator className="my-8 max-w-[20rem] bg-muted-foreground/50" />
      <div className="text-balance text-center text-xs  flex-col text-muted-foreground flex items-center gap-4 justify-center [&_a]:underline [&_a]:underline-offset-4 [&_a]:hover:text-primary">
        <ThemeSwitcher />

        <div className="max-w-xs">
          By using this platform, you&apos;re agreeing to our{" "}
          <a href="#">Terms of Service</a> and <a href="#">Privacy Policy</a>.
        </div>
      </div>
    </div>
  );
}
