/**
 * File: app/(main)/registration/private/page.tsx
 * Description: Private registration page for internal service provider registration
 * Author: Aaron J. Girton - https://github.com/aj0urdain
 * Created: 2025
 */

"use client";

import { useQuery } from "@apollo/client";
import { DRAFTS_BY_USER_ID } from "@/lib/graphql/queries";
import { useUserProfileStore } from "@/stores/user-profile-store";
import PrivateRegistrationForm from "@/components/organisms/private-registration-form";
import { Skeleton } from "@/components/ui/skeleton";

/**
 * RegistrationPage Component
 *
 * Private registration page that handles:
 * - Loading user registration data
 * - Loading and managing registration drafts
 * - Displaying the private registration form
 *
 * Features:
 * - Draft persistence and retrieval
 * - Loading states with skeleton UI
 * - User registration status tracking
 * - Responsive layout
 *
 * @returns {JSX.Element} Private registration page with form and loading states
 */
export default function RegistrationPage() {
  const { user } = useUserProfileStore();

  const { data: draftsData, loading } = useQuery(DRAFTS_BY_USER_ID, {
    variables: {
      userId: user?.userId || "",
    },
    skip: !user?.userId,
  });

  // Get the most recent draft if available
  const latestDraft = draftsData?.draftByUserId?.[0];

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
