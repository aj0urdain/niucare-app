import { Card, CardTitle, CardHeader, CardContent } from "@/components/ui/card";
import {
  Building2,
  ChevronsRight,
  UserCheck,
  Landmark,
  FileText,
  FileSignature,
  BadgeCheck,
  Check,
  TriangleAlert,
  ChevronsLeft,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState, useEffect, useCallback, useMemo } from "react";
import { toast } from "sonner";
import debounce from "lodash/debounce";
import {
  Form,
  FormField,
  FormItem as FormItemUI,
  FormLabel as FormLabelUI,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, UseFormReturn } from "react-hook-form";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { ScrollArea } from "../ui/scroll-area";
import { Separator } from "../ui/separator";
import { Progress } from "../ui/progress";
import { cn } from "@/lib/utils";
import { ADD_OR_UPDATE_DRAFT } from "@/lib/graphql/mutations";
import { useMutation } from "@apollo/client";
import { useUserProfileStore } from "@/stores/user-profile-store";

const registrationSchema = z.object({
  // Public Officer Details
  userId: z.string().optional(),
  public_officer_firstname: z
    .string()
    .min(2, "First name must be at least 2 characters"),
  public_officer_lastname: z
    .string()
    .min(2, "Last name must be at least 2 characters"),
  mobile_Phone_Number: z.string().regex(/^\d+$/, "Must be a valid number"),
  medical_Practitioner_firstname: z
    .string()
    .min(2, "First name must be at least 2 characters"),
  medical_Practitioner_lastname: z
    .string()
    .min(2, "Last name must be at least 2 characters"),
  applicantsTermsInPractice: z.number().min(0, "Must be a positive number"),
  mb_Registration_Number: z
    .string()
    .min(1, "Medical board registration number is required"),
  rn_Expiry: z.date().nullable(),
  pbox_Name: z.string().min(2, "P.O Box name is required"),
  pbox_Number: z.string().min(1, "P.O Box number is required"),
  pbox_Branch: z.string().min(2, "P.O Box branch is required"),
  pbox_Province: z.enum([
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
  practice_Name: z.string().min(2, "Service provider name is required"),
  email: z.string().email("Invalid email address"),
  business_Phone_Number: z.string().regex(/^\d+$/, "Must be a valid number"),
  location_Creation_Date: z
    .date()
    .max(new Date(), "Date must be in the past")
    .nullable(),
  practice_Section: z.string().min(1, "Practice section is required"),
  practice_Lot: z.string().min(1, "Practice lot is required"),
  practice_Street: z.string().min(1, "Practice street is required"),
  practice_Suburb: z.string().min(1, "Practice suburb is required"),
  practice_Province: z.enum([
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
  applicant_Employment_Status: z
    .string()
    .min(1, "Employment status is required"),
  registered_Business_Name: z
    .string()
    .min(2, "Registered business name is required"),
  ipa_Registration_Number: z
    .string()
    .min(1, "IPA registration number is required"),
  business_Type: z.enum([
    "Partnership",
    "Company",
    "National Government",
    "Provincial Government",
    "District Local Level Government",
  ]),
  premises: z.string().min(1, "Premises type is required"),
  ptype: z.enum(["private", "public"]),

  // Bank Details
  bank: z.enum(["BSP", "KINA BANK", "WESTPAC", "ANZ"]),
  branch_Number: z.string().min(1, "Branch code is required"),
  branch_Name: z.string().min(2, "Branch name is required"),
  account_Number: z
    .string()
    .regex(/^\d+$/, "Must contain only numbers")
    .min(6, "Account number must be at least 6 digits")
    .max(10, "Account number must not exceed 10 digits"),
  account_Name: z.string().min(2, "Account name is required"),

  // Documents
  ipa_Certificate: z.any().optional(),
  tin_Certificate: z.any().optional(),
  medical_Certificate: z.any().optional(),

  // Signature
  medical_Practitioner_Signiture: z.string().optional(),

  // Metadata
  created_Date: z.date().optional(),
  updated_Date: z.date().optional(),
  status: z.string().optional(),
  luhnRegistrationNumber: z.string().optional(),
  bucket: z.string().optional(),
  reason: z.string().optional(),
  isPsnaProvider: z.boolean().optional(),
});

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
              name="public_officer_firstname"
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
              name="public_officer_lastname"
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
            name="mobile_Phone_Number"
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

          <h2 className="font-semibold mt-6">Medical Practitioner Details</h2>
          <div className="grid grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="medical_Practitioner_firstname"
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
              name="medical_Practitioner_lastname"
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
              name="applicantsTermsInPractice"
              render={({ field }) => (
                <div className="col-span-2">
                  <FormItem>
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
                </div>
              )}
            />

            <FormField
              control={form.control}
              name="mb_Registration_Number"
              render={({ field }) => (
                <div className="col-span-2">
                  <FormItem>
                    <FormLabel>Medical Board Registration Number</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="MB12345" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                </div>
              )}
            />

            <FormField
              control={form.control}
              name="rn_Expiry"
              render={({ field }) => (
                <div className="col-span-2">
                  <FormItem>
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
                </div>
              )}
            />
          </div>

          <h2 className="text-lg font-semibold mt-6">P.O Box Details</h2>
          <FormField
            control={form.control}
            name="pbox_Name"
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
              name="pbox_Number"
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
              name="pbox_Branch"
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
              name="pbox_Province"
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
      return <div>Step 2</div>;
    default:
      return <div>Step 1</div>;
  }
};

const createDebouncedSave = (
  saveFn: (values: z.infer<typeof registrationSchema>) => void
) => debounce(saveFn, 2000);

type Province =
  | "Central"
  | "Chimbu (Simbu)"
  | "Eastern Highlands"
  | "East New Britain"
  | "East Sepik"
  | "Enga"
  | "Gulf"
  | "Madang"
  | "Manus"
  | "Milne Bay"
  | "Morobe"
  | "New Ireland"
  | "Oro (Northern)"
  | "Bougainville"
  | "Southern Highlands"
  | "Western (Fly)"
  | "Western Highlands"
  | "West New Britain"
  | "Sandaun (West Sepik)"
  | "National Capital District"
  | "Hela"
  | "Jiwaka";

type BusinessType =
  | "Partnership"
  | "Company"
  | "National Government"
  | "Provincial Government"
  | "District Local Level Government";

type BankType = "BSP" | "KINA BANK" | "WESTPAC" | "ANZ";

type PracticeType = "private" | "public";

type Draft = {
  id?: string;
  userId?: string;
  public_officer_firstname?: string;
  public_officer_lastname?: string;
  mobile_Phone_Number?: string;
  medical_Practitioner_firstname?: string;
  medical_Practitioner_lastname?: string;
  applicantsTermsInPractice?: string;
  mb_Registration_Number?: string;
  rn_Expiry?: string;
  pbox_Name?: string;
  pbox_Number?: string;
  pbox_Branch?: string;
  pbox_Province?: Province;
  practice_Name?: string;
  email?: string;
  business_Phone_Number?: string;
  location_Creation_Date?: string;
  practice_Section?: string;
  practice_Lot?: string;
  practice_Street?: string;
  practice_Suburb?: string;
  practice_Province?: Province;
  applicant_Employment_Status?: string;
  registered_Business_Name?: string;
  ipa_Registration_Number?: string;
  business_Type?: BusinessType;
  premises?: string;
  bank?: BankType;
  branch_Number?: string;
  branch_Name?: string;
  account_Number?: string;
  account_Name?: string;
  medical_Practitioner_Signiture?: string;
  created_Date?: string;
  updated_Date?: string;
  status?: string;
  ipa_Certificate?: string;
  tin_Certificate?: string;
  medical_Certificate?: string;
  luhnRegistrationNumber?: string;
  ptype?: PracticeType;
  bucket?: string;
  reason?: string;
  isPsnaProvider?: boolean;
};

interface PrivateRegistrationFormProps {
  initialDraft?: Draft;
}

function PrivateRegistrationForm({
  initialDraft,
}: PrivateRegistrationFormProps) {
  const [addOrUpdateDraft] = useMutation(ADD_OR_UPDATE_DRAFT);
  const user = useUserProfileStore((state) => state.user);
  const [step, setStep] = useState(1);
  const [previousFormValues, setPreviousFormValues] = useState<z.infer<
    typeof registrationSchema
  > | null>(null);

  const form = useForm<z.infer<typeof registrationSchema>>({
    resolver: zodResolver(registrationSchema),
    defaultValues: {
      // Public Officer Details
      userId: initialDraft?.userId,
      public_officer_firstname: initialDraft?.public_officer_firstname || "",
      public_officer_lastname: initialDraft?.public_officer_lastname || "",
      mobile_Phone_Number: initialDraft?.mobile_Phone_Number || "",
      medical_Practitioner_firstname:
        initialDraft?.medical_Practitioner_firstname || "",
      medical_Practitioner_lastname:
        initialDraft?.medical_Practitioner_lastname || "",
      applicantsTermsInPractice: initialDraft?.applicantsTermsInPractice
        ? parseInt(initialDraft.applicantsTermsInPractice)
        : 0,
      mb_Registration_Number: initialDraft?.mb_Registration_Number || "",
      rn_Expiry: initialDraft?.rn_Expiry
        ? new Date(initialDraft.rn_Expiry)
        : null,
      pbox_Name: initialDraft?.pbox_Name || "",
      pbox_Number: initialDraft?.pbox_Number || "",
      pbox_Branch: initialDraft?.pbox_Branch || "",
      pbox_Province: initialDraft?.pbox_Province,

      // Business Details
      practice_Name: initialDraft?.practice_Name || "",
      email: initialDraft?.email || "",
      business_Phone_Number: initialDraft?.business_Phone_Number || "",
      location_Creation_Date: initialDraft?.location_Creation_Date
        ? new Date(initialDraft.location_Creation_Date)
        : null,
      practice_Section: initialDraft?.practice_Section || "",
      practice_Lot: initialDraft?.practice_Lot || "",
      practice_Street: initialDraft?.practice_Street || "",
      practice_Suburb: initialDraft?.practice_Suburb || "",
      practice_Province: initialDraft?.practice_Province,
      applicant_Employment_Status:
        initialDraft?.applicant_Employment_Status || "",
      registered_Business_Name: initialDraft?.registered_Business_Name || "",
      ipa_Registration_Number: initialDraft?.ipa_Registration_Number || "",
      business_Type: initialDraft?.business_Type,
      premises: initialDraft?.premises || "",
      ptype: initialDraft?.ptype || "private",

      // Bank Details
      bank: initialDraft?.bank,
      branch_Number: initialDraft?.branch_Number || "",
      branch_Name: initialDraft?.branch_Name || "",
      account_Number: initialDraft?.account_Number || "",
      account_Name: initialDraft?.account_Name || "",

      // Documents
      ipa_Certificate: initialDraft?.ipa_Certificate,
      tin_Certificate: initialDraft?.tin_Certificate,
      medical_Certificate: initialDraft?.medical_Certificate,

      // Signature
      medical_Practitioner_Signiture:
        initialDraft?.medical_Practitioner_Signiture || "",

      // Metadata
      created_Date: initialDraft?.created_Date
        ? new Date(initialDraft.created_Date)
        : undefined,
      updated_Date: initialDraft?.updated_Date
        ? new Date(initialDraft.updated_Date)
        : undefined,
      status: initialDraft?.status,
      luhnRegistrationNumber: initialDraft?.luhnRegistrationNumber,
      bucket: initialDraft?.bucket,
      reason: initialDraft?.reason,
      isPsnaProvider: initialDraft?.isPsnaProvider,
    },
  });

  const saveDraft = useCallback(
    async (values: z.infer<typeof registrationSchema>) => {
      if (!user?.userId) return;
      try {
        await addOrUpdateDraft({
          variables: {
            draft: {
              ...values,
              applicantsTermsInPractice:
                values.applicantsTermsInPractice.toString(),
              userId: user.userId,
              created_Date: new Date().toISOString(),
              updated_Date: new Date().toISOString(),
              isPsnaProvider: false,
              status: "DRAFT",
            },
          },
        });
        console.log("Draft saved successfully");
        toast.success("Draft saved successfully");
        setPreviousFormValues(values);
      } catch (error) {
        console.error("Error saving draft:", error);
        toast.error("Failed to save draft");
      }
    },
    [addOrUpdateDraft, user?.userId]
  );

  const debouncedSaveDraft = useMemo(
    () => createDebouncedSave(saveDraft),
    [saveDraft]
  );

  useEffect(() => {
    const subscription = form.watch((values) => {
      if (!previousFormValues) {
        setPreviousFormValues(values as z.infer<typeof registrationSchema>);
        return;
      }

      // Compare current values with previous values
      const hasChanges = Object.keys(values).some((key) => {
        const currentValue = values[key as keyof typeof values];
        const previousValue =
          previousFormValues[key as keyof typeof previousFormValues];
        return JSON.stringify(currentValue) !== JSON.stringify(previousValue);
      });

      if (hasChanges) {
        debouncedSaveDraft(values as z.infer<typeof registrationSchema>);
      }
    });

    return () => {
      subscription.unsubscribe();
      debouncedSaveDraft.cancel();
    };
  }, [form, previousFormValues, debouncedSaveDraft]);

  const isSubsectionValid = (
    form: UseFormReturn<z.infer<typeof registrationSchema>>,
    fields: string[],
    formState: UseFormReturn<z.infer<typeof registrationSchema>>
  ): { isValid: boolean; invalidCount: number; isStarted: boolean } => {
    let invalidCount = 0;
    let filledFieldCount = 0;

    for (const field of fields) {
      const value = form.getValues(
        field as keyof z.infer<typeof registrationSchema>
      );
      const error =
        formState.formState.errors[
          field as keyof z.infer<typeof registrationSchema>
        ];

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
        const parentValue = form.getValues(
          parent as keyof z.infer<typeof registrationSchema>
        ) as Record<string, unknown>;
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
      isStarted: filledFieldCount > 0,
    };
  };

  // Update the calculateTotalProgress function signature
  const calculateTotalProgress = (
    form: UseFormReturn<z.infer<typeof registrationSchema>>,
    steps: Step[]
  ): number => {
    let totalFields = 0;
    let completedFields = 0;

    steps.forEach((step) => {
      step.subsections.forEach((sub) => {
        const { invalidCount, isValid } = isSubsectionValid(
          form,
          sub.fields,
          form
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
          fields: [
            "public_officer_firstname",
            "public_officer_lastname",
            "mobile_Phone_Number",
          ],
        },
        {
          title: "Medical Practitioner",
          fields: [
            "medical_Practitioner_firstname",
            "medical_Practitioner_lastname",
            "applicantsTermsInPractice",
            "mb_Registration_Number",
            "rn_Expiry",
          ],
        },
        {
          title: "P.O Box",
          fields: ["pbox_Name", "pbox_Number", "pbox_Branch", "pbox_Province"],
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
            "practice_Name",
            "email",
            "business_Phone_Number",
            "location_Creation_Date",
          ],
        },
        {
          title: "Practice Location",
          fields: [
            "practice_Section",
            "practice_Lot",
            "practice_Street",
            "practice_Suburb",
            "practice_Province",
            "ptype",
            "applicant_Employment_Status",
            "registered_Business_Name",
            "ipa_Registration_Number",
            "business_Type",
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
            "bank",
            "branch_Number",
            "branch_Name",
            "account_Number",
            "account_Name",
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
          fields: ["ipa_Certificate"],
        },
        {
          title: "TIN Certificate",
          fields: ["tin_Certificate"],
        },
        {
          title: "Medical Board Certificate",
          fields: ["medical_Certificate"],
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
          fields: ["medical_Practitioner_Signiture"],
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

  const nextStep = () => {
    setStep(step + 1);
  };

  const prevStep = () => {
    setStep(step - 1);
  };

  return (
    <div className="flex w-full gap-4 h-[calc(98vh-theme(spacing.24))]">
      <Card className="w-1/4 min-w-[250px] h-full">
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
                  <span>{calculateTotalProgress(form, steps)}%</span>
                </div>
                <Progress
                  value={calculateTotalProgress(form, steps)}
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
                            isSubsectionValid(form, sub.fields, form);

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
      </Card>
      <Card className="w-3/4 h-full">
        <CardHeader>
          <CardTitle className="text-2xl font-bold flex items-center justify-between">
            <div className="flex items-center justify-between w-full">
              <h1 className="text-2xl font-bold flex items-center gap-2">
                {steps[step - 1].title}
              </h1>
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
                    <Button
                      type="submit"
                      // onClick={form.handleSubmit(onSubmit)}
                    >
                      Submit
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent className="py-0 overflow-y-auto">
          <Form {...form}>
            <ScrollArea className="h-full max-h-[calc(100vh)] w-full">
              {renderStep(step, form)}
            </ScrollArea>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}

export default PrivateRegistrationForm;
