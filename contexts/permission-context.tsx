/**
 * File: contexts/permission-context.tsx
 * Description: Context provider for managing user permissions and registration status
 * Author: Aaron J. Girton - https://github.com/aj0urdain
 * Created: 2025
 */

import { createContext, useContext } from "react";
import { useUserProfileStore } from "@/stores/user-profile-store";

/**
 * Type definition for the permission context
 * @interface PermissionContextType
 * @property {boolean} canApproveRegistration - Whether the user can approve registrations
 * @property {boolean} acknowledgedRegistration - Whether the user has acknowledged their registration
 * @property {boolean} loading - Whether the permission state is being loaded
 */
interface PermissionContextType {
  canApproveRegistration: boolean;
  acknowledgedRegistration: boolean;
  loading: boolean;
}

/**
 * Permission Context
 *
 * Default values for the permission context
 */
export const PermissionContext = createContext<PermissionContextType>({
  canApproveRegistration: false,
  acknowledgedRegistration: false,
  loading: true,
});

/**
 * Permission Provider Component
 *
 * Provides permission context to the application, managing user permissions and registration status.
 *
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Child components to be wrapped by the provider
 * @returns {JSX.Element} The permission provider component
 *
 * @example
 * ```tsx
 * <PermissionProvider>
 *   <App />
 * </PermissionProvider>
 * ```
 */
export function PermissionProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, isLoading } = useUserProfileStore();

  const canApproveRegistration =
    user?.permissions?.canApproveRegistration ?? false;
  const acknowledgedRegistration =
    user?.registration?.status?.toLowerCase() === "acknowledged";

  return (
    <PermissionContext.Provider
      value={{
        canApproveRegistration,
        acknowledgedRegistration,
        loading: isLoading,
      }}
    >
      {children}
    </PermissionContext.Provider>
  );
}

/**
 * Hook to access the permission context
 * @returns {PermissionContextType} The permission context
 *
 * @example
 * ```tsx
 * const { canApproveRegistration, acknowledgedRegistration } = usePermissions();
 * ```
 */
export const usePermissions = () => useContext(PermissionContext);
