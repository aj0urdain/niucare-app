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
  Loader2,
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
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import {
  ADD_OR_UPDATE_DRAFT,
  ADD_OR_UPDATE_REGISTRATION,
} from "@/lib/graphql/mutations";
import { GET_DRAFT_BY_USER_ID } from "@/lib/graphql/queries";
import { useMutation } from "@apollo/client";
import { useUserProfileStore } from "@/stores/user-profile-store";
import { FileUpload } from "@/components/molecules/file-upload";
import SignatureUpload from "@/components/molecules/signature-upload";
import { SignaturePreviewCard } from "@/components/molecules/signature-preview-card";
import { useRouter } from "next/navigation";

const registrationSchema = z.object({
  // Public Officer Details
  id: z.string().optional(),
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
  ipa_Certified_Number: z.string().min(1, "IPA certified number is required"),
  business_Type: z.enum([
    "Partnership",
    "Company",
    "National Government",
    "Provincial Government",
    "District Local Level Government",
  ]),
  premises: z.enum([
    "Hospital - public",
    "Hospital - private",
    "Practice - general practice",
    "Practice - other private practice",
    "Educational institution",
    "Residential care facility",
    "Other community health care service",
  ]),
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
  ipa_Certificate: z.string().optional(),
  tin_Certificate: z.string().optional(),
  medical_Certificate: z.string().optional(),

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
  registrationId: z.string().optional(),
  // Signature Type
  signatureType: z.enum(["draw", "upload"]),
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

const createDebouncedSave = (
  saveFn: (values: z.infer<typeof registrationSchema>) => void
) => debounce(saveFn, 2000);

type Draft = {
  id: string;
  userId: string;
  public_officer_firstname: string;
  public_officer_lastname: string;
  ipa_Certified_Number: string;
  mb_Registration_Number: string;
  rn_Expiry: Date;
  applicantsTermsInPractice: string;
  postal_Section: string;
  postal_Lot: string;
  postal_Street: string;
  postal_Suburb: string;
  postal_Province: string;
  business_Phone_Number: string;
  mobile_Phone_Number: string;
  email: string;
  location_Creation_Date: Date;
  practice_Name: string;
  practice_Section: string;
  practice_Lot: string;
  practice_Street: string;
  practice_Suburb: string;
  practice_Province: string;
  location_Phone_Number: string;
  location_Email: string;
  applicant_Employment_Status: string;
  registered_Business_Name: string;
  ipa_Registration_Number: string;
  business_Type: string;
  premises: string;
  bank: string;
  branch_Number: string;
  branch_Name: string;
  account_Number: string;
  account_Name: string;
  medical_Practitioner_firstname: string;
  medical_Practitioner_lastname: string;
  medical_Practitioner_Signiture: string;
  created_Date: Date;
  updated_Date: Date;
  status: string;
  ipa_Certificate: string;
  tin_Certificate: string;
  medical_Certificate: string;
  luhnRegistrationNumber: string;
  registrationId: string;
  ptype: string;
  pbox_Name: string;
  pbox_Number: string;
  pbox_Branch: string;
  pbox_Province: string;
  bucket: string;
  reason: string;
  isPsnaProvider: boolean;
};

interface PrivateRegistrationFormProps {
  initialDraft?: Draft;
}

function PrivateRegistrationForm({
  initialDraft,
}: PrivateRegistrationFormProps) {
  const { user } = useUserProfileStore();
  const [addOrUpdateDraft, { loading: draftLoading, error: draftError }] =
    useMutation(ADD_OR_UPDATE_DRAFT, {
      refetchQueries: [
        {
          query: GET_DRAFT_BY_USER_ID,
          variables: {
            userId: user?.userId,
          },
        },
      ],
      onCompleted: () => {
        toast.success("Draft saved successfully");
      },
    });
  const [
    addOrUpdateRegistration,
    { loading: registrationLoading, error: registrationError },
  ] = useMutation(ADD_OR_UPDATE_REGISTRATION);
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [previousFormValues, setPreviousFormValues] = useState<z.infer<
    typeof registrationSchema
  > | null>(null);

  useEffect(() => {
    console.log(initialDraft);
  }, [initialDraft]);

  useEffect(() => {
    if (draftError) {
      toast.error("Failed to save draft: " + draftError.message);
    }
  }, [draftError]);

  useEffect(() => {
    if (registrationError) {
      toast.error("Registration error: " + registrationError.message);
    }
  }, [registrationError]);

  useEffect(() => {
    if (registrationLoading) {
      toast.loading("Submitting registration...", {
        id: "registration-submission",
      });
    } else {
      toast.dismiss("registration-submission");
    }
  }, [registrationLoading]);

  const form = useForm<
    z.infer<typeof registrationSchema>,
    unknown,
    z.infer<typeof registrationSchema>
  >({
    resolver: zodResolver(registrationSchema),
    defaultValues: {
      // Public Officer Details
      id: initialDraft?.id,
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
      pbox_Province: initialDraft?.pbox_Province as z.infer<
        typeof registrationSchema
      >["pbox_Province"],

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
      practice_Province: initialDraft?.practice_Province as z.infer<
        typeof registrationSchema
      >["practice_Province"],
      applicant_Employment_Status:
        initialDraft?.applicant_Employment_Status || "",
      registered_Business_Name: initialDraft?.registered_Business_Name || "",
      ipa_Registration_Number: initialDraft?.ipa_Registration_Number || "",
      ipa_Certified_Number: initialDraft?.ipa_Certified_Number || "",
      business_Type: initialDraft?.business_Type as z.infer<
        typeof registrationSchema
      >["business_Type"],
      premises: initialDraft?.premises as z.infer<
        typeof registrationSchema
      >["premises"],
      ptype: "private",

      // Bank Details
      bank: initialDraft?.bank as z.infer<typeof registrationSchema>["bank"],
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

      // Signature Type
      signatureType: "draw",

      // Registration ID
      registrationId: initialDraft?.registrationId,
    },
  });

  const saveDraft = useCallback(
    async (values: z.infer<typeof registrationSchema>) => {
      if (!user?.userId) return;
      try {
        // Exclude signatureType from the values sent to the backend
        const valuesToSend = { ...values } as Record<string, unknown>;
        if ("signatureType" in valuesToSend) {
          delete valuesToSend.signatureType;
        }
        await addOrUpdateDraft({
          variables: {
            draft: {
              ...valuesToSend,
              applicantsTermsInPractice:
                values.applicantsTermsInPractice.toString(),
              userId: user.userId,
              isPsnaProvider: false,
              status: "DRAFT",
              ptype: "private",
              registrationId: initialDraft?.registrationId,
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
    [addOrUpdateDraft, user?.userId, initialDraft?.registrationId]
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

        // Debug log for practice_suburb
        if (key === "practice_suburb") {
          console.log("practice_suburb changed:", {
            current: currentValue,
            previous: previousValue,
            hasChange:
              JSON.stringify(currentValue) !== JSON.stringify(previousValue),
          });
        }

        return JSON.stringify(currentValue) !== JSON.stringify(previousValue);
      });

      if (hasChanges) {
        console.log("Form values before save:", values);
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
        );
        if (
          parentValue &&
          typeof parentValue === "object" &&
          child in parentValue
        ) {
          filledFieldCount++;
        }
        if (
          !parentValue ||
          typeof parentValue !== "object" ||
          !(child in parentValue)
        ) {
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

  const isStepComplete = (stepIndex: number): boolean => {
    const step = steps[stepIndex];
    return step.subsections.every((sub) => {
      const { isValid } = isSubsectionValid(form, sub.fields, form);
      return isValid;
    });
  };

  const canAccessStep = (stepIndex: number): boolean => {
    // First 4 steps (Officer, Business, Bank, Documents) are always accessible
    if (stepIndex < 4) return true;

    // For signature step (index 4), check if all previous steps are complete
    if (stepIndex === 4) {
      return [0, 1, 2, 3].every((i) => isStepComplete(i));
    }

    // For verify step (index 5), check if all previous steps AND signature is complete

    if (stepIndex === 5) {
      return isStepComplete(4);
    }

    return true;
  };

  const nextStep = () => {
    if (canAccessStep(step)) {
      setStep(step + 1);
    }
  };

  const prevStep = () => {
    setStep(step - 1);
  };

  const onSubmit = async (values: z.infer<typeof registrationSchema>) => {
    console.log("Form submission started");
    console.log("User ID:", user?.userId);
    console.log("Raw form values:", values);

    if (!user?.userId) {
      toast.error("User not authenticated");
      return;
    }

    try {
      setIsSubmitting(true);

      // Format dates to ISO strings
      const formattedValues = {
        ...values,
        signatureType: undefined,
        registrationId: undefined,
        id: values.registrationId,
        userId: user?.userId,
        applicantsTermsInPractice: values.applicantsTermsInPractice.toString(),
        postal_Section: null,
        postal_Lot: null,
        postal_Street: null,
        postal_Suburb: null,
        postal_Province: null,
        location_Phone_Number: null,
        location_Email: null,
        status: "pending",
        ptype: "private",
        isPsnaProvider: false,
        reason: values.reason,
        practice_Suburb: values.practice_Suburb,
      };

      console.log("Formatted values being sent to mutation:", formattedValues);

      const { data, errors } = await addOrUpdateRegistration({
        variables: {
          reg: formattedValues,
        },
      });

      console.log("Mutation response:", { data, errors });

      if (errors) {
        console.error("Mutation errors:", errors);
        throw new Error(errors[0].message);
      }

      if (!data?.addOrUpdateRegistration?.id) {
        console.error("Registration submission failed - no ID returned");
        throw new Error("Registration submission failed - no ID returned");
      }

      console.log(
        "Registration successful, ID:",
        data.addOrUpdateRegistration.id
      );
      toast.success("Registration submitted successfully");
      router.push("/registration");
    } catch (error) {
      console.error("Error submitting registration:", error);
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Failed to submit registration. Please try again.";
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderStep = (
    step: number,
    form: UseFormReturn<z.infer<typeof registrationSchema>>
  ) => {
    switch (step) {
      case 1:
        return (
          <div className="grid gap-4">
            <h2 className="font-semibold">Public Officer Details</h2>
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

            <h2 className="font-semibold mt-6">P.O Box Details</h2>
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
        return (
          <div className="grid gap-4 animate-slide-down-fade-in">
            <h2 className="text-lg font-semibold">Business Details</h2>
            <FormField
              control={form.control}
              name="practice_Name"
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
                name="email"
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
                name="business_Phone_Number"
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
              name="location_Creation_Date"
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
                name="practice_Section"
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
                name="practice_Lot"
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
                name="practice_Street"
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
                name="practice_Suburb"
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
              name="practice_Province"
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
              name="premises"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Type of Premises</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select premises type" />
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
              name="applicant_Employment_Status"
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
              name="registered_Business_Name"
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
                name="ipa_Certified_Number"
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
                name="ipa_Registration_Number"
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
              name="business_Type"
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
              name="bank"
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
                name="branch_Number"
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
                name="branch_Name"
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
              name="account_Number"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Account Number</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      type="text"
                      placeholder="1234567890"
                      minLength={6}
                      maxLength={10}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="account_Name"
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
          <div className="flex flex-col gap-4">
            <h2 className="text-lg font-semibold">Required Documents</h2>

            <div className="grid grid-cols-2 gap-4 space-y-4">
              <FormField
                control={form.control}
                name="ipa_Certificate"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <FileUpload
                        title="IPA Certificate"
                        value={field.value || null}
                        onChange={(value) => {
                          field.onChange(value);
                          const values = form.getValues();
                          saveDraft(values);
                        }}
                        accept=".pdf,.jpg,.jpeg,.png"
                        onUploadComplete={() => {
                          const values = form.getValues();
                          saveDraft(values);
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="tin_Certificate"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <FileUpload
                        title="TIN Certificate"
                        value={field.value || null}
                        onChange={(value) => {
                          field.onChange(value);
                          const values = form.getValues();
                          saveDraft(values);
                        }}
                        accept=".pdf,.jpg,.jpeg,.png"
                        onUploadComplete={() => {
                          const values = form.getValues();
                          saveDraft(values);
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="medical_Certificate"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <FileUpload
                        title="Medical Board Registration Certificate"
                        value={field.value || null}
                        onChange={(value) => {
                          field.onChange(value);
                          const values = form.getValues();
                          saveDraft(values);
                        }}
                        accept=".pdf,.jpg,.jpeg,.png"
                        onUploadComplete={() => {
                          const values = form.getValues();
                          saveDraft(values);
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>
        );

      case 5:
        return (
          <div className="grid gap-4">
            <h2 className="text-lg font-semibold">Signature</h2>
            {draftLoading ? (
              <div className="flex flex-col items-center gap-2 w-full">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
                <span className="text-xs text-muted-foreground">
                  Saving signature...
                </span>
              </div>
            ) : form.watch("medical_Practitioner_Signiture") ? (
              <SignaturePreviewCard
                filename={form.watch("medical_Practitioner_Signiture") || ""}
                onDelete={() => {
                  form.setValue("medical_Practitioner_Signiture", "");
                  saveDraft(form.getValues());
                }}
                userBucket={form.watch("bucket")}
              />
            ) : (
              <div className="flex items-center gap-6">
                <div className="flex-1">
                  <FormField
                    control={form.control}
                    name="medical_Practitioner_Signiture"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <SignatureUpload
                            title="Draw Signature"
                            value={field.value}
                            onUpload={(value) => {
                              field.onChange(value);
                              const values = form.getValues();
                              saveDraft(values);
                            }}
                            ptype="private"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div className="flex items-center mt-4">
                  <span className="text-sm text-muted-foreground">OR</span>
                </div>
                <div className="flex-1">
                  <FormField
                    control={form.control}
                    name="medical_Practitioner_Signiture"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <FileUpload
                            title="Upload Signature"
                            value={field.value || null}
                            onChange={(value) => {
                              field.onChange(value);
                              const values = form.getValues();
                              saveDraft(values);
                            }}
                            accept=".pdf,.jpg,.jpeg,.png"
                            onUploadComplete={() => {
                              const values = form.getValues();
                              saveDraft(values);
                            }}
                            isSignatureUpload
                            ptype="private"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
            )}
          </div>
        );

      case 6:
        const values = form.getValues();
        return (
          <div className="max-w-2xl mx-auto space-y-8">
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <UserCheck className="w-5 h-5 text-primary" />
                <h2 className="text-lg font-semibold">
                  Public Officer Details
                </h2>
              </div>
              <div className="p-6 bg-muted rounded-lg space-y-6">
                <div>
                  <h3 className="text-sm font-medium mb-3 text-muted-foreground">
                    Public Officer
                  </h3>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">
                        Name:
                      </span>
                      <span className="text-sm font-medium">
                        {values.public_officer_firstname}{" "}
                        {values.public_officer_lastname}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">
                        Mobile:
                      </span>
                      <span className="text-sm font-medium">
                        {values.mobile_Phone_Number}
                      </span>
                    </div>
                  </div>
                </div>
                <Separator />
                <div>
                  <h3 className="text-sm font-medium mb-3 text-muted-foreground">
                    Medical Practitioner
                  </h3>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">
                        Name:
                      </span>
                      <span className="text-sm font-medium">
                        {values.medical_Practitioner_firstname}{" "}
                        {values.medical_Practitioner_lastname}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">
                        Registration:
                      </span>
                      <span className="text-sm font-medium">
                        {values.mb_Registration_Number}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">
                        Expiry:
                      </span>
                      <span className="text-sm font-medium">
                        {values.rn_Expiry?.toLocaleDateString()}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">
                        Terms in Practice:
                      </span>
                      <span className="text-sm font-medium">
                        {values.applicantsTermsInPractice}
                      </span>
                    </div>
                  </div>
                </div>
                <Separator />
                <div>
                  <h3 className="text-sm font-medium mb-3 text-muted-foreground">
                    P.O Box Details
                  </h3>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">
                        Name:
                      </span>
                      <span className="text-sm font-medium">
                        {values.pbox_Name}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">
                        Number:
                      </span>
                      <span className="text-sm font-medium">
                        {values.pbox_Number}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">
                        Branch:
                      </span>
                      <span className="text-sm font-medium">
                        {values.pbox_Branch}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">
                        Province:
                      </span>
                      <span className="text-sm font-medium">
                        {values.pbox_Province}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Building2 className="w-5 h-5 text-primary" />
                <h2 className="text-lg font-semibold">Business Details</h2>
              </div>
              <div className="p-6 bg-muted rounded-lg space-y-6">
                <div>
                  <h3 className="text-sm font-medium mb-3 text-muted-foreground">
                    Basic Information
                  </h3>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">
                        Practice Name:
                      </span>
                      <span className="text-sm font-medium">
                        {values.practice_Name}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">
                        Email:
                      </span>
                      <span className="text-sm font-medium">
                        {values.email}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">
                        Phone:
                      </span>
                      <span className="text-sm font-medium">
                        {values.business_Phone_Number}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">
                        Creation Date:
                      </span>
                      <span className="text-sm font-medium">
                        {values.location_Creation_Date?.toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>
                <Separator />
                <div>
                  <h3 className="text-sm font-medium mb-3 text-muted-foreground">
                    Practice Location
                  </h3>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">
                        Address:
                      </span>
                      <span className="text-sm font-medium">
                        {values.practice_Section}, {values.practice_Lot},{" "}
                        {values.practice_Street}, {values.practice_Suburb}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">
                        Province:
                      </span>
                      <span className="text-sm font-medium">
                        {values.practice_Province}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">
                        Premises Type:
                      </span>
                      <span className="text-sm font-medium">
                        {values.premises}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">
                        Employment Status:
                      </span>
                      <span className="text-sm font-medium">
                        {values.applicant_Employment_Status}
                      </span>
                    </div>
                  </div>
                </div>
                <Separator />
                <div>
                  <h3 className="text-sm font-medium mb-3 text-muted-foreground">
                    Business Information
                  </h3>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">
                        Business Name:
                      </span>
                      <span className="text-sm font-medium">
                        {values.registered_Business_Name}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">
                        Business Type:
                      </span>
                      <span className="text-sm font-medium">
                        {values.business_Type}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">
                        IPA Registration:
                      </span>
                      <span className="text-sm font-medium">
                        {values.ipa_Registration_Number}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">
                        TIN Number:
                      </span>
                      <span className="text-sm font-medium">
                        {values.ipa_Certified_Number}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Landmark className="w-5 h-5 text-primary" />
                <h2 className="text-lg font-semibold">Bank Details</h2>
              </div>
              <div className="p-6 bg-muted rounded-lg space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Bank:</span>
                  <span className="text-sm font-medium">{values.bank}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Branch:</span>
                  <span className="text-sm font-medium">
                    {values.branch_Name} ({values.branch_Number})
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">
                    Account Number:
                  </span>
                  <span className="text-sm font-medium">
                    {values.account_Number}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">
                    Account Name:
                  </span>
                  <span className="text-sm font-medium">
                    {values.account_Name}
                  </span>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-primary" />
                <h2 className="text-lg font-semibold">Documents</h2>
              </div>
              <div className="p-6 bg-muted rounded-lg space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">
                    IPA Certificate:
                  </span>
                  <span className="text-sm font-medium">
                    {values.ipa_Certificate ? "Uploaded" : "Not uploaded"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">
                    TIN Certificate:
                  </span>
                  <span className="text-sm font-medium">
                    {values.tin_Certificate ? "Uploaded" : "Not uploaded"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">
                    Medical Certificate:
                  </span>
                  <span className="text-sm font-medium">
                    {values.medical_Certificate ? "Uploaded" : "Not uploaded"}
                  </span>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <FileSignature className="w-5 h-5 text-primary" />
                <h2 className="text-lg font-semibold">Signature</h2>
              </div>
              <div className="p-6 bg-muted rounded-lg space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">
                    Signature Type:
                  </span>
                  <span className="text-sm font-medium capitalize">
                    {values.signatureType}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Status:</span>
                  <span className="text-sm font-medium">
                    {values.medical_Practitioner_Signiture
                      ? "Signed"
                      : "Not signed"}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-4 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => setStep(5)}
                disabled={isSubmitting}
              >
                Back
              </Button>
              <Button
                type="submit"
                onClick={() => form.handleSubmit(onSubmit)()}
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Submitting...
                  </>
                ) : (
                  "Submit Registration"
                )}
              </Button>
            </div>
          </div>
        );

      default:
        return <div>Step 1</div>;
    }
  };

  return (
    <div className="flex w-full gap-4 min-h-full h-fit">
      {/* Control Panel */}
      <div className="w-1/4 min-w-[250px] h-fit sticky top-[4.5rem]">
        <div className="">
          <Card className="rounded-lg bg-muted text-card-foreground shadow-sm animate-slide-left-fade-in p-0">
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

              <div className="space-y-2">
                {steps.map((s, i) => {
                  const isAccessible = canAccessStep(i);
                  const isVerifyStep = i === 5;
                  const shouldShow = !isVerifyStep || isAccessible;

                  if (!shouldShow) return null;

                  const isActive = step === i + 1;

                  return (
                    <Button
                      key={s.title}
                      onClick={() => isAccessible && setStep(i + 1)}
                      variant="ghost"
                      className={cn(
                        "flex w-full items-start gap-3 h-fit rounded-md p-2 text-sm transition-colors duration-300 cursor-pointer",
                        isActive
                          ? "bg-primary text-primary-foreground hover:bg-primary/95 hover:text-primary-foreground/95"
                          : "hover:bg-muted-foreground/20",
                        !isAccessible && "opacity-50 cursor-not-allowed",
                        step > i + 1 && "text-muted-foreground"
                      )}
                      disabled={!isAccessible}
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

                            // If this is the active step, add text-background to the subsection
                            const subsectionClass = cn(
                              "text-xs text-muted-foreground flex items-center justify-between w-full text-left",
                              isActive && "text-background/75"
                            );

                            return (
                              <div key={sub.title} className={subsectionClass}>
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
                    </Button>
                  );
                })}
              </div>
            </div>
          </Card>
        </div>
      </div>

      {/* Form Container */}
      <Card className="w-3/4 h-fit animate-slide-right-fade-in">
        <CardHeader>
          <CardTitle className="font-bold flex items-center justify-between">
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
                    className="gap-1 cursor-pointer animate-slide-right-fade-in"
                    key={steps[step - 2].title}
                    disabled={step === 1}
                  >
                    <ChevronsLeft className="w-3 h-3" />
                    <p
                      key={steps[step - 2].title}
                      className="text-sm font-medium"
                    >
                      {steps[step - 2].title}
                    </p>
                  </Button>
                )}
                {step < 6 && (
                  <div className="ml-auto">
                    <Button
                      type="button"
                      variant="default"
                      onClick={nextStep}
                      disabled={step === 6}
                      key={steps[step].title}
                      className="gap-1 cursor-pointer animate-slide-left-fade-in"
                    >
                      <ChevronsRight className="w-3 h-3" />
                      <p key={steps[step].title} className="font-bold">
                        {steps[step].title}
                      </p>
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent className="pb-8">
          <Form {...form}>
            <ScrollArea className="h-[calc(100vh-16rem)] max-h-fit">
              <div className="animate-slide-down-fade-in" key={step}>
                {renderStep(step, form)}
              </div>
            </ScrollArea>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}

export default PrivateRegistrationForm;
