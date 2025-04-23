"use client";

import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
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

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning={true}>
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
                <Toaster />
                <Sonner />
              </ApolloWrapper>
            </QueryProvider>
          </ThemeProvider>
        </TooltipProvider>
      </body>
    </html>
  );
}
