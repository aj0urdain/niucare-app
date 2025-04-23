"use client";

import { PrivateRegistrationForm } from "@/components/organisms/private-registration-form";
import { useQuery } from "@apollo/client";
import { DRAFTS_BY_USER_ID } from "@/lib/graphql/queries";
import { useUserProfileStore } from "@/stores/user-profile-store";

export default function RegistrationPage() {
  const { user } = useUserProfileStore();
  const { data: draftsData, loading } = useQuery(DRAFTS_BY_USER_ID, {
    variables: {
      userId: user?.userId || "",
    },
    skip: !user?.userId,
  });

  return (
    <PrivateRegistrationForm
      existingDrafts={draftsData?.draftByUserId || []}
      isLoading={loading}
    />
  );
}
