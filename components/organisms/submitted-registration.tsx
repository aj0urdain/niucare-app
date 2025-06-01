/**
 * File: components/organisms/submitted-registration.tsx
 * Description: Displays a submitted registration with details, status, and actions for editing or acknowledging
 * Author: Aaron J. Girton - https://github.com/aj0urdain
 * Created: 2025
 */

import { Card, CardContent } from "@/components/ui/card";
import {
  Building2,
  UserCheck,
  Landmark,
  FileText,
  FileSignature,
  AlertCircle,
  CircleDashed,
  CheckCircle2,
  XCircle,
  ThumbsUp,
  ChevronsRight,
  ChevronsUp,
  CornerDownRight,
  Trash2,
  FileWarning,
  FilePen,
} from "lucide-react";
import React, { useRef, useState, useEffect } from "react";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Button } from "../ui/button";
import { Separator } from "../ui/separator";
import { InfoCard } from "@/components/molecules/info-card";
import { FileUpload } from "@/components/molecules/file-upload";
import { cn } from "@/lib/utils";
import { SignaturePreviewCard } from "../molecules/signature-preview-card";
import { Textarea } from "../ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useMutation } from "@apollo/client";
import {
  ADD_OR_UPDATE_DRAFT,
  UPDATE_REGISTRATION_STATUS,
} from "@/lib/graphql/mutations";
import { useUserProfileStore } from "@/stores/user-profile-store";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { GET_USER_FULL_REGISTRATION } from "@/lib/graphql/queries";

/**
 * Props for the SubmittedRegistration component
 * @property registration - Registration data to display
 */
interface SubmittedRegistrationProps {
  registration: {
    status: string;
    luhnRegistrationNumber: string;
    ptype: string;
    public_officer_firstname: string;
    public_officer_lastname: string;
    email: string;
    business_Phone_Number: string;
    mobile_Phone_Number: string;
    practice_Name: string;
    business_Type: string;
    premises: string;
    registered_Business_Name: string;
    practice_Section: string;
    practice_Lot: string;
    practice_Street: string;
    practice_Suburb: string;
    practice_Province: string;
    bank: string;
    branch_Name: string;
    branch_Number: string;
    account_Number: string;
    account_Name: string;
    medical_Practitioner_firstname: string;
    medical_Practitioner_lastname: string;
    ipa_Certificate: string;
    tin_Certificate: string;
    medical_Certificate: string;
    medical_Practitioner_Signiture: string;
    reason?: string;
    mb_Registration_Number: string;
    rn_Expiry: string;
    applicantsTermsInPractice: number;
    pbox_Name: string;
    pbox_Number: string;
    pbox_Branch: string;
    pbox_Province: string;
    location_Creation_Date: string;
    ipa_Registration_Number: string;
    ipa_Certified_Number: string;
    applicant_Employment_Status: string;
    id: string;
  };
}

/**
 * SubmittedRegistration Component
 *
 * Displays a submitted registration with all details, status, and actions for editing, acknowledging, or starting a new registration.
 *
 * @param {SubmittedRegistrationProps} props - Component props
 * @returns {JSX.Element} The rendered submitted registration view
 *
 * @example
 * ```tsx
 * <SubmittedRegistration registration={registrationData} />
 * ```
 */
export function SubmittedRegistration({
  registration,
}: SubmittedRegistrationProps) {
  const { user } = useUserProfileStore();
  const router = useRouter();
  const [addOrUpdateDraft, { loading: isUpdatingDraft, error: updateError }] =
    useMutation(ADD_OR_UPDATE_DRAFT);
  const [updateRegistrationStatus, { loading: isUpdatingStatus }] = useMutation(
    UPDATE_REGISTRATION_STATUS,
    {
      refetchQueries: [
        {
          query: GET_USER_FULL_REGISTRATION,
          variables: { userId: user?.userId },
        },
      ],
    }
  );
  const [activeSection, setActiveSection] = useState<string>("");
  const [isNewRegistrationDialogOpen, setIsNewRegistrationDialogOpen] =
    useState(false);
  const [isEditRegistrationDialogOpen, setIsEditRegistrationDialogOpen] =
    useState(false);

  // Sticky header detection
  const [isHeaderSticky, setIsHeaderSticky] = useState(false);
  const stickySentinelRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Use viewport as root for IntersectionObserver
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      {
        root: null, // viewport
        threshold: 0.5,
      }
    );

    const sections = [
      "registration-type-section",
      "officer-section",
      "business-section",
      "bank-section",
      "documents-section",
      "signature-section",
    ];

    sections.forEach((sectionId) => {
      const element = document.getElementById(sectionId);
      if (element) observer.observe(element);
    });

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const sentinel = stickySentinelRef.current;
    const header = headerRef.current;
    if (!sentinel || !header) return;

    const observer = new window.IntersectionObserver(
      ([entry]) => {
        setIsHeaderSticky(!entry.isIntersecting);
      },
      {
        root: null,
        threshold: 0,
      }
    );
    observer.observe(sentinel);
    return () => observer.disconnect();
  }, []);

  // Adjust this value to match the total height of your sticky headers
  const STICKY_HEADER_OFFSET = 144; // e.g., 64px app header + 80px form header

  const scrollToSection = (sectionId: string) => {
    if (sectionId === "registration-type-section") {
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }
    const element = document.getElementById(sectionId);
    if (element) {
      const offset =
        element.getBoundingClientRect().top +
        window.scrollY -
        STICKY_HEADER_OFFSET;
      window.scrollTo({
        top: offset,
        behavior: "smooth",
      });
    }
  };

  // Determine provider icon and label
  const isPrivate = registration.ptype === "private";
  const ProviderIcon = isPrivate ? Building2 : Landmark;
  const providerLabel = isPrivate
    ? "Private Service Provider"
    : "Provincial Health Authority";

  const handleStartNewRegistration = () => {
    // Add your navigation logic here
  };

  const handleEditRegistration = async () => {
    if (!user?.userId) {
      toast.error("User ID not found");
      return;
    }

    try {
      // Create a new draft with the existing registration values
      await addOrUpdateDraft({
        variables: {
          draft: {
            ...registration,
            userId: user.userId,
            status: "DRAFT",
            reason: registration.reason || null,
            created_Date: new Date().toISOString(),
            updated_Date: new Date().toISOString(),
            isPsnaProvider: false,
            registrationId: registration.id,
            __typename: undefined,
          },
        },
      });

      if (updateError) {
        toast.error("Failed to create draft");
        return;
      }

      if (isUpdatingDraft) {
        toast.loading("Creating draft...");
        return;
      }

      toast.success("Draft created successfully");
      setIsEditRegistrationDialogOpen(false);

      // Navigate to the appropriate registration form based on provider type
      if (registration.ptype === "private") {
        router.push("/registration/private");
      } else {
        router.push("/registration/public");
      }
    } catch (error) {
      console.error("Error creating draft:", error);
      toast.error("Failed to create draft");
    }
  };

  const handleAcknowledgeRegistration = async () => {
    try {
      await updateRegistrationStatus({
        variables: {
          id: registration.id,
          status: "Acknowledged",
          reason: "Registration acknowledged by the user.",
        },
      });

      toast.success("Registration acknowledged successfully");
      router.push("/dashboard"); // or wherever you want to redirect after acknowledgment
    } catch (error) {
      console.error("Error acknowledging registration:", error);
      toast.error("Failed to acknowledge registration");
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto">
      {/* Sentinel for sticky header detection */}
      <div ref={stickySentinelRef} style={{ height: 1 }} />
      {/* Form Container: Sidebar + Main Area */}
      <div className="flex flex-row w-full">
        {/* Sidebar: sticky, left, only as tall as content */}
        <Card className="flex flex-col items-center gap-4 w-fit px-2 shrink-0 pb-4 h-fit rounded-xl sticky top-16 z-10 mt-0">
          {/* Provider Type Icon */}
          <Tooltip defaultOpen={false}>
            <TooltipTrigger asChild>
              <Button
                onClick={() => scrollToSection("registration-type-section")}
                variant="ghost"
                className={cn(
                  activeSection === "registration-type-section" &&
                    "bg-primary text-primary-foreground",
                  "duration-700 transition-colors hover:bg-primary/90 hover:text-primary-foreground"
                )}
              >
                <ProviderIcon className="h-5 w-5" />
                <span className="sr-only">{providerLabel}</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent side="right">
              <p>{providerLabel}</p>
            </TooltipContent>
          </Tooltip>

          <Separator className="w-full my-2 bg-primary/20" />
          {/* Navigation Icons */}
          <div className="flex flex-col items-center gap-2 mt-2">
            <Tooltip defaultOpen={false}>
              <TooltipTrigger asChild>
                <Button
                  onClick={() => scrollToSection("officer-section")}
                  variant="ghost"
                  className={cn(
                    activeSection === "officer-section" &&
                      "bg-primary text-primary-foreground",
                    "duration-700 transition-colors hover:bg-primary/90 hover:text-primary-foreground"
                  )}
                >
                  <UserCheck className="h-5 w-5" />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="right">
                <p>Public Officer Details</p>
              </TooltipContent>
            </Tooltip>

            <Tooltip defaultOpen={false}>
              <TooltipTrigger asChild>
                <Button
                  onClick={() => scrollToSection("business-section")}
                  variant="ghost"
                  className={cn(
                    activeSection === "business-section" &&
                      "bg-primary text-primary-foreground",
                    "duration-700 transition-colors hover:bg-primary/90 hover:text-primary-foreground"
                  )}
                >
                  <Building2 className="h-5 w-5" />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="right">
                <p>Business Details</p>
              </TooltipContent>
            </Tooltip>

            <Tooltip defaultOpen={false}>
              <TooltipTrigger asChild>
                <Button
                  onClick={() => scrollToSection("bank-section")}
                  variant="ghost"
                  className={cn(
                    activeSection === "bank-section" &&
                      "bg-primary text-primary-foreground",
                    "duration-700 transition-colors hover:bg-primary/90 hover:text-primary-foreground"
                  )}
                >
                  <Landmark className="h-5 w-5" />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="right">
                <p>Bank Details</p>
              </TooltipContent>
            </Tooltip>

            <Tooltip defaultOpen={false}>
              <TooltipTrigger asChild>
                <Button
                  onClick={() => scrollToSection("documents-section")}
                  variant="ghost"
                  className={cn(
                    activeSection === "documents-section" &&
                      "bg-primary text-primary-foreground",
                    "duration-700 transition-colors hover:bg-primary/90 hover:text-primary-foreground"
                  )}
                >
                  <FileText className="h-5 w-5" />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="right">
                <p>Documents</p>
              </TooltipContent>
            </Tooltip>

            <Tooltip defaultOpen={false}>
              <TooltipTrigger asChild>
                <Button
                  onClick={() => scrollToSection("signature-section")}
                  variant="ghost"
                  className={cn(
                    activeSection === "signature-section" &&
                      "bg-primary text-primary-foreground",
                    "duration-700 transition-colors hover:bg-primary/90 hover:text-primary-foreground"
                  )}
                >
                  <FileSignature />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="right">
                <p>Signature</p>
              </TooltipContent>
            </Tooltip>
          </div>
        </Card>

        {/* Main Area: header (sticky) + content (scrolls under header only) */}
        <div className="flex-1 flex flex-col min-w-0 ml-6 w-full">
          {/* Sticky Header (only as wide as form area) */}
          <div
            ref={headerRef}
            className={cn(
              "sticky top-16 z-10 bg-background pt-6 pb-4 rounded-2xl w-full h-full",
              registration.status.toLowerCase() === "pending" &&
                "bg-yellow-100",
              registration.status.toLowerCase() === "approved" &&
                "bg-green-100",
              registration.status.toLowerCase() === "rejected" && "bg-red-100",
              registration.status.toLowerCase() === "acknowledged" &&
                "bg-blue-100",
              isHeaderSticky && "h-20"
            )}
          >
            <div className="flex items-center justify-between gap-4 py-0 text-base px-6 w-full relative">
              <div className="flex items-center gap-4">
                <div
                  className={cn(
                    "px-3 py-1.5 text-xs rounded-md bg-primary/10 text-primary border capitalize border-primary/20 flex items-center gap-1.5",
                    isHeaderSticky && "animate-pulse"
                  )}
                >
                  {registration.status.toLowerCase() === "pending" ? (
                    <CircleDashed className="h-3 w-3 animate-spin-slow" />
                  ) : registration.status.toLowerCase() === "approved" ? (
                    <CheckCircle2 className="h-3 w-3" />
                  ) : registration.status.toLowerCase() === "rejected" ? (
                    <XCircle className="h-3 w-3" />
                  ) : registration.status.toLowerCase() === "acknowledged" ? (
                    <ThumbsUp className="h-3 w-3" />
                  ) : (
                    <CircleDashed className="h-3 w-3 animate-spin-slow" />
                  )}
                  {registration.status}
                </div>

                <div className="w-1 h-1 bg-muted-foreground rounded-full animate-pulse" />
                <div className="px-3 py-1.5 text-xs rounded-md bg-transparent text-primary border capitalize border-primary/20 flex items-center gap-1">
                  <p className="font-semibold">{providerLabel}</p>
                  <p className="font-normal">Registration</p>
                  <ChevronsRight className="h-3 w-3" />
                  <p>{registration.luhnRegistrationNumber}</p>
                </div>
              </div>
              {isHeaderSticky && (
                <Button
                  variant="ghost"
                  className="flex items-center justify-center p-2 rounded hover:bg-primary/10 transition-colors"
                  onClick={() =>
                    window.scrollTo({ top: 0, behavior: "smooth" })
                  }
                  aria-label="Scroll to top"
                  type="button"
                >
                  <ChevronsUp className="h-6 w-6 text-primary animate-float-up-loop overflow-hidden" />
                </Button>
              )}
            </div>

            {registration.status.toLowerCase() === "pending" && (
              <Card
                className={cn(
                  "bg-yellow-50 border-yellow-200 transition-all duration-300 overflow-hidden",
                  isHeaderSticky
                    ? "opacity-0 pointer-events-none max-h-0 m-0"
                    : "opacity-100 pointer-events-auto max-h-40 mt-4 mx-6"
                )}
              >
                <CardContent className="flex flex-col items-start gap-2">
                  <div className="flex items-center gap-2">
                    <AlertCircle className="h-4 w-4 text-yellow-600" />
                    <h2 className="text-lg font-semibold">
                      Registration Pending
                    </h2>
                  </div>
                  <p className="text-yellow-800 text-sm">
                    Your registration has been submitted and is pending review.
                    We will notify you once it has been processed.
                  </p>
                </CardContent>
              </Card>
            )}

            {registration.status.toLowerCase() === "rejected" && (
              <Card
                className={cn(
                  "bg-red-50 border-red-200 transition-all duration-300 overflow-hidden",
                  isHeaderSticky
                    ? "opacity-0 pointer-events-none max-h-0 m-0"
                    : "opacity-100 pointer-events-auto max-h-96 mt-4 mx-6"
                )}
              >
                <CardContent className="flex flex-col items-start gap-2">
                  <div className="flex items-center gap-2">
                    <XCircle className="h-4 w-4 text-red-600" />
                    <h2 className="text-lg font-semibold text-red-800">
                      Registration Rejected
                    </h2>
                  </div>
                  {registration.reason ? (
                    <div className="flex flex-col gap-2 w-full">
                      <p className="text-red-800 text-sm mb-1">
                        Your registration has been rejected, the following note
                        has been provided for reference:
                      </p>
                      <Textarea
                        className="w-full bg-rejected-foreground border border-red-200 rounded p-2 text-red-900 text-sm resize-none mb-2"
                        value={registration.reason}
                        readOnly
                        rows={Math.max(
                          2,
                          registration.reason.split("\n").length
                        )}
                        style={{
                          minHeight: "2.5rem",
                          height: "auto",
                          overflow: "hidden",
                        }}
                      />
                      <div className="flex gap-2 w-full justify-end">
                        <Button
                          variant="ghost"
                          onClick={() => setIsNewRegistrationDialogOpen(true)}
                          className="group/start-new-registration transition-all duration-300 hover:border-destructive border border-transparent hover:text-destructive cursor-pointer"
                        >
                          <Trash2 className="h-4 w-4 hidden group-hover/start-new-registration:block group-hover/start-new-registration:animate-shake-twice" />
                          Start New Registration
                        </Button>
                        <Button
                          variant="default"
                          onClick={() => setIsEditRegistrationDialogOpen(true)}
                          className="group/edit-registration transition-all duration-300 hover:bg-acknowledged cursor-pointer"
                        >
                          <div className="group-hover/edit-registration:animate-slide-down-fade-in">
                            <CornerDownRight className="h-4 w-4 hidden group-hover/edit-registration:block animate-pulse" />
                          </div>
                          Edit Registration
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <p className="text-red-800 text-sm">
                      Your registration was rejected. Please review the feedback
                      and resubmit if appropriate.
                    </p>
                  )}
                </CardContent>
              </Card>
            )}

            {registration.status.toLowerCase() === "approved" && (
              <Card
                className={cn(
                  "bg-green-50 border-green-200 transition-all duration-300 overflow-hidden",
                  isHeaderSticky
                    ? "opacity-0 pointer-events-none max-h-0 m-0"
                    : "opacity-100 pointer-events-auto max-h-[800px] mt-4 mx-6"
                )}
              >
                <CardContent className="flex flex-col items-start gap-4">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-green-600" />
                    <h2 className="text-lg font-semibold text-green-800">
                      Registration Approved
                    </h2>
                  </div>
                  <div className="flex flex-col gap-4 w-full">
                    <p className="text-green-800 text-sm">
                      Congratulations! Your registration has been approved.
                      Please review the agreement below and acknowledge to gain
                      access to your provider dashboard and services.
                    </p>

                    {/* PDF Agreement Viewer */}
                    <div className="w-full h-[500px] rounded-lg border border-green-200 overflow-hidden">
                      <iframe
                        src="https://psna-public.s3.ap-southeast-2.amazonaws.com/agreement.pdf"
                        className="w-full h-full"
                        title="Registration Agreement"
                      />
                    </div>

                    <div className="flex gap-2 w-full justify-end">
                      <Button
                        variant="default"
                        onClick={handleAcknowledgeRegistration}
                        disabled={isUpdatingStatus}
                        className="group/acknowledge-registration transition-all duration-300 hover:bg-green-600 cursor-pointer"
                      >
                        <div className="group-hover/acknowledge-registration:animate-slide-down-fade-in">
                          <ThumbsUp className="h-4 w-4 hidden group-hover/acknowledge-registration:block animate-pulse" />
                        </div>
                        {isUpdatingStatus
                          ? "Acknowledging..."
                          : "I Agree & Access Dashboard"}
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Main Content (scrollable under header only) */}
          <div className="px-6 pb-6 pt-6">
            {/* Registration Type */}
            <div id="registration-type-section" className="space-y-4">
              <InfoCard
                title={null}
                fields={[
                  {
                    label: "Type",
                    value: providerLabel,
                  },
                  {
                    label: "Registration Number",
                    value: registration.luhnRegistrationNumber,
                  },
                ]}
                className="bg-transparent pt-6"
              />
            </div>

            <Separator className="my-4 bg-transparent" />

            {/* Officer Section */}
            <div id="officer-section" className="space-y-4">
              <h2 className="text-lg font-semibold flex items-center gap-2 pl-4">
                <UserCheck className="h-5 w-5" />
                Public Officer Details
              </h2>

              {/* Public Officer Information */}
              <InfoCard
                title="Public Officer Information"
                fields={[
                  {
                    label: "First Name",
                    value: registration.public_officer_firstname,
                  },
                  {
                    label: "Last Name",
                    value: registration.public_officer_lastname,
                  },
                  {
                    label: "Mobile Number",
                    value: registration.mobile_Phone_Number,
                  },
                ]}
              />

              <InfoCard
                title="Medical Practitioner Details"
                fields={[
                  {
                    label: "First Name",
                    value: registration.medical_Practitioner_firstname,
                  },
                  {
                    label: "Last Name",
                    value: registration.medical_Practitioner_lastname,
                  },
                  {
                    label: "Registration Number",
                    value: registration.mb_Registration_Number,
                  },
                  {
                    label: "Registration Expiry",
                    value: new Date(
                      registration.rn_Expiry
                    ).toLocaleDateString(),
                  },
                  {
                    label: "Terms in Practice",
                    value: registration.applicantsTermsInPractice,
                  },
                ]}
              />

              <InfoCard
                title="P.O Box Details"
                fields={[
                  {
                    label: "Name",
                    value: registration.pbox_Name,
                  },
                  {
                    label: "Number",
                    value: registration.pbox_Number,
                  },
                  {
                    label: "Branch",
                    value: registration.pbox_Branch,
                  },
                  {
                    label: "Province",
                    value: registration.pbox_Province,
                  },
                ]}
              />
            </div>

            <Separator className="my-8 bg-primary/10" />

            {/* Business Section */}
            <div id="business-section" className="space-y-4">
              <h2 className="text-lg font-semibold flex items-center gap-2 pl-4">
                <Building2 className="h-5 w-5" />
                Business Details
              </h2>
              <InfoCard
                title="Basic Information"
                fields={[
                  {
                    label: "Practice Name",
                    value: registration.practice_Name,
                  },
                  {
                    label: "Email",
                    value: registration.email,
                  },
                  {
                    label: "Phone Number",
                    value: registration.business_Phone_Number,
                  },
                  {
                    label: "Creation Date",
                    value: new Date(
                      registration.location_Creation_Date
                    ).toLocaleDateString(),
                  },
                ]}
              />

              <InfoCard
                title="Practice Location"
                fields={[
                  {
                    label: "Section",
                    value: registration.practice_Section,
                  },
                  {
                    label: "Lot",
                    value: registration.practice_Lot,
                  },
                  {
                    label: "Street",
                    value: registration.practice_Street,
                  },
                  {
                    label: "Suburb",
                    value: registration.practice_Suburb,
                  },
                  {
                    label: "Province",
                    value: registration.practice_Province,
                  },
                ]}
              />

              <InfoCard
                title="Business Information"
                fields={[
                  {
                    label: "Business Name",
                    value: registration.registered_Business_Name,
                  },
                  {
                    label: "Business Type",
                    value: registration.business_Type,
                  },
                  {
                    label: "Premises Type",
                    value: registration.premises,
                  },
                  {
                    label: "Employment Status",
                    value: registration.applicant_Employment_Status,
                  },
                  {
                    label: "IPA Registration",
                    value: registration.ipa_Registration_Number,
                  },
                  {
                    label: "TIN Number",
                    value: registration.ipa_Certified_Number,
                  },
                ]}
              />
            </div>

            <Separator className="my-8 bg-primary/10" />

            {/* Bank Section */}
            <div id="bank-section" className="space-y-4">
              <h2 className="text-lg font-semibold flex items-center gap-2 pl-4">
                <Landmark className="h-5 w-5" />
                Bank Details
              </h2>
              <InfoCard
                title="Banking Information"
                fields={[
                  {
                    label: "Bank Name",
                    value: registration.bank,
                  },
                  {
                    label: "Branch Code",
                    value: registration.branch_Number,
                  },
                  {
                    label: "Branch Name",
                    value: registration.branch_Name,
                  },
                  {
                    label: "Account Number",
                    value: registration.account_Number,
                  },
                  {
                    label: "Account Name",
                    value: registration.account_Name,
                  },
                ]}
              />
            </div>

            <Separator className="my-8 bg-primary/10" />

            {/* Documents Section */}
            <div id="documents-section" className="space-y-4">
              <h2 className="text-lg font-semibold flex items-center gap-2 pl-4">
                <FileText className="h-5 w-5" />
                Required Documents
              </h2>
              <div className="grid grid-cols-2 gap-4">
                <FileUpload
                  value={registration.ipa_Certificate}
                  onChange={() => {}}
                  title="IPA Certificate"
                  viewOnly={true}
                />
                <FileUpload
                  value={registration.tin_Certificate}
                  onChange={() => {}}
                  title="TIN Certificate"
                  viewOnly={true}
                />
                <FileUpload
                  value={registration.medical_Certificate}
                  onChange={() => {}}
                  title="Medical Certificate"
                  viewOnly={true}
                />
              </div>
            </div>

            <Separator className="my-8 bg-primary/10" />

            {/* Signature Section */}
            <div id="signature-section" className="space-y-4">
              <h2 className="text-lg font-semibold flex items-center gap-2 pl-4">
                <FileSignature className="h-5 w-5" />
                Signature Information
              </h2>
              <div className="grid grid-cols-2 gap-4">
                <SignaturePreviewCard
                  filename={registration.medical_Practitioner_Signiture}
                  viewOnly={true}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* New Registration Dialog */}
      <Dialog
        open={isNewRegistrationDialogOpen}
        onOpenChange={setIsNewRegistrationDialogOpen}
      >
        <DialogContent className="border-2 border-warning">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-2xl text-warning">
              <FileWarning />
              Start New Registration
            </DialogTitle>
            <DialogDescription>
              This will{" "}
              <span className="font-semibold">
                restart your entire registration process
              </span>
              . Are you sure you want to continue?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="ghost"
              onClick={() => setIsNewRegistrationDialogOpen(false)}
            >
              Back
            </Button>
            <Button
              onClick={handleStartNewRegistration}
              className="hover:bg-warning hover:text-foreground transition-all duration-300 hover:animate-pulse"
            >
              Start Over
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Registration Dialog */}
      <Dialog
        open={isEditRegistrationDialogOpen}
        onOpenChange={setIsEditRegistrationDialogOpen}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-2xl">
              <FilePen />
              Edit Registration
            </DialogTitle>
            <DialogDescription>
              This will create a new{" "}
              {registration.ptype === "private"
                ? "Private Service Provider"
                : "Provincial Health Authority"}{" "}
              draft with your existing registration values. Are you sure you
              want to continue?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="ghost"
              onClick={() => setIsEditRegistrationDialogOpen(false)}
            >
              Back
            </Button>
            <Button onClick={handleEditRegistration}>Confirm</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
