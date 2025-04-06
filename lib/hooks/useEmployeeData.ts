import { useApolloClient } from "@apollo/client";
import { useEmployeeStore } from "@/stores/employee-store";
import {
  GET_POLICY_HOLDER_BY_EMPLOYEE_NO,
  GET_HAS_BANK_DETAILS,
} from "@/lib/graphql/queries";

export function useEmployeeData() {
  const client = useApolloClient();
  const { employeeNumber, setEmployeeData } = useEmployeeStore();

  const refetchEmployeeData = async () => {
    if (!employeeNumber) return;

    try {
      // Get policy holder data
      const { data: policyHolderData } = await client.query({
        query: GET_POLICY_HOLDER_BY_EMPLOYEE_NO,
        variables: { employeeNo: employeeNumber },
      });

      if (policyHolderData?.policyHolderByEmployeeNo?.[0]) {
        const employeeData = policyHolderData.policyHolderByEmployeeNo[0];

        // Get bank details
        const { data: bankData } = await client.query({
          query: GET_HAS_BANK_DETAILS,
          variables: { employeeNo: employeeNumber },
        });

        // Update store with both policy holder and bank details
        setEmployeeData({
          ...employeeData,
          hasBankDetails: bankData.hasBankDetails,
        });
      }
    } catch (error) {
      console.error("Error refetching employee data:", error);
    }
  };

  return {
    refetchEmployeeData,
  };
}
