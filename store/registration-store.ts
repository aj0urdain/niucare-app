import { create } from "zustand";
import { z } from "zod";

export const registrationSchema = z.object({
  // Public Officer Details
  officerFirstName: z
    .string()
    .min(2, "First name must be at least 2 characters"),
  officerLastName: z.string().min(2, "Last name must be at least 2 characters"),
  officerPhone: z.string().min(8, "Phone number must be at least 8 characters"),

  // Medical Practitioner Details
  practitionerFirstName: z
    .string()
    .min(2, "First name must be at least 2 characters"),
  practitionerLastName: z
    .string()
    .min(2, "Last name must be at least 2 characters"),
  termsInPractice: z.number().min(0, "Terms must be a positive number"),
  medicalBoardRegNumber: z.string().min(1, "Registration number is required"),
  regExpiryDate: z.date().nullable(),

  // P.O Box Details
  poBoxName: z.string().min(2, "P.O Box name is required"),
  poBoxNumber: z.string().min(1, "P.O Box number is required"),
  poBoxBranch: z.string().min(2, "P.O Box branch is required"),
  poBoxProvince: z.enum([
    "Central",
    "Chimbu (Simbu)",
    "Eastern Highlands",
    "East New Britain",
    "East Sepik",
    "Enga",
    "Gulf",
    "Madang",
    "Manus",
    "Milne Bay",
    "Morobe",
    "New Ireland",
    "Oro (Northern)",
    "Bougainville",
    "Southern Highlands",
    "Western (Fly)",
    "Western Highlands",
    "West New Britain",
    "Sandaun (West Sepik)",
    "National Capital District",
    "Hela",
    "Jiwaka",
  ]),

  // Business Details
  serviceName: z.string().min(2, "Service provider name is required"),
  businessEmail: z.string().email("Invalid email address"),
  businessPhone: z.string().regex(/^\d+$/, "Must be a valid number"),
  inceptionDate: z
    .date()
    .max(new Date(), "Date must be in the past")
    .nullable(),
  practiceSection: z.string().min(1, "Practice section is required"),
  practiceLot: z.string().min(1, "Practice lot is required"),
  practiceStreet: z.string().min(1, "Practice street is required"),
  practiceSuburb: z.string().min(1, "Practice suburb is required"),
  practiceProvince: z.enum([
    "Central",
    "Chimbu (Simbu)",
    "Eastern Highlands",
    "East New Britain",
    "East Sepik",
    "Enga",
    "Gulf",
    "Madang",
    "Manus",
    "Milne Bay",
    "Morobe",
    "New Ireland",
    "Oro (Northern)",
    "Bougainville",
    "Southern Highlands",
    "Western (Fly)",
    "Western Highlands",
    "West New Britain",
    "Sandaun (West Sepik)",
    "National Capital District",
    "Hela",
    "Jiwaka",
  ]),
  employmentStatus: z.string().min(1, "Employment status is required"),
  registeredBusinessName: z
    .string()
    .min(2, "Registered business name is required"),
  tinNumber: z.string().min(1, "TIN number is required"),
  ipaNumber: z.string().min(1, "IPA registration number is required"),
  businessType: z.enum([
    "Partnership",
    "Company",
    "National Government",
    "Provincial Government",
    "District Local Level Government",
  ]),
  practiceType: z.enum([
    "Hospital - public",
    "Hospital - private",
    "Practice - general practice",
    "Practice - other private practice",
    "Educational institution",
    "Residential care facility",
    "Other community health care service",
    "Mobile",
  ]),

  // Bank Details
  bankName: z.enum(["BSP", "KINA BANK", "WESTPAC", "ANZ"]),
  branchCode: z.string().min(1, "Branch code is required"),
  branchName: z.string().min(2, "Branch name is required"),
  accountNumber: z
    .string()
    .regex(/^\d+$/, "Must contain only numbers")
    .min(6, "Account number must be at least 6 digits")
    .max(10, "Account number must not exceed 10 digits"),
  accountName: z.string().min(2, "Account name is required"),

  // Documents
  documents: z.object({
    ipaCertificate: z.any().optional(),
    tinCertificate: z.any().optional(),
    medicalBoardCertificate: z.any().optional(),
  }),

  // Signature
  signatureType: z.enum(["draw", "upload"]),
  signature: z.object({
    drawnSignature: z.string().optional(),
    uploadedSignature: z.any().optional(),
  }),
});

export type RegistrationData = z.infer<typeof registrationSchema>;

interface RegistrationStore {
  data: Partial<RegistrationData>;
  errors: Record<keyof RegistrationData, string | undefined>;
  setField: <K extends keyof RegistrationData>(
    field: K,
    value: RegistrationData[K]
  ) => void;
  validateField: <K extends keyof RegistrationData>(field: K) => void;
  validateAll: () => boolean;
  reset: () => void;
  loadDraft: (draft: any) => void;
}

const INITIAL_STATE: Partial<RegistrationData> = {
  officerFirstName: "",
  officerLastName: "",
  officerPhone: "",
  practitionerFirstName: "",
  practitionerLastName: "",
  termsInPractice: 0,
  medicalBoardRegNumber: "",
  regExpiryDate: null,
  poBoxName: "",
  poBoxNumber: "",
  poBoxBranch: "",
  poBoxProvince: undefined,
  serviceName: "",
  businessEmail: "",
  businessPhone: "",
  inceptionDate: null,
  practiceSection: "",
  practiceLot: "",
  practiceStreet: "",
  practiceSuburb: "",
  practiceProvince: undefined,
  employmentStatus: "",
  registeredBusinessName: "",
  tinNumber: "",
  ipaNumber: "",
  businessType: undefined,
  practiceType: undefined,
  bankName: undefined,
  branchCode: "",
  branchName: "",
  accountNumber: "",
  accountName: "",
  documents: {
    ipaCertificate: null,
    tinCertificate: null,
    medicalBoardCertificate: null,
  },
  signatureType: undefined,
  signature: {
    drawnSignature: "",
    uploadedSignature: null,
  },
};

export const useRegistrationStore = create<RegistrationStore>((set, get) => ({
  data: INITIAL_STATE,
  errors: {} as Record<keyof RegistrationData, string | undefined>,

  setField: (field, value) => {
    set((state) => ({
      data: {
        ...state.data,
        [field]: value,
      },
    }));
    get().validateField(field);
  },

  validateField: (field) => {
    const fieldSchema = registrationSchema.shape[field];
    const value = get().data[field];

    try {
      fieldSchema.parse(value);
      set((state) => ({
        errors: {
          ...state.errors,
          [field]: undefined,
        },
      }));
      return true;
    } catch (error) {
      if (error instanceof z.ZodError) {
        set((state) => ({
          errors: {
            ...state.errors,
            [field]: error.errors[0].message,
          },
        }));
      }
      return false;
    }
  },

  validateAll: () => {
    const result = registrationSchema.safeParse(get().data);
    if (!result.success) {
      const errors = result.error.errors.reduce((acc, error) => {
        const path = error.path[0] as keyof RegistrationData;
        acc[path] = error.message;
        return acc;
      }, {} as Record<keyof RegistrationData, string>);

      set({ errors });
      return false;
    }
    return true;
  },

  reset: () => {
    set({ data: INITIAL_STATE, errors: {} });
  },

  loadDraft: (draft) => {
    if (!draft) return;

    set((state) => ({
      data: {
        ...state.data,
        officerFirstName: draft.public_officer_firstname || "",
        officerLastName: draft.public_officer_lastname || "",
        officerPhone: draft.business_Phone_Number || "",
        businessEmail: draft.email || "",
        businessPhone: draft.business_Phone_Number || "",
        inceptionDate: draft.location_Creation_Date,
        practiceSection: draft.practice_Section || "",
        practiceLot: draft.practice_Lot || "",
        practiceStreet: draft.practice_Street || "",
        practiceSuburb: draft.practice_Suburb || "",
        practiceProvince: draft.practice_Province,
        employmentStatus: draft.applicant_Employment_Status || "",
        registeredBusinessName: draft.registered_Business_Name || "",
        documents: {
          tinCertificate: draft.tin_Certificate,
          ipaCertificate: draft.ipa_Certificate,
          medicalBoardCertificate: draft.medical_Certificate,
        },
        ipaNumber: draft.ipa_Registration_Number || "",
        businessType: draft.business_Type,
        serviceName: draft.practice_Name || "",
        practiceType: draft.ptype,
        bankName: draft.bank,
        branchCode: draft.branch_Number || "",
        branchName: draft.branch_Name || "",
        accountNumber: draft.account_Number || "",
        accountName: draft.account_Name || "",
        poBoxName: draft.pbox_Name || "",
        poBoxNumber: draft.pbox_Number || "",
        poBoxBranch: draft.pbox_Branch || "",
        poBoxProvince: draft.pbox_Province,
      },
    }));
  },
}));
