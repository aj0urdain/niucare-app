/**
 * File: app/(main)/registration/layout.tsx
 * Description: Layout component for registration flow with loading states and access control
 * Author: Aaron J. Girton - https://github.com/aj0urdain
 * Created: 2025
 */

"use client";

import { useQuery } from "@apollo/client";
import { redirect } from "next/navigation";
import { GET_USER_FULL_REGISTRATION } from "@/lib/graphql/queries";
import { useUserProfileStore } from "@/stores/user-profile-store";
import { Skeleton } from "@/components/ui/skeleton";

/**
 * RegistrationLayout Component
 *
 * Layout wrapper for registration flow that handles:
 * - Loading states with skeleton UI
 * - Registration status checks
 * - Access control and redirects
 *
 * Features:
 * - Skeleton loading UI for better UX
 * - Automatic redirect to dashboard for acknowledged registrations
 * - User registration status verification
 * - Responsive grid layout for content
 *
 * @param props - Component props
 * @param props.children - Child components to be rendered within the layout
 * @returns {JSX.Element} Layout component with loading states and access control
 */
export default function RegistrationLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user } = useUserProfileStore();

  const { data: registrationData, loading } = useQuery(
    GET_USER_FULL_REGISTRATION,
    {
      variables: {
        userId: user?.userId || "",
      },
      skip: !user?.userId,
    }
  );

  if (loading) {
    return (
      <div className="flex flex-col gap-6 pt-6">
        <div className="flex flex-col gap-2">
          <Skeleton className="h-10 w-48" />
          <Skeleton className="h-5 w-72" />
        </div>
        <div className="grid gap-6 md:grid-cols-2">
          <div className="flex flex-col w-full">
            <Skeleton className="w-full h-[400px] rounded-xl" />
          </div>
          <div className="flex flex-col w-full">
            <Skeleton className="w-full h-[400px] rounded-xl" />
          </div>
        </div>
      </div>
    );
  }

  // Get the most recent registration if available
  const mostRecentRegistration = registrationData?.registrationByUserId?.[0];

  // If there's an acknowledged registration, redirect to dashboard
  if (mostRecentRegistration?.status.toLowerCase() === "acknowledged") {
    redirect("/dashboard");
  }

  return <>{children}</>;
}
