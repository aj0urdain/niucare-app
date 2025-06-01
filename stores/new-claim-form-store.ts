/**
 * @file new-claim-form-store.ts
 * @description Zustand store for managing new claim form state and synchronization with employee data
 * @author Aaron J. Girton - https://github.com/aj0urdain
 * @created 2025
 */

import { create } from "zustand";
import { useEmployeeStore } from "./employee-store";

/**
 * Interface for claim form data structure
 * @interface ClaimFormData
 * @property {string} employeeNumber - Employee number associated with the claim
 * @property {string} claimType - Type of claim being submitted
 * @property {number} amount - Claim amount
 * @property {string} description - Description of the claim
 * @property {Array<{id: string; name: string; type: string; size: number}>} files - Array of attached files
 */
interface ClaimFormData {
  employeeNumber: string;
  claimType: string;
  amount: number;
  description: string;
  files: Array<{ id: string; name: string; type: string; size: number }>;
}

/**
 * Interface for the claim form store state and actions
 * @interface ClaimFormStore
 * @property {ClaimFormData} formData - Current form data
 * @property {function} setFormData - Update form data with partial data
 * @property {function} resetForm - Reset form to initial state
 */
interface ClaimFormStore {
  formData: ClaimFormData;
  setFormData: (data: Partial<ClaimFormData>) => void;
  resetForm: () => void;
}

/**
 * Initial state for the claim form
 */
const initialFormData: ClaimFormData = {
  employeeNumber: "",
  claimType: "",
  amount: 0,
  description: "",
  files: [],
};

/**
 * Zustand store for managing new claim form state
 * @returns {ClaimFormStore} Store instance with state and actions
 */
export const useClaimFormStore = create<ClaimFormStore>((set, get) => ({
  formData: initialFormData,
  setFormData: (data) => {
    // Get the current form data
    const currentFormData = get().formData;
    // Merge the new data with current data
    set({ formData: { ...currentFormData, ...data } });
  },
  resetForm: () => set({ formData: initialFormData }),
}));

// Create a subscriber to sync employeeNumber
useEmployeeStore.subscribe((state) => {
  useClaimFormStore.getState().setFormData({
    employeeNumber: state.employeeNumber ?? "",
  });
});
