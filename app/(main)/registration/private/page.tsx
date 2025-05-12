"use client";

import { useQuery } from "@apollo/client";
import { DRAFTS_BY_USER_ID } from "@/lib/graphql/queries";
import { useUserProfileStore } from "@/stores/user-profile-store";
import PrivateRegistrationForm from "@/components/organisms/private-registration-form";
import { Skeleton } from "@/components/ui/skeleton";

export default function RegistrationPage() {
  const { user } = useUserProfileStore();
  const { data: draftsData, loading } = useQuery(DRAFTS_BY_USER_ID, {
    variables: {
      userId: user?.userId || "",
    },
    skip: !user?.userId,
  });

  if (loading) {
    return <Skeleton className="w-full h-[calc(98vh-theme(spacing.24))]" />;
  }

  // Get the most recent draft if available
  const latestDraft = draftsData?.draftByUserId?.[0];

  return <PrivateRegistrationForm initialDraft={latestDraft} />;
}
