import { createContext, useContext } from "react";
import { useUserProfileStore } from "@/stores/user-profile-store";

interface PermissionContextType {
  canApproveRegistration: boolean;
  acknowledgedRegistration: boolean;
  loading: boolean;
}

export const PermissionContext = createContext<PermissionContextType>({
  canApproveRegistration: false,
  acknowledgedRegistration: false,
  loading: true,
});

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

export const usePermissions = () => useContext(PermissionContext);
