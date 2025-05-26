"use client";

import { Building2, Hospital } from "lucide-react";
import { useQuery, useMutation } from "@apollo/client";
import {
  DRAFTS_BY_USER_ID,
  GET_USER_FULL_REGISTRATION,
} from "@/lib/graphql/queries";
import { ADD_OR_UPDATE_DRAFT } from "@/lib/graphql/mutations";
import { useUserProfileStore } from "@/stores/user-profile-store";
import { Skeleton } from "@/components/ui/skeleton";
import { RegistrationCard } from "@/components/organisms/registration-card";
import { SubmittedRegistration } from "@/components/organisms/submitted-registration";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export default function RegistrationPage() {
  const { user } = useUserProfileStore();
  const [addOrUpdateDraft] = useMutation(ADD_OR_UPDATE_DRAFT, {
    refetchQueries: [
      {
        query: DRAFTS_BY_USER_ID,
        variables: {
          userId: user?.userId || "",
        },
      },
    ],
  });

  const { data: draftsData, loading: draftsLoading } = useQuery(
    DRAFTS_BY_USER_ID,
    {
      variables: {
        userId: user?.userId || "",
      },
      skip: !user?.userId,
    }
  );

  const { data: registrationData, loading: registrationLoading } = useQuery(
    GET_USER_FULL_REGISTRATION,
    {
      variables: {
        userId: user?.userId || "",
      },
      skip: !user?.userId,
    }
  );

  const handleTestUpdate = async () => {
    if (!user?.userId || !latestDraft) {
      toast.error("No user or draft found");
      return;
    }

    try {
      await addOrUpdateDraft({
        variables: {
          draft: {
            ...latestDraft,
            userId: user.userId,
            reason: "testing",
            updated_Date: new Date().toISOString(),
            __typename: undefined,
            account_Name: "testing 5",
            id: undefined,
          },
        },
      });
      toast.success("Test reason added successfully");
    } catch (error) {
      console.error("Error updating draft:", error);
      toast.error("Failed to update draft");
    }
  };

  if (draftsLoading || registrationLoading) {
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

  // Get the most recent registration if available
  const mostRecentRegistration = registrationData?.registrationByUserId?.[0];

  // Get the most recent draft if available
  const latestDraft = draftsData?.draftByUserId?.[0];

  console.log("latestDraft", latestDraft);

  // If there's a registration with pending status, show the submitted registration
  if (mostRecentRegistration?.status.toLowerCase() === "pending") {
    return <SubmittedRegistration registration={mostRecentRegistration} />;
  }

  // If there's a rejected registration, check if there's a newer draft
  if (mostRecentRegistration?.status.toLowerCase() === "rejected") {
    if (latestDraft) {
      const registrationDate = new Date(
        mostRecentRegistration.updated_Date || 0
      );
      const draftDate = new Date(latestDraft.updated_Date || 0);

      // If the draft is newer than the registration, show the registration cards
      if (draftDate > registrationDate) {
        return (
          <div className="flex flex-col gap-6 pt-6">
            <div className="flex flex-col gap-2">
              <h2 className="text-3xl font-bold">Registration</h2>
              <p className="text-muted-foreground">
                Select your service provider category
              </p>
              {/* <div className="flex gap-2">
                <Button variant="outline" size="sm">
                  Add Reason
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleTestUpdate}
                  className="bg-yellow-100 hover:bg-yellow-200"
                >
                  Test Add Reason
                </Button>
              </div> */}
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
    }
    // If no draft or draft is older, show the rejected registration
    return <SubmittedRegistration registration={mostRecentRegistration} />;
  }

  // Default case: show registration cards
  return (
    <div className="flex flex-col gap-6 pt-6">
      <div className="flex flex-col gap-2">
        <h2 className="text-3xl font-bold">Registration</h2>
        <p className="text-muted-foreground">
          Select your service provider category
        </p>
        {/* {latestDraft && (
          <Button
            variant="outline"
            size="sm"
            onClick={handleTestUpdate}
            className="bg-yellow-100 hover:bg-yellow-200"
          >
            Test Add Reason
          </Button>
        )} */}
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
