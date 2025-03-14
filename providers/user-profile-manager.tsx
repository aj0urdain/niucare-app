"use client";

import { fetchUserAttributes, getCurrentUser } from "aws-amplify/auth";
import { useQuery } from "@tanstack/react-query";
import { createContext, useContext, useEffect } from "react";
import { Hub } from "aws-amplify/utils";
import { useQueryClient } from "@tanstack/react-query";
import { useQuery as useApolloQuery } from "@apollo/client";
import { GET_USER_REGISTRATION } from "../lib/graphql/queries";

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
  };
}

interface UserProfileContextType {
  user: UserProfile | null;
  isLoading: boolean;
  error: Error | null;
}

const UserProfileContext = createContext<UserProfileContextType>({
  user: null,
  isLoading: false,
  error: null,
});

async function fetchUserProfile(): Promise<UserProfile> {
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
    },
  };
}

export function UserProfileProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const queryClient = useQueryClient();

  useEffect(() => {
    Hub.listen("auth", ({ payload }) => {
      console.log("payload", payload);
      switch (payload.event) {
        case "signedIn":
          console.log("user have been signedIn successfully.");
          queryClient.invalidateQueries({ queryKey: ["userProfile"] });
          break;
        case "signedOut":
          console.log("user have been signedOut successfully.");
          queryClient.invalidateQueries({ queryKey: ["userProfile"] });
          break;
        case "tokenRefresh":
          console.log("auth tokens have been refreshed.");
          break;
        case "tokenRefresh_failure":
          console.log("failure while refreshing auth tokens.");
          break;
        case "signInWithRedirect":
          console.log("signInWithRedirect API has successfully been resolved.");
          break;
        case "signInWithRedirect_failure":
          console.log(
            "failure while trying to resolve signInWithRedirect API."
          );
          break;
        case "customOAuthState":
          console.log("custom state returned from CognitoHosted UI");
          break;
      }
    });
  }, [queryClient]);

  const {
    data: user,
    isLoading: profileLoading,
    error: profileError,
  } = useQuery({
    queryKey: ["userProfile"],
    queryFn: fetchUserProfile,
    staleTime: 1000 * 60 * 5, // Consider data fresh for 5 minutes
    retry: 2, // Retry failed requests twice
  });

  // Fetch registration data using Apollo
  const {
    data: registrationData,
    loading: registrationLoading,
    error: registrationError,
  } = useApolloQuery(GET_USER_REGISTRATION, {
    variables: {
      userId: user?.userId || "",
    },
    skip: !user?.userId || (user?.permissions?.canApproveRegistration ?? false), // Skip for admins
    fetchPolicy: "cache-and-network",
    onError: (error) => {
      console.error("Registration query error:", error);
    },
  });

  // Helper function to check if registration has meaningful data
  const hasValidRegistration = (
    reg: Registration | null | undefined
  ): boolean => {
    return Boolean(reg && reg.id && reg.status);
  };

  // Helper function to determine if registration menu should be shown
  // const shouldShowRegistrationMenu = (
  //   isAdmin: boolean,
  //   registration: Registration | null | undefined
  // ): boolean => {
  //   if (isAdmin) return false; // Admins don't need registration
  //   if (!registration) return true; // No registration = show menu

  //   // If they have a registration and it's a service provider type
  //   // only show menu if status is not "Acknowledged" or "Approved"
  //   if (registration.ptype === "public") {
  //     return !["Acknowledged", "Approved"].includes(registration.status);
  //   }

  //   return true; // For other types, show menu by default
  // };

  // Get first registration if it's an array
  const registrationDetails = Array.isArray(
    registrationData?.registrationByUserId
  )
    ? registrationData?.registrationByUserId[0]
    : registrationData?.registrationByUserId;

  // Merge the user profile with registration data
  const mergedUser = user
    ? {
        ...user,
        registration: {
          exists: hasValidRegistration(registrationDetails),
          status: registrationDetails?.status ?? null,
          id: registrationDetails?.id ?? null,
          details: registrationDetails ?? null,
          // showRegistrationMenu: shouldShowRegistrationMenu(
          //   user.permissions.canApproveRegistration,
          //   registrationDetails
          // ),
        },
      }
    : null;

  console.log(mergedUser);

  return (
    <UserProfileContext.Provider
      value={{
        user: mergedUser,
        isLoading: profileLoading || registrationLoading,
        error: profileError || (registrationError as Error | null),
      }}
    >
      {children}
    </UserProfileContext.Provider>
  );
}

export const useUserProfile = () => {
  const context = useContext(UserProfileContext);
  if (!context) {
    throw new Error("useUserProfile must be used within a UserProfileProvider");
  }
  return context;
};
