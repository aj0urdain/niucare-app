/**
 * @file employee-store.ts
 * @description Zustand store for managing employee data and related operations
 * @author Aaron J. Girton - https://github.com/aj0urdain
 * @created 2025
 */

import { create } from "zustand";
import { PolicyHolder } from "@/lib/hooks/usePolicyHolder";
import { ApolloClient, NormalizedCacheObject } from "@apollo/client";
import {
  GET_POLICY_HOLDER_BY_EMPLOYEE_NO,
  GET_HAS_BANK_DETAILS,
} from "@/lib/graphql/queries";

/**
 * Interface for the employee store state and actions
 * @interface EmployeeStore
 * @property {string | null} employeeNumber - Current employee number
 * @property {function} setEmployeeNumber - Set the employee number
 * @property {function} clearEmployeeNumber - Clear the employee number
 * @property {PolicyHolder | null} employeeData - Current employee data
 * @property {function} setEmployeeData - Set the employee data
 * @property {function} clearEmployeeData - Clear the employee data
 * @property {function} refetchEmployeeData - Refetch employee data from the server
 * @property {function} refetchBankDetails - Refetch bank details from the server
 * @property {function} refetchAllEmployeeData - Refetch all employee data
 */
interface EmployeeStore {
  employeeNumber: string | null;
  setEmployeeNumber: (number: string | null) => void;
  clearEmployeeNumber: () => void;

  employeeData: PolicyHolder | null;
  setEmployeeData: (data: PolicyHolder | null) => void;
  clearEmployeeData: () => void;

  refetchEmployeeData: (
    employeeNo: string,
    client: ApolloClient<NormalizedCacheObject>
  ) => Promise<void>;
  refetchBankDetails: (
    employeeNo: string,
    client: ApolloClient<NormalizedCacheObject>
  ) => Promise<void>;
  refetchAllEmployeeData: (
    employeeNo: string,
    client: ApolloClient<NormalizedCacheObject>
  ) => Promise<void>;
}

/**
 * Zustand store for managing employee data
 * @returns {EmployeeStore} Store instance with state and actions
 */
export const useEmployeeStore = create<EmployeeStore>((set, get) => ({
  // employeeNumber
  employeeNumber: null,
  setEmployeeNumber: (number) => set({ employeeNumber: number }),
  clearEmployeeNumber: () => set({ employeeNumber: null }),

  // employeeData
  employeeData: null,
  setEmployeeData: (data) => set({ employeeData: data }),
  clearEmployeeData: () => set({ employeeData: null }),

  // Refetch functions
  refetchEmployeeData: async (
    employeeNo: string,
    client: ApolloClient<NormalizedCacheObject>
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

  refetchBankDetails: async (
    employeeNo: string,
    client: ApolloClient<NormalizedCacheObject>
  ) => {
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
    client: ApolloClient<NormalizedCacheObject>
  ) => {
    const store = get();
    await store.refetchEmployeeData(employeeNo, client);
    await store.refetchBankDetails(employeeNo, client);
  },
}));
