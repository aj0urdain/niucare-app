/**
 * @file user-profile-store.ts
 * @description Zustand store for managing user profile data, permissions, and registration status
 * @author Aaron J. Girton - https://github.com/aj0urdain
 * @created 2025
 */

import { create } from "zustand";
import { fetchUserAttributes, getCurrentUser } from "aws-amplify/auth";
import {
  ApolloClient,
  NormalizedCacheObject,
  FetchPolicy,
} from "@apollo/client";
import { GET_USER_REGISTRATION } from "@/lib/graphql/queries";
import { Registration } from "@/lib/graphql/types";

/**
 * Interface for basic user details
 * @interface UserDetails
 * @property {string | null} userId - User's unique identifier
 * @property {string | null} username - User's username
 * @property {string | null} email - User's email address
 */
interface UserDetails {
  userId: string | null;
  username: string | null;
  email: string | null;
}

/**
 * Interface for user attributes from Cognito
 * @interface UserAttributes
 * @property {string | null} given_name - User's given name
 * @property {string | null} family_name - User's family name
 * @property {string | null} phone_number - User's phone number
 * @property {boolean | null} phone_number_verified - Whether phone number is verified
 * @property {boolean | null} email_verified - Whether email is verified
 */
interface UserAttributes {
  given_name: string | null;
  family_name: string | null;
  phone_number: string | null;
  phone_number_verified: boolean | null;
  email_verified: boolean | null;
}

/**
 * Interface for complete user profile data
 * @interface UserProfile
 * @property {string | null} userId - User's unique identifier
 * @property {string | null} username - User's username
 * @property {string | null} email - User's email address
 * @property {string | null} given_name - User's given name
 * @property {string | null} family_name - User's family name
 * @property {string | null} phone_number - User's phone number
 * @property {boolean | null} phone_number_verified - Whether phone number is verified
 * @property {boolean | null} email_verified - Whether email is verified
 * @property {Object} permissions - User's permissions
 * @property {boolean} permissions.canApproveRegistration - Whether user can approve registrations
 * @property {Object} registration - User's registration information
 * @property {boolean} registration.exists - Whether registration exists
 * @property {string | null} registration.status - Registration status
 * @property {string | null} registration.id - Registration ID
 * @property {Registration | null} registration.details - Registration details
 * @property {boolean} registration.showRegistrationMenu - Whether to show registration menu
 * @property {boolean} registration.isPsnaProvider - Whether user is a PSNA provider
 * @property {UserDetails | null} userDetails - Basic user details
 * @property {UserAttributes | null} userAttributes - User attributes from Cognito
 */
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
  userDetails: UserDetails | null;
  userAttributes: UserAttributes | null;
}

/**
 * Interface for the user profile store state and actions
 * @interface UserProfileStore
 * @property {UserProfile | null} user - Current user profile
 * @property {boolean} isLoading - Whether profile is being loaded
 * @property {Error | null} error - Any error that occurred
 * @property {function} fetchUserProfile - Fetch user profile data
 * @property {function} clearUserProfile - Clear user profile data
 */
interface UserProfileStore {
  user: UserProfile | null;
  isLoading: boolean;
  error: Error | null;
  fetchUserProfile: (
    client: ApolloClient<NormalizedCacheObject>
  ) => Promise<void>;
  clearUserProfile: () => void;
}

/**
 * Fetches user profile data from Cognito and OpenFGA
 * @returns {Promise<UserProfile>} Complete user profile data
 */
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
    userDetails: {
      userId: userDetails.userId,
      username: userDetails.username,
      email: userDetails.signInDetails?.loginId ?? null,
    },
    userAttributes: {
      given_name: userAttributes.given_name ?? null,
      family_name: userAttributes.family_name ?? null,
      phone_number: userAttributes.phone_number ?? null,
      phone_number_verified:
        userAttributes.phone_number_verified === "true" ? true : false,
      email_verified: userAttributes.email_verified === "true" ? true : false,
    },
  };
}

/**
 * Zustand store for managing user profile data
 * @returns {UserProfileStore} Store instance with state and actions
 */
export const useUserProfileStore = create<UserProfileStore>((set) => ({
  user: null,
  isLoading: false,
  error: null,

  fetchUserProfile: async (client: ApolloClient<NormalizedCacheObject>) => {
    try {
      set({ isLoading: true, error: null });
      const userProfile = await fetchUserProfileData();

      // First set the basic user profile
      set({ user: userProfile });

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
      // Set loading to false after all data fetching is complete
      set({ isLoading: false });
    } catch (error) {
      set({ error: error as Error, isLoading: false });
    }
  },

  clearUserProfile: () => {
    set({ user: null, error: null });
  },
}));
