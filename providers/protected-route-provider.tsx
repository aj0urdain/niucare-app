import { useRouter } from "next/navigation";
import { useUserProfileStore } from "@/stores/user-profile-store";
import { Loader2 } from "lucide-react";

interface ProtectedRouteProviderProps {
  children: React.ReactNode;
  requiredPermissions?: {
    canApproveRegistration?: boolean;
    acknowledgedRegistration?: boolean;
  };
}

export function ProtectedRouteProvider({
  children,
  requiredPermissions,
}: ProtectedRouteProviderProps) {
  const router = useRouter();
  const { user, isLoading } = useUserProfileStore();

  // Show loading state while checking permissions
  if (isLoading) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  // If not authenticated, show nothing
  if (!user) {
    return null;
  }

  // Only check permissions after loading is complete and we have a user
  if (requiredPermissions && !isLoading) {
    const hasRequiredPermissions = Object.entries(requiredPermissions).some(
      ([key, value]) => {
        if (key === "acknowledgedRegistration") {
          return (
            (user?.registration?.status?.toLowerCase() === "acknowledged") ===
            value
          );
        }
        return (
          user?.permissions[key as keyof typeof user.permissions] === value
        );
      }
    );

    if (!hasRequiredPermissions) {
      router.push("/404");
      return null;
    }
  }

  return <>{children}</>;
}
