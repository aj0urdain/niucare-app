/**
 * @file amplify-utils.ts
 * @description Utility functions for AWS Amplify server-side operations and authentication
 * @author Aaron J. Girton - https://github.com/aj0urdain
 * @created 2025
 */

import { createServerRunner } from "@aws-amplify/adapter-nextjs";
import { cookies } from "next/headers";
import { getCurrentUser } from "aws-amplify/auth/server";
import { config } from "@/config/aws-config";

/**
 * Creates a server runner for AWS Amplify operations
 * This is used to run Amplify operations in a server context
 * @type {Object}
 */
export const { runWithAmplifyServerContext } = createServerRunner({
  config: config as any,
});

/**
 * Checks if the current user is authenticated
 * @returns {Promise<boolean>} True if the user is authenticated, false otherwise
 *
 * @example
 * ```ts
 * // In a server component or API route
 * const isUserAuthenticated = await isAuthenticated();
 * if (!isUserAuthenticated) {
 *   // Handle unauthenticated state
 * }
 * ```
 */
export const isAuthenticated = async () =>
  await runWithAmplifyServerContext({
    nextServerContext: { cookies },
    async operation(contextSpec: any) {
      try {
        const user = await getCurrentUser(contextSpec);
        console.log("user", user);
        return !!user;
      } catch (error) {
        console.error("Error verifying authentication:", error);
        return false;
      }
    },
  });
