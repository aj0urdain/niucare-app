"use client";

import { useQuery } from "@apollo/client";
import {
  DRAFTS_BY_USER_ID,
  GET_USER_REGISTRATION,
} from "@/lib/graphql/queries";
import { useUserProfileStore } from "@/stores/user-profile-store";
import PrivateRegistrationForm from "@/components/organisms/private-registration-form";
import { Skeleton } from "@/components/ui/skeleton";

export default function RegistrationPage() {
  const { user } = useUserProfileStore();

  const { data: registrationData, loading: registrationLoading } = useQuery(
    GET_USER_REGISTRATION,
    {
      variables: {
        userId: user?.userId || "",
      },
      skip: !user?.userId,
    }
  );

  console.log(registrationData);

  const { data: draftsData, loading } = useQuery(DRAFTS_BY_USER_ID, {
    variables: {
      userId: user?.userId || "",
    },
    skip: !user?.userId,
  });

  // Get the most recent draft if available
  const latestDraft = draftsData?.draftByUserId?.[0];

  console.log(latestDraft);

  if (loading) {
    return (
      <div className="flex w-full gap-4 h-[calc(98vh-(--spacing(24)))]">
        <Skeleton className="w-1/4 h-3/4" />
        <Skeleton className="w-3/4 h-3/4" />
      </div>
    );
  }

  return <PrivateRegistrationForm initialDraft={latestDraft} />;
}
