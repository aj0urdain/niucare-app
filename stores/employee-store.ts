import { create } from "zustand";
import { PolicyHolder } from "@/lib/hooks/usePolicyHolder";
import { ApolloClient } from "@apollo/client";
import {
  GET_POLICY_HOLDER_BY_EMPLOYEE_NO,
  GET_HAS_BANK_DETAILS,
} from "@/lib/graphql/queries";

interface EmployeeStore {
  employeeNumber: string | null;
  setEmployeeNumber: (number: string | null) => void;
  clearEmployeeNumber: () => void;

  employeeData: PolicyHolder | null;
  setEmployeeData: (data: PolicyHolder | null) => void;
  clearEmployeeData: () => void;

  // New refetch functions
  refetchEmployeeData: (
    employeeNo: string,
    client: ApolloClient<any>
  ) => Promise<void>;
  refetchBankDetails: (
    employeeNo: string,
    client: ApolloClient<any>
  ) => Promise<void>;
  refetchAllEmployeeData: (
    employeeNo: string,
    client: ApolloClient<any>
  ) => Promise<void>;
}

export const useEmployeeStore = create<EmployeeStore>((set, get) => ({
  // employeeNumber
  employeeNumber: null,
  setEmployeeNumber: (number) => set({ employeeNumber: number }),
  clearEmployeeNumber: () => set({ employeeNumber: null }),

  // employeeData
  employeeData: null,
  setEmployeeData: (data) => set({ employeeData: data }),
  clearEmployeeData: () => set({ employeeData: null }),

  // New refetch functions
  refetchEmployeeData: async (
    employeeNo: string,
    client: ApolloClient<any>
  ) => {
    try {
      const { data } = await client.query({
        query: GET_POLICY_HOLDER_BY_EMPLOYEE_NO,
        variables: { employeeNo },
      });

      if (data?.policyHolderByEmployeeNo?.[0]) {
        set({ employeeData: data.policyHolderByEmployeeNo[0] });
      }
    } catch (error) {
      console.error("Error refetching employee data:", error);
    }
  },

  refetchBankDetails: async (employeeNo: string, client: ApolloClient<any>) => {
    try {
      const { data } = await client.query({
        query: GET_HAS_BANK_DETAILS,
        variables: { employeeNo },
      });

      const currentEmployeeData = get().employeeData;
      if (currentEmployeeData) {
        set({
          employeeData: {
            ...currentEmployeeData,
            hasBankDetails: data.hasBankDetails,
          },
        });
      }
    } catch (error) {
      console.error("Error refetching bank details:", error);
    }
  },

  refetchAllEmployeeData: async (
    employeeNo: string,
    client: ApolloClient<any>
  ) => {
    const store = get();
    await store.refetchEmployeeData(employeeNo, client);
    await store.refetchBankDetails(employeeNo, client);
  },
}));
