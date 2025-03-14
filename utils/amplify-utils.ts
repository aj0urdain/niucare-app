import { createServerRunner } from "@aws-amplify/adapter-nextjs";
import { cookies } from "next/headers";
import { getCurrentUser } from "aws-amplify/auth/server";
import { config } from "@/config/aws-config";

export const { runWithAmplifyServerContext } = createServerRunner({
  config: config as any,
});

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
