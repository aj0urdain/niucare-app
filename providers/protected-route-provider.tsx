import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useUserProfileStore } from "@/stores/user-profile-store";

interface ProtectedRouteProviderProps {
  children: React.ReactNode;
  requiredPermissions?: {
    canApproveRegistration?: boolean;
  };
}

export function ProtectedRouteProvider({
  children,
  requiredPermissions,
}: ProtectedRouteProviderProps) {
  const router = useRouter();
  const { user, isLoading } = useUserProfileStore();

  useEffect(() => {
    if (!isLoading) {
      // If no user is present, redirect to auth
      if (!user) {
        router.push("/auth");
        return;
      }

      // Check for required permissions if specified
      if (requiredPermissions) {
        const hasRequiredPermissions = Object.entries(
          requiredPermissions
        ).every(
          ([key, value]) =>
            user.permissions[key as keyof typeof user.permissions] === value
        );

        if (!hasRequiredPermissions) {
          router.push("/404");
          return;
        }
      }
    }
  }, [user, isLoading, router, requiredPermissions]);

  // Show nothing while loading or if not authenticated
  if (isLoading || !user) {
    return null;
  }

  return <>{children}</>;
}
