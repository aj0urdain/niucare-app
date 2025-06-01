/**
 * File: app/(main)/registration/public/page.tsx
 * Description: Public registration page for service provider registration
 * Author: Aaron J. Girton - https://github.com/aj0urdain
 * Created: 2025
 */

"use client";

import { useQuery } from "@apollo/client";
import {
  DRAFTS_BY_USER_ID,
  GET_USER_REGISTRATION,
} from "@/lib/graphql/queries";
import { useUserProfileStore } from "@/stores/user-profile-store";
import PublicRegistrationForm from "@/components/organisms/public-registration-form";
import { Skeleton } from "@/components/ui/skeleton";

/**
 * RegistrationPage Component
 *
 * Public registration page that handles:
 * - Loading user registration data
 * - Loading and managing registration drafts
 * - Displaying the public registration form
 *
 * Features:
 * - Draft persistence and retrieval
 * - Loading states with skeleton UI
 * - User registration status tracking
 * - Responsive layout
 *
 * @returns {JSX.Element} Public registration page with form and loading states
 */
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

  console.log("latestDraft", latestDraft);

  if (loading || registrationLoading) {
    return (
      <div className="flex w-full gap-4 h-[calc(98vh-(--spacing(24)))]">
        <Skeleton className="w-1/4 h-3/4" />
        <Skeleton className="w-3/4 h-3/4" />
      </div>
    );
  }

  return <PublicRegistrationForm initialDraft={latestDraft} />;
}
