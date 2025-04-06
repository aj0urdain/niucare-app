import { create } from "zustand";
import { useEmployeeStore } from "./employee-store";

interface ClaimFormStore {
  formData: {
    employeeNumber: string;
    claimType: string;
    amount: number;
    description: string;
    files: Array<{ id: string; name: string; type: string; size: number }>;
  };
  setFormData: (data: Partial<ClaimFormStore["formData"]>) => void;
  resetForm: () => void;
}

const initialFormData = {
  employeeNumber: "",
  claimType: "",
  amount: 0,
  description: "",
  files: [],
};

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
