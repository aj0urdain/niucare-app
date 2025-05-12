"use client";

import { Building2, Hospital } from "lucide-react";
import { useQuery } from "@apollo/client";
import { DRAFTS_BY_USER_ID } from "@/lib/graphql/queries";
import { useUserProfileStore } from "@/stores/user-profile-store";
import { Skeleton } from "@/components/ui/skeleton";
import { RegistrationCard } from "@/components/organisms/registration-card";

export default function RegistrationPage() {
  const { user } = useUserProfileStore();
  const { data: draftsData, loading } = useQuery(DRAFTS_BY_USER_ID, {
    variables: {
      userId: user?.userId || "",
    },
    skip: !user?.userId,
  });

  if (loading) {
    return (
      <div className="flex flex-col gap-6 pt-6">
        <div className="flex flex-col gap-2">
          <Skeleton className="h-10 w-48" />
          <Skeleton className="h-5 w-72" />
        </div>
        <div className="grid gap-6 md:grid-cols-2">
          {/* Private Card Skeleton */}
          <div className="flex flex-col w-full">
            <Skeleton className="w-full h-[400px] rounded-xl" />
          </div>
          {/* Public Card Skeleton */}
          <div className="flex flex-col w-full">
            <Skeleton className="w-full h-[400px] rounded-xl" />
          </div>
        </div>
      </div>
    );
  }

  // Get the most recent draft if available
  const latestDraft = draftsData?.draftByUserId?.[0];

  return (
    <div className="flex flex-col gap-6 pt-6">
      <div className="flex flex-col gap-2">
        <h2 className="text-3xl font-bold">Registration</h2>
        <p className="text-muted-foreground">
          Select your service provider category
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Private Card */}
        <RegistrationCard
          title="Private Service Providers"
          description="Non-government Health Care Providers"
          icon={Building2}
          href="/registration/private"
          registrationType="private"
          latestDraft={latestDraft}
        />

        {/* Public Card */}
        <RegistrationCard
          title="Provincial Health Authorities"
          description="Government Hospitals, Clinics and Medical Centers"
          icon={Hospital}
          href="/registration/public"
          registrationType="public"
          latestDraft={latestDraft}
        />
      </div>
    </div>
  );
}
