/**
 * Private Registration Form
 *
 * TODO: Missing Fields and Required Changes
 *
 * 1. System Fields (Auto-generated/Managed by Backend)
 *    - id: String
 *    - userId: String
 *    - created_Date: DateTime
 *    - updated_Date: DateTime
 *    - status: String
 *    - luhnRegistrationNumber: String
 *    - bucket: String
 *    - reason: String
 *
 * 2. Fields Needing Implementation
 *    - rn_Expiry: Date picker for registration number expiry
 *    - isPsnaProvider: Boolean checkbox
 *    - medical_Practitioner_Signiture: Signature capture/upload component
 *    - ipa_Certificate: File upload with proper handling
 *    - tin_Certificate: File upload with proper handling
 *    - medical_Certificate: File upload with proper handling
 *
 * 3. Validation Requirements
 *    - Phone numbers should have proper format validation
 *    - File uploads should have size and type restrictions
 *    - Dates should have proper range validation
 *
 * 4. UI/UX Improvements Needed
 *    - Add form section navigation
 *    - Add progress indicator
 *    - Add form validation summary
 *    - Add confirmation dialog before submission
 *    - Add loading states for file uploads
 *    - Add error handling for failed uploads
 *
 * 5. Backend Integration
 *    - Implement draft save functionality
 *    - Implement file upload handling
 *    - Add proper error handling for API calls
 *    - Add retry mechanism for failed uploads
 */

"use client";
import {
  Form,
  FormField,
  FormMessage,
  FormItem,
  FormLabel,
  FormControl,
} from "../ui/form";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@apollo/client";
import { ADD_OR_UPDATE_DRAFT } from "@/lib/graphql/queries";
import { toast } from "sonner";
import { useDebounce } from "use-debounce";
import { useEffect, useRef } from "react";

import { z } from "zod";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Calendar } from "../ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Textarea } from "../ui/textarea";

import { useUserProfileStore } from "@/stores/user-profile-store";

const registrationSchema = z.object({
  // Public Officer Details
  public_officer_firstname: z
    .string()
    .min(2, "First name must be at least 2 characters"),
  public_officer_lastname: z
    .string()
    .min(2, "Last name must be at least 2 characters"),
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
  rn_Expiry: z.date().nullable(),
  applicantsTermsInPractice: z.string().min(1, "Terms in practice is required"),

  // Business Details
  practice_Name: z.string().min(2, "Practice name is required"),
  email: z.string().email("Invalid email address"),
  business_Phone_Number: z.string().regex(/^\d+$/, "Must be a valid number"),
  mobile_Phone_Number: z.string().regex(/^\d+$/, "Must be a valid number"),
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
  location_Phone_Number: z.string().regex(/^\d+$/, "Must be a valid number"),
  location_Email: z.string().email("Invalid email address"),
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
  premises: z.string().min(1, "Premises description is required"),
  ptype: z.enum([
    "Hospital - public",
    "Hospital - private",
    "Practice - general practice",
    "Practice - other private practice",
    "Educational institution",
    "Residential care facility",
    "Other community health care service",
    "Mobile",
  ]),
  isPsnaProvider: z.boolean(),

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

  // Medical Practitioner Details
  medical_Practitioner_firstname: z
    .string()
    .min(2, "First name must be at least 2 characters"),
  medical_Practitioner_lastname: z
    .string()
    .min(2, "Last name must be at least 2 characters"),
  medical_Practitioner_Signiture: z.string().min(1, "Signature is required"),

  // Documents
  ipa_Certificate: z.any().optional(),
  tin_Certificate: z.any().optional(),
  medical_Certificate: z.any().optional(),
});

export const PrivateRegistrationForm = () => {
  const [addOrUpdateDraft, { loading }] = useMutation(ADD_OR_UPDATE_DRAFT);
  const user = useUserProfileStore((state) => state.user);
  const initialValues = useRef<z.infer<typeof registrationSchema>>();

  const form = useForm<z.infer<typeof registrationSchema>>({
    resolver: zodResolver(registrationSchema),
    defaultValues: {
      // Public Officer Details
      public_officer_firstname: "",
      public_officer_lastname: "",
      pbox_Name: "",
      pbox_Number: "",
      pbox_Branch: "",
      pbox_Province: undefined,
      rn_Expiry: null,
      applicantsTermsInPractice: "",

      // Business Details
      practice_Name: "",
      email: "",
      business_Phone_Number: "",
      mobile_Phone_Number: "",
      location_Creation_Date: null,
      practice_Section: "",
      practice_Lot: "",
      practice_Street: "",
      practice_Suburb: "",
      practice_Province: undefined,
      location_Phone_Number: "",
      location_Email: "",
      applicant_Employment_Status: "",
      registered_Business_Name: "",
      ipa_Registration_Number: "",
      business_Type: undefined,
      premises: "",
      ptype: undefined,
      isPsnaProvider: false,

      // Bank Details
      bank: undefined,
      branch_Number: "",
      branch_Name: "",
      account_Number: "",
      account_Name: "",

      // Medical Practitioner Details
      medical_Practitioner_firstname: "",
      medical_Practitioner_lastname: "",
      medical_Practitioner_Signiture: "",

      // Documents
      ipa_Certificate: null,
      tin_Certificate: null,
      medical_Certificate: null,
    },
  });

  // Store initial values on first render
  useEffect(() => {
    initialValues.current = form.getValues();
  }, []);

  // Watch all form values
  const formValues = form.watch();
  // Debounce the form values with a 2 second delay
  const [debouncedValues] = useDebounce(formValues, 2000);

  // Auto-save draft when debounced values change
  useEffect(() => {
    const saveDraft = async () => {
      if (!user?.userId) return; // Don't save if no user is logged in
      if (!initialValues.current) return; // Don't save until initial values are set

      // Check if any values have actually changed
      const hasChanges = Object.keys(debouncedValues).some(
        (key) =>
          debouncedValues[key as keyof typeof debouncedValues] !==
          initialValues.current?.[key as keyof typeof initialValues.current]
      );

      if (!hasChanges) return; // Don't save if no changes

      try {
        await addOrUpdateDraft({
          variables: {
            
            draft: {
              ...debouncedValues,
              userId: user.userId,
              status: "DRAFT",
              created_Date: new Date().toISOString(),
              updated_Date: new Date().toISOString(),
            },
          },
        });
        // Update initialValues after successful save
        initialValues.current = { ...debouncedValues };
        toast.success("Draft saved automatically");
      } catch (error) {
        console.error("Error saving draft:", error);
        toast.error("Failed to save draft");
      }
    };

    saveDraft();
  }, [debouncedValues, user?.userId, addOrUpdateDraft]);

  return (
    <Card className="max-h-[800px] overflow-y-auto">
      <CardHeader>
        <CardTitle>Private Registration</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form className="space-y-8">
            {/* Step 1: Public Officer Details */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">
                Step 1: Public Officer Details
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="public_officer_firstname"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>First Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter first name" {...field} />
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
                        <Input placeholder="Enter last name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="pbox_Name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>P.O Box Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter P.O Box name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="pbox_Number"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>P.O Box Number</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter P.O Box number" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="pbox_Branch"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>P.O Box Branch</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter P.O Box branch" {...field} />
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
                      <FormLabel>P.O Box Province</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select province" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {registrationSchema.shape.pbox_Province.options.map(
                            (province) => (
                              <SelectItem key={province} value={province}>
                                {province}
                              </SelectItem>
                            )
                          )}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            {/* Step 2: Business Details */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">
                Step 2: Business Details
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="practice_Name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Practice Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter practice name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Business Email</FormLabel>
                      <FormControl>
                        <Input
                          type="email"
                          placeholder="Enter business email"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="business_Phone_Number"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Business Phone</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter business phone" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="location_Creation_Date"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>Inception Date</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant={"outline"}
                              className={cn(
                                "w-full pl-3 text-left font-normal",
                                !field.value && "text-muted-foreground"
                              )}
                            >
                              {field.value ? (
                                format(field.value, "PPP")
                              ) : (
                                <span>Pick a date</span>
                              )}
                              <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={field.value || undefined}
                            onSelect={field.onChange}
                            disabled={(date) =>
                              date > new Date() || date < new Date("1900-01-01")
                            }
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="practice_Section"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Practice Section</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Enter practice section"
                          {...field}
                        />
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
                      <FormLabel>Practice Lot</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter practice lot" {...field} />
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
                      <FormLabel>Practice Street</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter practice street" {...field} />
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
                      <FormLabel>Practice Suburb</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter practice suburb" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="practice_Province"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Practice Province</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select province" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {registrationSchema.shape.practice_Province.options.map(
                            (province) => (
                              <SelectItem key={province} value={province}>
                                {province}
                              </SelectItem>
                            )
                          )}
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
                      <FormLabel>Employment Status</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Enter employment status"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="registered_Business_Name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Registered Business Name</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Enter registered business name"
                          {...field}
                        />
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
                        <Input
                          placeholder="Enter IPA registration number"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
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
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select business type" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {registrationSchema.shape.business_Type.options.map(
                            (type) => (
                              <SelectItem key={type} value={type}>
                                {type}
                              </SelectItem>
                            )
                          )}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="ptype"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Practice Type</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select practice type" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {registrationSchema.shape.ptype.options.map(
                            (type) => (
                              <SelectItem key={type} value={type}>
                                {type}
                              </SelectItem>
                            )
                          )}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            {/* Step 3: Bank Details */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Step 3: Bank Details</h3>
              <div className="grid grid-cols-2 gap-4">
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
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select bank" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {registrationSchema.shape.bank.options.map((bank) => (
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
                <FormField
                  control={form.control}
                  name="branch_Number"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Branch Code</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter branch code" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="branch_Name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Branch Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter branch name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="account_Number"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Account Number</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter account number" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <FormField
                control={form.control}
                name="account_Name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Account Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter account name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Step 4: Documents */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Step 4: Documents</h3>
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="ipa_Certificate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>IPA Certificate</FormLabel>
                      <FormControl>
                        <Input
                          type="file"
                          onChange={(e) => field.onChange(e.target.files?.[0])}
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
                      <FormLabel>TIN Certificate</FormLabel>
                      <FormControl>
                        <Input
                          type="file"
                          onChange={(e) => field.onChange(e.target.files?.[0])}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <FormField
                control={form.control}
                name="medical_Certificate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Medical Board Certificate</FormLabel>
                    <FormControl>
                      <Input
                        type="file"
                        onChange={(e) => field.onChange(e.target.files?.[0])}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Step 5: Signature */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Step 5: Signature</h3>
              <FormField
                control={form.control}
                name="medical_Practitioner_Signiture"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Signature</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Enter signature"
                        className="h-32"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <Button type="button" className="w-full" disabled={loading}>
              {loading ? "Saving..." : "Submit Registration"}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};
