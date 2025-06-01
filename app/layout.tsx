/**
 * File: app/layout.tsx
 * Description: Root layout component for the Niucare application
 * Author: Aaron J. Girton - https://github.com/aj0urdain
 * Created: 2025
 */

"use client";

import "./globals.css";
import { Toaster as Sonner } from "sonner";
import { ThemeProvider } from "@/components/atoms/theme-provider";
import "@aws-amplify/ui-react/styles.css";
import { ApolloWrapper } from "@/providers/apollo-provider";
import { configureAmplify } from "@/config/amplify-config";
import { QueryProvider } from "@/providers/query-provider";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useUserProfileStore } from "@/stores/user-profile-store";
import { useEffect } from "react";
import { useApolloClient } from "@apollo/client";
import { Hub } from "aws-amplify/utils";

// Configure Amplify for client-side
configureAmplify();

// const defaultUrl = process.env.VERCEL_URL
//   ? `https://${process.env.VERCEL_URL}`
//   : "http://localhost:3000";

// export const metadata: Metadata = {
//   metadataBase: new URL(defaultUrl),
//   title: {
//     template: "%s › Niucare",
//     default: "Niucare",
//   },
//   description: "Niucare internal platform for healthcare operations.",
//   keywords: ["Niucare", "healthcare", "internal platform"],
//   authors: [{ name: "Aaron J. Girton" }],
//   creator: "Aaron J. Girton",
// };

/**
 * UserProfileInitializer Component
 *
 * Handles user profile state management and authentication events.
 * Features:
 * - Initial profile fetch on mount
 * - Auth event listeners (sign in, sign out, token refresh)
 * - Automatic profile updates
 *
 * @returns {null} This component doesn't render anything
 */
function UserProfileInitializer() {
  const client = useApolloClient();
  const fetchUserProfile = useUserProfileStore(
    (state) => state.fetchUserProfile
  );
  const clearUserProfile = useUserProfileStore(
    (state) => state.clearUserProfile
  );

  useEffect(() => {
    // Initial fetch
    fetchUserProfile(client);

    // Set up auth listener
    const hubListener = Hub.listen("auth", ({ payload }) => {
      switch (payload.event) {
        case "signedIn":
          console.log("Auth: User signed in - fetching profile");
          fetchUserProfile(client);
          break;
        case "signedOut":
          console.log("Auth: User signed out - clearing profile");
          clearUserProfile();
          break;
        case "tokenRefresh":
          console.log("Auth: Tokens refreshed - fetching profile");
          fetchUserProfile(client);
          break;
      }
    });

    // Cleanup listener on unmount
    return () => {
      hubListener();
    };
  }, [client, fetchUserProfile, clearUserProfile]);

  return null;
}

/**
 * RootLayout Component
 *
 * Root layout wrapper that provides:
 * - Theme support (light/dark mode)
 * - Toast notifications
 * - Apollo GraphQL client
 * - Query provider
 * - Tooltip provider
 * - User profile management
 *
 * @param props - Component props
 * @param props.children - Child components to be rendered
 * @returns {JSX.Element} Root layout with providers and global UI elements
 */
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`bg-background text-foreground`}>
        <TooltipProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="light"
            enableSystem
            disableTransitionOnChange
          >
            <QueryProvider>
              <ApolloWrapper>
                <UserProfileInitializer />
                {children}
                <Sonner />
              </ApolloWrapper>
            </QueryProvider>
          </ThemeProvider>
        </TooltipProvider>
      </body>
    </html>
  );
}
