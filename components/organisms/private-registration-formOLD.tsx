"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { z } from "zod";
import { useForm, UseFormReturn } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";

import {
  Form,
  FormControl,
  FormField,
  FormItem as FormItemUI,
  FormLabel as FormLabelUI,
  FormMessage,
} from "@/components/ui/form";
import { useState, useRef } from "react";
import { FileUpload } from "@/components/molecules/file-upload";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import SignaturePad from "react-signature-canvas";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";

import {
  FileText,
  Building2,
  Landmark,
  FileSignature,
  Check,
  TriangleAlert,
  BadgeCheck,
  UserCheck,
  ChevronsRight,
  ChevronsLeft,
} from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { Separator } from "../ui/separator";

const registrationSchema = z.object({
  // Public Officer Details
  officerFirstName: z
    .string()
    .min(2, "First name must be at least 2 characters"),
  officerLastName: z.string().min(2, "Last name must be at least 2 characters"),
  officerPhone: z.string().regex(/^\d+$/, "Must be a valid number"),
  practitionerFirstName: z
    .string()
    .min(2, "First name must be at least 2 characters"),
  practitionerLastName: z
    .string()
    .min(2, "Last name must be at least 2 characters"),
  termsInPractice: z.number().min(0, "Must be a positive number"),
  medicalBoardRegNumber: z
    .string()
    .min(1, "Medical board registration number is required"),
  regExpiryDate: z.date().nullable(),
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
  // We'll add a registrationId field
  registrationId: z.string().optional(),

  // Step 2: Business Details
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

  // Step 3: Bank Details
  bankName: z.enum(["BSP", "KINA BANK", "WESTPAC", "ANZ"]),
  branchCode: z.string().min(1, "Branch code is required"),
  branchName: z.string().min(2, "Branch name is required"),
  accountNumber: z
    .string()
    .regex(/^\d+$/, "Must contain only numbers")
    .min(6, "Account number must be at least 6 digits")
    .max(10, "Account number must not exceed 10 digits"),
  accountName: z.string().min(2, "Account name is required"),

  // Step 4: Documents
  documents: z.object({
    ipaCertificate: z.any().optional(),
    tinCertificate: z.any().optional(),
    medicalBoardCertificate: z.any().optional(),
  }),

  // Step 5: Signature
  signatureType: z.enum(["draw", "upload"]),
  signature: z.object({
    drawnSignature: z.string().optional(),
    uploadedSignature: z.any().optional(),
  }),
});

// Add this type before the steps array
type Step = {
  title: string;
  icon: React.ElementType;
  description: string;
  subsections: {
    title: string;
    fields: string[];
  }[];
};

const steps: Step[] = [
  {
    title: "Officer",
    icon: UserCheck,
    description: "Public Officer & Medical Practitioner Details",
    subsections: [
      {
        title: "Public Officer",
        fields: ["officerFirstName", "officerLastName", "officerPhone"],
      },
      {
        title: "Medical Practitioner",
        fields: [
          "practitionerFirstName",
          "practitionerLastName",
          "termsInPractice",
          "medicalBoardRegNumber",
          "regExpiryDate",
        ],
      },
      {
        title: "P.O Box",
        fields: ["poBoxName", "poBoxNumber", "poBoxBranch", "poBoxProvince"],
      },
    ],
  },
  {
    title: "Business",
    icon: Building2,
    description: "Service Provider Information",
    subsections: [
      {
        title: "Basic Information",
        fields: [
          "serviceName",
          "businessEmail",
          "businessPhone",
          "inceptionDate",
        ],
      },
      {
        title: "Practice Location",
        fields: [
          "practiceSection",
          "practiceLot",
          "practiceStreet",
          "practiceSuburb",
          "practiceProvince",
          "practiceType",
          "employmentStatus",
          "registeredBusinessName",
          "tinNumber",
          "ipaNumber",
          "businessType",
        ],
      },
    ],
  },
  {
    title: "Bank",
    icon: Landmark,
    description: "Banking Information",
    subsections: [
      {
        title: "Bank Details",
        fields: [
          "bankName",
          "branchCode",
          "branchName",
          "accountNumber",
          "accountName",
        ],
      },
    ],
  },

  {
    title: "Documents",
    icon: FileText,
    description: "Required Certificates",
    subsections: [
      {
        title: "IPA Certificate",
        fields: ["ipaCertificate"],
      },
      {
        title: "TIN Certificate",
        fields: ["tinCertificate"],
      },
      {
        title: "Medical Board Certificate",
        fields: ["medicalBoardCertificate"],
      },
    ],
  },

  {
    title: "Signature",
    icon: FileSignature,
    description: "Sign Registration Form",
    subsections: [
      {
        title: "Signature",
        fields: ["signatureType", "signature"],
      },
    ],
  },
  {
    title: "Verify",
    icon: BadgeCheck,
    description: "Verify Registration",
    subsections: [
      {
        title: "Verify Details",
        fields: ["verifyDetails"],
      },
    ],
  },
];

// Update the helper function to include more detailed validation
const isSubsectionValid = (
  form: any,
  fields: string[],
  formState: any,
  currentStep: number,
  stepIndex: number
): { isValid: boolean; invalidCount: number; isStarted: boolean } => {
  let invalidCount = 0;
  let filledFieldCount = 0;

  for (const field of fields) {
    const value = form.getValues(field);
    const error = formState.errors[field];

    // Check if field has any value
    if (value) {
      filledFieldCount++;
    }

    // Check if field is empty or has validation errors
    if (!value || error) {
      invalidCount++;
    }

    // Special handling for nested fields
    if (field.includes(".")) {
      const [parent, child] = field.split(".");
      const parentValue = form.getValues(parent);
      if (parentValue?.[child]) {
        filledFieldCount++;
      }
      if (!parentValue?.[child]) {
        invalidCount++;
      }
    }
  }

  return {
    isValid: invalidCount === 0,
    invalidCount,
    // Section is considered started if at least one field has been filled
    isStarted: filledFieldCount > 0,
  };
};

// Update the calculateTotalProgress function signature
const calculateTotalProgress = (
  form: any,
  formState: any,
  steps: Step[]
): number => {
  let totalFields = 0;
  let completedFields = 0;

  steps.forEach((step) => {
    step.subsections.forEach((sub) => {
      const { invalidCount, isValid } = isSubsectionValid(
        form,
        sub.fields,
        formState,
        0,
        0
      );
      totalFields += sub.fields.length;
      if (isValid) {
        completedFields += sub.fields.length;
      } else {
        completedFields += sub.fields.length - invalidCount;
      }
    });
  });

  return Math.round((completedFields / totalFields) * 100);
};

export function PrivateRegistrationForm() {
  const [step, setStep] = useState(1);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const form = useForm<z.infer<typeof registrationSchema>>({
    resolver: zodResolver(registrationSchema),
    mode: "onBlur",
    reValidateMode: "onBlur",
    defaultValues: {
      // Public Officer Details
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
      registrationId: undefined,

      // Step 2: Business Details
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
      bankName: undefined,
      branchCode: "",
      branchName: "",
      accountNumber: "",
      accountName: "",
      practiceType: undefined,
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
    },
  });

  const signaturePadRef = useRef<SignaturePad | null>(null);

  const onSubmit = async (data: z.infer<typeof registrationSchema>) => {
    try {
      // Generate a registration ID (you might want to get this from your backend)
      const registrationId = `REG-${Math.random()
        .toString(36)
        .substr(2, 6)
        .toUpperCase()}`;

      // Update the form data with the registration ID
      form.setValue("registrationId", registrationId);

      // Log the complete form data
      console.log({ ...data, registrationId });

      // Set submitted state to true
      setIsSubmitted(true);

      // Show success message with registration ID using Sonner
      toast.success("Registration submitted successfully!", {
        description: `Your Registration Number: ${registrationId}`,
        duration: 5000,
      });

      // You would typically make an API call here to save the data
    } catch (error) {
      console.error(error);
      toast.error("Failed to submit registration", {
        description: "Please try again later",
      });
    }
  };

  const nextStep = () => {
    setStep((prev) => Math.min(prev + 1, 6));
  };

  const prevStep = () => {
    setStep((prev) => Math.max(prev - 1, 1));
  };

  const FormLabel = ({ children }: { children: React.ReactNode }) => {
    return (
      <FormLabelUI className="text-xs font-medium text-gray-700 ml-2">
        {children}
      </FormLabelUI>
    );
  };

  const FormItem = ({ children }: { children: React.ReactNode }) => {
    return <FormItemUI className="space-y-1">{children}</FormItemUI>;
  };

  const renderStep = (
    step: number,
    form: UseFormReturn<z.infer<typeof registrationSchema>>
  ) => {
    switch (step) {
      case 1:
        return (
          <div className="grid gap-4">
            <h2 className="text-lg font-semibold">Public Officer Details</h2>
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="officerFirstName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>First Name</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="John" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="officerLastName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Last Name</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Doe" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="officerPhone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Mobile Phone Number</FormLabel>
                  <FormControl>
                    <Input {...field} type="tel" placeholder="70123456" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <h2 className="text-lg font-semibold mt-6">
              Medical Practitioner Details
            </h2>
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="practitionerFirstName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>First Name</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Jane" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="practitionerLastName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Last Name</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Smith" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-6 gap-4">
              <FormField
                control={form.control}
                name="termsInPractice"
                render={({ field }) => (
                  <FormItem className="col-span-1">
                    <FormLabel>Terms in Practice</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        type="number"
                        min="0"
                        onChange={(e) =>
                          field.onChange(parseInt(e.target.value))
                        }
                        placeholder="5"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="medicalBoardRegNumber"
                render={({ field }) => (
                  <FormItem className="col-span-2">
                    <FormLabel>Medical Board Registration Number</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="MB12345" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="regExpiryDate"
                render={({ field }) => (
                  <FormItem className="col-span-3">
                    <FormLabel>Registration Expiry Date</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        type="date"
                        min={new Date().toISOString().split("T")[0]}
                        value={
                          field.value instanceof Date
                            ? field.value.toISOString().split("T")[0]
                            : ""
                        }
                        onChange={(e) => {
                          const date = e.target.value
                            ? new Date(e.target.value)
                            : null;
                          field.onChange(date);
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <h2 className="text-lg font-semibold mt-6">P.O Box Details</h2>
            <FormField
              control={form.control}
              name="poBoxName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>P.O Box Name</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Medical Center" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-3 gap-4">
              <FormField
                control={form.control}
                name="poBoxNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>P.O Box Number</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="123" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="poBoxBranch"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>P.O Box Branch</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Main Branch" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="poBoxProvince"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Province</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select a province" />
                      </SelectTrigger>
                      <SelectContent>
                        {[
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
                        ].map((province) => (
                          <SelectItem key={province} value={province}>
                            {province}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>
        );

      case 2:
        return (
          <div className="grid gap-4">
            <h2 className="text-lg font-semibold">Business Details</h2>
            <FormField
              control={form.control}
              name="serviceName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Service Provider/Medical Center Name</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Healthcare Center" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="businessEmail"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Business Email</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        type="email"
                        placeholder="contact@example.com"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="businessPhone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Business Phone Number</FormLabel>
                    <FormControl>
                      <Input {...field} type="tel" placeholder="70123456" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="inceptionDate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Business Inception Date</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      type="date"
                      max={new Date().toISOString().split("T")[0]}
                      value={
                        field.value instanceof Date
                          ? field.value.toISOString().split("T")[0]
                          : ""
                      }
                      onChange={(e) => {
                        const date = e.target.value
                          ? new Date(e.target.value)
                          : null;
                        field.onChange(date);
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <h3 className="text-md font-semibold mt-4">Practice Location</h3>
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="practiceSection"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Section</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Section" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="practiceLot"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Lot</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Lot" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="practiceStreet"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Street</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Street" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="practiceSuburb"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Suburb</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Suburb" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="practiceProvince"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Province</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select a province" />
                    </SelectTrigger>
                    <SelectContent>
                      {[
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
                      ].map((province) => (
                        <SelectItem key={province} value={province}>
                          {province}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="practiceType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Type of Practice</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select practice type" />
                    </SelectTrigger>
                    <SelectContent>
                      {[
                        "Hospital - public",
                        "Hospital - private",
                        "Practice - general practice",
                        "Practice - other private practice",
                        "Educational institution",
                        "Residential care facility",
                        "Other community health care service",
                        "Mobile",
                      ].map((type) => (
                        <SelectItem key={type} value={type}>
                          {type}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="employmentStatus"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Employment Status for this Location</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Full-time" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="registeredBusinessName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Registered Business Name</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Business Legal Name" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="tinNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>TIN Number</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="123456789" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="ipaNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>IPA Registration Number</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="IPA12345" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="businessType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Business Type</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select business type" />
                    </SelectTrigger>
                    <SelectContent>
                      {[
                        "Partnership",
                        "Company",
                        "National Government",
                        "Provincial Government",
                        "District Local Level Government",
                      ].map((type) => (
                        <SelectItem key={type} value={type}>
                          {type}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        );

      case 3:
        return (
          <div className="grid gap-4">
            <h2 className="text-lg font-semibold">Bank Details</h2>
            <FormField
              control={form.control}
              name="bankName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Bank Name</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select a bank" />
                    </SelectTrigger>
                    <SelectContent>
                      {["BSP", "KINA BANK", "WESTPAC", "ANZ"].map((bank) => (
                        <SelectItem key={bank} value={bank}>
                          {bank}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="branchCode"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Branch Code</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="001" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="branchName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Branch Name</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Port Moresby" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="accountNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Account Number</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      type="text"
                      placeholder="1234567890"
                      maxLength={10}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="accountName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Account Name</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="HEALTHCARE CENTER LTD" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        );

      case 4:
        return (
          <div className="grid gap-4">
            <h2 className="text-lg font-semibold">Required Documents</h2>

            <FormField
              control={form.control}
              name="documents.ipaCertificate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>IPA Certificate</FormLabel>
                  <FormControl>
                    <FileUpload
                      value={field.value}
                      onChange={field.onChange}
                      accept=".pdf,.jpg,.jpeg,.png"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="documents.tinCertificate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>TIN Certificate</FormLabel>
                  <FormControl>
                    <FileUpload
                      value={field.value}
                      onChange={field.onChange}
                      accept=".pdf,.jpg,.jpeg,.png"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="documents.medicalBoardCertificate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Medical Board Registration Certificate</FormLabel>
                  <FormControl>
                    <FileUpload
                      value={field.value}
                      onChange={field.onChange}
                      accept=".pdf,.jpg,.jpeg,.png"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        );

      case 5:
        return (
          <div className="grid gap-4">
            <h2 className="text-lg font-semibold">Signature</h2>

            <FormField
              control={form.control}
              name="signatureType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Signature Type</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select signature type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="draw">Sign on Screen</SelectItem>
                      <SelectItem value="upload">Upload File</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {form.watch("signatureType") === "draw" ? (
              <FormField
                control={form.control}
                name="signature.drawnSignature"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Draw Signature</FormLabel>
                    <FormControl>
                      <div className="border rounded-md p-4">
                        <SignaturePad
                          ref={(ref) => {
                            if (ref) {
                              signaturePadRef.current = ref;
                            }
                          }}
                          canvasProps={{
                            className:
                              "signature-canvas w-full h-[200px] border",
                          }}
                          onEnd={() => {
                            if (signaturePadRef.current) {
                              const dataUrl =
                                signaturePadRef.current.toDataURL();
                              field.onChange(dataUrl);
                            }
                          }}
                        />
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          className="mt-2"
                          onClick={() => {
                            if (signaturePadRef.current) {
                              signaturePadRef.current.clear();
                              field.onChange("");
                            }
                          }}
                        >
                          Clear
                        </Button>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            ) : (
              <FormField
                control={form.control}
                name="signature.uploadedSignature"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Upload Signature</FormLabel>
                    <FormControl>
                      <FileUpload
                        value={field.value}
                        onChange={field.onChange}
                        accept=".jpg,.jpeg,.png"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}
          </div>
        );

      case 6:
        return (
          <div className="grid gap-6">
            <h2 className="text-lg font-semibold">Verify Your Information</h2>
            {isSubmitted && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
                <div className="flex items-center gap-2">
                  <Check className="h-5 w-5 text-green-500" />
                  <h3 className="font-medium text-green-900">
                    Registration Successful
                  </h3>
                </div>
                <p className="mt-2 text-green-700">
                  Registration Number: {form.getValues("registrationId")}
                </p>
              </div>
            )}
            {isSubmitted && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
                <div className="flex items-center gap-2">
                  <Check className="h-5 w-5 text-green-500" />
                  <h3 className="font-medium text-green-900">
                    Registration Successful
                  </h3>
                </div>
                <p className="mt-2 text-green-700">
                  Registration Number: {form.getValues("registrationId")}
                </p>
              </div>
            )}

            <section className="grid gap-4">
              <h3 className="font-medium">Public Officer Details</h3>
              <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
                <div>
                  <span className="text-muted-foreground">Name:</span>
                  <p>{`${form.getValues("officerFirstName")} ${form.getValues(
                    "officerLastName"
                  )}`}</p>
                </div>
                <div>
                  <span className="text-muted-foreground">Phone:</span>
                  <p>{form.getValues("officerPhone")}</p>
                </div>
              </div>
            </section>

            <section className="grid gap-4">
              <h3 className="font-medium">Medical Practitioner Details</h3>
              <div className="grid grid-cols-3 gap-x-4 gap-y-2 text-sm">
                <div>
                  <span className="text-muted-foreground">Name:</span>
                  <p>{`${form.getValues(
                    "practitionerFirstName"
                  )} ${form.getValues("practitionerLastName")}`}</p>
                </div>
                <div>
                  <span className="text-muted-foreground">
                    Terms in Practice:
                  </span>
                  <p>{form.getValues("termsInPractice")} years</p>
                </div>
                <div>
                  <span className="text-muted-foreground">
                    Medical Board Registration:
                  </span>
                  <p>{form.getValues("medicalBoardRegNumber")}</p>
                </div>
                <div>
                  <span className="text-muted-foreground">
                    Registration Expiry:
                  </span>
                  <p>{form.getValues("regExpiryDate")?.toLocaleDateString()}</p>
                </div>
              </div>
            </section>

            <section className="grid gap-4">
              <h3 className="font-medium">P.O Box Details</h3>
              <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
                <div>
                  <span className="text-muted-foreground">Name:</span>
                  <p>{form.getValues("poBoxName")}</p>
                </div>
                <div>
                  <span className="text-muted-foreground">Number:</span>
                  <p>{form.getValues("poBoxNumber")}</p>
                </div>
                <div>
                  <span className="text-muted-foreground">Branch:</span>
                  <p>{form.getValues("poBoxBranch")}</p>
                </div>
                <div>
                  <span className="text-muted-foreground">Province:</span>
                  <p>{form.getValues("poBoxProvince")}</p>
                </div>
              </div>
            </section>

            <section className="grid gap-4">
              <h3 className="font-medium">Business Details</h3>
              <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
                <div>
                  <span className="text-muted-foreground">
                    Service Provider Name:
                  </span>
                  <p>{form.getValues("serviceName")}</p>
                </div>
                <div>
                  <span className="text-muted-foreground">Business Type:</span>
                  <p>{form.getValues("businessType")}</p>
                </div>
                <div>
                  <span className="text-muted-foreground">Practice Type:</span>
                  <p>{form.getValues("practiceType")}</p>
                </div>
                <div>
                  <span className="text-muted-foreground">Email:</span>
                  <p>{form.getValues("businessEmail")}</p>
                </div>
                <div>
                  <span className="text-muted-foreground">Phone:</span>
                  <p>{form.getValues("businessPhone")}</p>
                </div>
                <div>
                  <span className="text-muted-foreground">Inception Date:</span>
                  <p>{form.getValues("inceptionDate")?.toLocaleDateString()}</p>
                </div>
              </div>
            </section>

            <section className="grid gap-4">
              <h3 className="font-medium">Bank Details</h3>
              <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
                <div>
                  <span className="text-muted-foreground">Bank Name:</span>
                  <p>{form.getValues("bankName")}</p>
                </div>
                <div>
                  <span className="text-muted-foreground">Branch:</span>
                  <p>{form.getValues("branchName")}</p>
                </div>
                <div>
                  <span className="text-muted-foreground">Account Number:</span>
                  <p>{form.getValues("accountNumber")}</p>
                </div>
                <div>
                  <span className="text-muted-foreground">Account Name:</span>
                  <p>{form.getValues("accountName")}</p>
                </div>
              </div>
            </section>

            <section className="grid gap-4">
              <h3 className="font-medium">Documents & Signature</h3>
              <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
                <div>
                  <span className="text-muted-foreground">
                    IPA Certificate:
                  </span>
                  <p>
                    {form.getValues("documents.ipaCertificate")
                      ? "Uploaded"
                      : "Not uploaded"}
                  </p>
                </div>
                <div>
                  <span className="text-muted-foreground">
                    TIN Certificate:
                  </span>
                  <p>
                    {form.getValues("documents.tinCertificate")
                      ? "Uploaded"
                      : "Not uploaded"}
                  </p>
                </div>
                <div>
                  <span className="text-muted-foreground">
                    Medical Board Certificate:
                  </span>
                  <p>
                    {form.getValues("documents.medicalBoardCertificate")
                      ? "Uploaded"
                      : "Not uploaded"}
                  </p>
                </div>
                <div>
                  <span className="text-muted-foreground">Signature Type:</span>
                  <p>{form.getValues("signatureType")}</p>
                </div>
              </div>
            </section>
          </div>
        );
    }
  };

  return (
    <div className="flex w-full gap-4 h-[calc(100vh-theme(spacing.24))]">
      <div className="w-1/4 min-w-[250px]">
        <div className="sticky top-4">
          <div className="rounded-lg border bg-muted text-card-foreground shadow animate-slide-left-fade-in">
            <div className="p-4 flex flex-col gap-4">
              <div className="flex flex-col gap-1">
                <h3 className="font-bold text-xl">Registration Form</h3>
                <div className="flex items-center gap-1">
                  <ChevronsRight className="w-3 h-3 text-muted-foreground" />
                  <Building2 className="w-3 h-3 text-muted-foreground" />
                  <h4 className="text-sm font-medium">
                    Private Service Provider
                  </h4>
                </div>
              </div>

              <Separator className="my-1" />

              <div className="space-y-2">
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>Progress</span>
                  <span>
                    {calculateTotalProgress(form, form.formState, steps)}%
                  </span>
                </div>
                <Progress
                  value={calculateTotalProgress(form, form.formState, steps)}
                  className="h-2 transition-all duration-300"
                />
              </div>
              <p className="text-xs text-muted-foreground">
                Please complete all of the fields in the form before
                verification and submission.
              </p>
              <Separator className="my-1" />

              <div className="space-y-0">
                {steps.map((s, i) => (
                  <button
                    key={s.title}
                    onClick={() => setStep(i + 1)}
                    className={cn(
                      "flex w-full items-start gap-3 rounded-md p-2 text-sm transition-colors",
                      step === i + 1
                        ? "bg-primary text-primary-foreground"
                        : "hover:bg-muted",
                      step > i + 1 && "text-muted-foreground"
                    )}
                  >
                    <div className="flex flex-col items-start gap-2 w-full">
                      <div className="text-sm font-semibold flex items-center gap-1 w-full">
                        <s.icon className="w-3.5 h-3.5" />
                        {s.title}
                      </div>

                      <div className="flex flex-col items-start w-full space-y-1">
                        {s.subsections.map((sub) => {
                          const { isValid, invalidCount, isStarted } =
                            isSubsectionValid(
                              form,
                              sub.fields,
                              form.formState,
                              step,
                              i + 1
                            );

                          const showWarning =
                            (step > i + 1 || (step < i + 1 && isStarted)) &&
                            !isValid;

                          return (
                            <div
                              key={sub.title}
                              className="text-xs text-muted-foreground flex items-center justify-between w-full text-left"
                            >
                              <div className="flex items-center gap-1">
                                {sub.title}
                              </div>
                              <div className="text-xs font-normal flex items-center gap-1">
                                {isValid ? (
                                  <Check className="w-3.5 h-3.5 text-green-500" />
                                ) : (
                                  <>
                                    {showWarning && (
                                      <TriangleAlert className="w-3.5 h-3.5 text-amber-500" />
                                    )}
                                    <span
                                      className={cn(
                                        showWarning
                                          ? "text-amber-500"
                                          : "text-muted-foreground"
                                      )}
                                    >
                                      {invalidCount}
                                    </span>
                                  </>
                                )}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-col w-full">
        <Card className="flex flex-col animate-slide-right-fade-in">
          <CardContent className="p-6 flex flex-col h-full">
            <div className="flex items-center justify-between">
              <h1 className="text-2xl font-bold">{steps[step - 1].title}</h1>
              <div className="flex justify-between items-center gap-2">
                {step > 1 && (
                  <Button
                    type="button"
                    onClick={prevStep}
                    variant="ghost"
                    className="gap-1"
                  >
                    <ChevronsLeft className="w-3 h-3" />
                    {steps[step - 2].title}
                  </Button>
                )}
                <div className="ml-auto">
                  {step < 6 ? (
                    <Button type="button" variant="default" onClick={nextStep}>
                      <ChevronsRight className="w-3 h-3" />
                      {steps[step].title}
                    </Button>
                  ) : (
                    <Button type="submit" onClick={form.handleSubmit(onSubmit)}>
                      Submit
                    </Button>
                  )}
                </div>
              </div>
            </div>
            <Separator className="my-6" />

            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                key={step}
                className="flex flex-col animate-slide-left-fade-in"
              >
                <ScrollArea className="h-full max-h-[calc(100vh-260px)] w-full">
                  {renderStep(step, form)}
                </ScrollArea>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
