import { create } from "zustand";
import { fetchUserAttributes, getCurrentUser } from "aws-amplify/auth";
import { ApolloClient, FetchPolicy } from "@apollo/client";
import { GET_USER_REGISTRATION } from "@/lib/graphql/queries";

interface Registration {
  id: string;
  ptype: string;
  status: string;
  reason: string | null;
  bucket: string;
}

interface UserProfile {
  userId: string | null;
  username: string | null;
  email: string | null;
  given_name: string | null;
  family_name: string | null;
  phone_number: string | null;
  phone_number_verified: boolean | null;
  email_verified: boolean | null;
  permissions: {
    canApproveRegistration: boolean;
  };
  registration: {
    exists: boolean;
    status: string | null;
    id: string | null;
    details: Registration | null;
    showRegistrationMenu: boolean;
    isPsnaProvider: boolean;
  };
}

interface UserProfileStore {
  user: UserProfile | null;
  isLoading: boolean;
  error: Error | null;
  fetchUserProfile: (client: ApolloClient<object>) => Promise<void>;
  clearUserProfile: () => void;
}

async function fetchUserProfileData(): Promise<UserProfile> {
  const userDetails = await getCurrentUser();
  const userAttributes = await fetchUserAttributes();

  // Fetch permissions
  const permissionsResponse = await fetch(
    `https://api.staging.niucare.com/api/openfga/check?userId=${userDetails.userId}&permission=Approve_Registration`
  );
  const permissionsData = await permissionsResponse.json();

  return {
    userId: userDetails.userId,
    username: userDetails.username,
    email: userDetails.signInDetails?.loginId ?? null,
    given_name: userAttributes.given_name ?? null,
    family_name: userAttributes.family_name ?? null,
    phone_number: userAttributes.phone_number ?? null,
    phone_number_verified:
      userAttributes.phone_number_verified === "true" ? true : false,
    email_verified: userAttributes.email_verified === "true" ? true : false,
    permissions: {
      canApproveRegistration: permissionsData.allowed,
    },
    registration: {
      exists: false,
      status: null,
      id: null,
      details: null,
      showRegistrationMenu: false,
      isPsnaProvider: false,
    },
  };
}

export const useUserProfileStore = create<UserProfileStore>((set) => ({
  user: null,
  isLoading: false,
  error: null,

  fetchUserProfile: async (client: ApolloClient<object>) => {
    try {
      set({ isLoading: true, error: null });
      const userProfile = await fetchUserProfileData();

      // First set the basic user profile
      set({ user: userProfile, isLoading: false });

      // If user is not an admin, fetch their registration data
      if (!userProfile.permissions.canApproveRegistration && client) {
        try {
          const { data } = await client.query({
            query: GET_USER_REGISTRATION,
            variables: {
              userId: userProfile.userId,
            },
            fetchPolicy: "network-only" as FetchPolicy,
          });

          const registrationDetails = Array.isArray(data?.registrationByUserId)
            ? data?.registrationByUserId[0]
            : data?.registrationByUserId;

          const hasValidRegistration = Boolean(
            registrationDetails &&
              registrationDetails.id &&
              registrationDetails.status
          );

          set({
            user: {
              ...userProfile,
              registration: {
                exists: hasValidRegistration,
                status: registrationDetails?.status ?? null,
                id: registrationDetails?.id ?? null,
                isPsnaProvider: registrationDetails?.isPsnaProvider ?? false,
                details: registrationDetails ?? null,
                showRegistrationMenu:
                  !userProfile.permissions.canApproveRegistration,
              },
            },
          });
        } catch (error) {
          console.error("Registration query error:", error);
          // On error, keep the basic user profile but with default registration values
          set({
            user: {
              ...userProfile,
              registration: {
                exists: false,
                status: null,
                id: null,
                isPsnaProvider: false,
                details: null,
                showRegistrationMenu:
                  !userProfile.permissions.canApproveRegistration,
              },
            },
          });
        }
      }
    } catch (error) {
      set({ error: error as Error, isLoading: false });
    }
  },

  clearUserProfile: () => {
    set({ user: null, error: null });
  },
}));
