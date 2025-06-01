/**
 * File: app/page.tsx
 * Description: Home page component with authentication-based routing
 * Author: Aaron J. Girton - https://github.com/aj0urdain
 * Created: 2025
 */

"use client";

import { useEffect } from "react";
import { useUserProfileStore } from "@/stores/user-profile-store";
import Image from "next/image";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";

/**
 * Home Component
 *
 * Landing page that handles:
 * - Authentication state check
 * - Automatic routing based on auth status
 * - Loading states with visual feedback
 *
 * Features:
 * - PSNA logo display
 * - Loading animation
 * - Automatic redirection
 * - Responsive design
 *
 * Routing Logic:
 * - Authenticated users -> /dashboard
 * - Unauthenticated users -> /auth
 *
 * @returns {JSX.Element} Home page with loading state and logo
 */
export default function Home() {
  const { user, isLoading } = useUserProfileStore();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading) {
      if (user) {
        router.push("/dashboard");
      } else {
        router.push("/auth");
      }
    }
  }, [user, isLoading, router]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-8 bg-muted p-6">
      <div className="relative w-48 h-auto">
        <Image
          src="/images/psna-logo.avif"
          alt="PSNA Logo"
          className="object-contain"
          priority
          width={400}
          height={400}
        />
      </div>
      <div className="flex items-center gap-2 text-muted-foreground animate-pulse">
        <Loader2 className="h-6 w-6 animate-spin" />
        <span className="text-xl font-medium uppercase">
          {isLoading ? "Loading" : "Redirecting"}
        </span>
      </div>
    </div>
  );
}
