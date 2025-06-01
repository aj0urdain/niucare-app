"use client";

import { useQuery } from "@apollo/client";
import { redirect } from "next/navigation";
import { GET_USER_FULL_REGISTRATION } from "@/lib/graphql/queries";
import { useUserProfileStore } from "@/stores/user-profile-store";
import { Skeleton } from "@/components/ui/skeleton";

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
