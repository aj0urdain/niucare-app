/**
 * @file protected-route-provider.tsx
 * @description Provider component for protecting routes based on user permissions and registration status
 * @author Aaron J. Girton - https://github.com/aj0urdain
 * @created 2025
 */

import { useRouter } from "next/navigation";
import { useUserProfileStore } from "@/stores/user-profile-store";
import { Loader2 } from "lucide-react";

/**
 * Props for the ProtectedRouteProvider component
 * @interface ProtectedRouteProviderProps
 * @property {React.ReactNode} children - Child components to be protected
 * @property {Object} [requiredPermissions] - Optional permissions required to access the route
 * @property {boolean} [requiredPermissions.canApproveRegistration] - Whether user can approve registrations
 * @property {boolean} [requiredPermissions.acknowledgedRegistration] - Whether user has acknowledged registration
 */
interface ProtectedRouteProviderProps {
  children: React.ReactNode;
  requiredPermissions?: {
    canApproveRegistration?: boolean;
    acknowledgedRegistration?: boolean;
  };
}

/**
 * Provider component that protects routes based on user permissions and registration status
 * @param {ProtectedRouteProviderProps} props - Component props
 * @returns {JSX.Element | null} Protected route component or null if access is denied
 *
 * @example
 * ```tsx
 * // Protect a route that requires registration acknowledgment
 * <ProtectedRouteProvider requiredPermissions={{ acknowledgedRegistration: true }}>
 *   <ProtectedComponent />
 * </ProtectedRouteProvider>
 *
 * // Protect a route that requires registration approval permission
 * <ProtectedRouteProvider requiredPermissions={{ canApproveRegistration: true }}>
 *   <AdminComponent />
 * </ProtectedRouteProvider>
 * ```
 */
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
