import { createContext, useContext, useEffect, useState } from "react";
import { getCurrentUser } from "aws-amplify/auth";

interface PermissionContextType {
  canApproveRegistration: boolean;
  loading: boolean;
}

export const PermissionContext = createContext<PermissionContextType>({
  canApproveRegistration: false,
  loading: true,
});

export function PermissionProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [canApproveRegistration, setCanApproveRegistration] = useState(false);
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState<string | null>(null);

  // Effect to get the current user's ID
  useEffect(() => {
    const getUserId = async () => {
      try {
        const { userId: currentUserId } = await getCurrentUser();
        setUserId(currentUserId);
      } catch (error) {
        console.error("Error getting user ID:", error);
        setUserId(null);
      }
    };

    getUserId();
  }, []);

  // Effect to check admin permissions when userId changes
  useEffect(() => {
    const checkAdminPermission = async () => {
      if (!userId) {
        setCanApproveRegistration(false);
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(
          `https://api.staging.niucare.com/api/openfga/check?userId=${userId}&permission=Approve_Registration`
        );
        const data = await response.json();
        setCanApproveRegistration(data.allowed);
        console.log("Admin permission check:", data);
      } catch (error) {
        console.error("Error checking admin permission:", error);
        setCanApproveRegistration(false);
      } finally {
        setLoading(false);
      }
    };

    checkAdminPermission();
  }, [userId]);

  return (
    <PermissionContext.Provider value={{ canApproveRegistration, loading }}>
      {children}
    </PermissionContext.Provider>
  );
}

export const usePermissions = () => useContext(PermissionContext);
