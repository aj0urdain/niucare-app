/**
 * File: components/organisms/view-registration-modal.tsx
 * Description: Modal component for viewing registration details, documents, and approving/rejecting registrations
 * Author: Aaron J. Girton - https://github.com/aj0urdain
 * Created: 2025
 */

import { Registration } from "@/components/atoms/admin-registration-columns";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Card } from "@/components/ui/card";
import {
  Building2,
  AlertCircle,
  UserCheck,
  Landmark,
  FileText,
  FileSignature,
  CheckCircle2,
  XCircle,
  CircleDashed,
  ChevronsRight,
  ThumbsUp,
} from "lucide-react";
import { useEffect, useState, useRef } from "react";
import { useQuery, useMutation } from "@apollo/client";
import {
  GET_REGISTRATIONS,
  GET_USER_FULL_REGISTRATION,
} from "@/lib/graphql/queries";
import { UPDATE_REGISTRATION_STATUS } from "@/lib/graphql/mutations";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Button } from "../ui/button";
import { Separator } from "../ui/separator";
import { InfoCard } from "@/components/molecules/info-card";
import { cn } from "@/lib/utils";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { FileUpload } from "@/components/molecules/file-upload";

import { SignaturePreviewCard } from "../molecules/signature-preview-card";

/**
 * Props for the ViewRegistrationModal component
 * @property registration - Registration data to display
 * @property open - Whether the modal is open
 * @property onOpenChange - Callback for modal open state change
 */
interface ViewRegistrationModalProps {
  registration: Registration | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

interface FullRegistration {
  id: string;
  public_officer_firstname: string;
  public_officer_lastname: string;
  email: string;
  practice_Name: string;
  practice_Province: string;
  ptype: string;
  status: string;
  luhnRegistrationNumber: string;
  mobile_Phone_Number: string;
  medical_Practitioner_firstname: string;
  medical_Practitioner_lastname: string;
  mb_Registration_Number: string;
  rn_Expiry: string;
  applicantsTermsInPractice: number;
  pbox_Name: string;
  pbox_Number: string;
  pbox_Branch: string;
  pbox_Province: string;
  business_Phone_Number: string;
  location_Creation_Date: string;
  practice_Section: string;
  practice_Lot: string;
  practice_Street: string;
  practice_Suburb: string;
  applicant_Employment_Status: string;
  registered_Business_Name: string;
  ipa_Registration_Number: string;
  ipa_Certified_Number: string;
  business_Type: string;
  premises: string;
  bank: string;
  branch_Number: string;
  branch_Name: string;
  account_Number: string;
  account_Name: string;
  ipa_Certificate: string | null;
  tin_Certificate: string | null;
  medical_Certificate: string | null;
  medical_Practitioner_Signiture: string | null;
  bucket: string;
}

const ViewRegistrationModalContent = ({
  registration,
  open,
  onOpenChange,
}: ViewRegistrationModalProps) => {
  const [matchingRegistration, setMatchingRegistration] =
    useState<FullRegistration | null>(null);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const [showAcceptDialog, setShowAcceptDialog] = useState(false);
  const [showRejectDialog, setShowRejectDialog] = useState(false);
  const [rejectionReason, setRejectionReason] = useState("");
  const [activeSection, setActiveSection] = useState<string>("");

  const [updateRegistrationStatus] = useMutation(UPDATE_REGISTRATION_STATUS, {
    refetchQueries: [
      {
        query: GET_USER_FULL_REGISTRATION,
        variables: { userId: registration?.userId },
      },
      {
        query: GET_REGISTRATIONS,
        variables: { province: "", type: "", status: "" },
      },
    ],
  });

  const { data: userRegistrationData } = useQuery(GET_USER_FULL_REGISTRATION, {
    variables: { userId: registration?.userId },
    skip: !registration?.userId,
  });

  useEffect(() => {
    if (userRegistrationData) {
      const registrations = userRegistrationData.registrationByUserId;
      if (Array.isArray(registrations)) {
        const found = registrations.find(
          (reg) => reg.luhnRegistrationNumber === registration?.registrationId
        );
        setMatchingRegistration(found || null);
        console.log("matchingRegistration", found);
      } else {
        setMatchingRegistration(userRegistrationData.registrationByUserId);
        console.log(
          "matchingRegistration",
          userRegistrationData.registrationByUserId
        );
      }
    }
  }, [userRegistrationData, registration]);

  useEffect(() => {
    if (!scrollAreaRef.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      {
        root: scrollAreaRef.current.querySelector(
          "[data-radix-scroll-area-viewport]"
        ),
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
  }, [matchingRegistration]);

  useEffect(() => {
    if (matchingRegistration) {
      console.log(matchingRegistration);
    }
  }, [matchingRegistration]);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element && scrollAreaRef.current) {
      const scrollContainer = scrollAreaRef.current.querySelector(
        "[data-radix-scroll-area-viewport]"
      );
      if (scrollContainer) {
        const offset = element.offsetTop - 20; // Add some padding
        scrollContainer.scrollTo({
          top: offset,
          behavior: "smooth",
        });
      }
    }
  };

  const handleAccept = () => {
    setShowAcceptDialog(true);
  };

  const handleReject = () => {
    setShowRejectDialog(true);
  };

  const handleConfirmAccept = async () => {
    if (!registration?.id) {
      toast.error("Registration ID not found");
      return;
    }

    try {
      await updateRegistrationStatus({
        variables: {
          id: registration.id,
          status: "Approved",
          reason: "",
        },
      });

      setShowAcceptDialog(false);

      toast.success("Registration accepted successfully", {
        description: `Registration ${registration.id} has been approved.`,
        duration: 5000,
      });
    } catch (error) {
      console.error("Error accepting registration:", error);
      toast.error("Failed to accept registration", {
        description:
          "An error occurred while accepting the registration. Please try again.",
        duration: 5000,
      });
    }
  };

  const handleConfirmReject = async () => {
    if (!registration?.id) {
      toast.error("Registration ID not found");
      return;
    }

    if (!rejectionReason.trim()) {
      return; // Don't proceed if no reason provided
    }

    try {
      await updateRegistrationStatus({
        variables: {
          id: registration.id,
          status: "Rejected",
          reason: rejectionReason.trim(),
        },
      });

      setShowRejectDialog(false);
      setRejectionReason("");
      toast.error("Registration rejected", {
        description: `Registration ${registration.id} has been rejected.`,
        duration: 5000,
      });
    } catch (error) {
      console.error("Error rejecting registration:", error);
      toast.error("Failed to reject registration", {
        description:
          "An error occurred while rejecting the registration. Please try again.",
        duration: 5000,
      });
    }
  };

  // Determine provider icon and label
  const isPrivate = matchingRegistration?.ptype === "private";
  const ProviderIcon = isPrivate ? Building2 : Landmark;
  const providerLabel = isPrivate
    ? "Private Service Provider"
    : "Provincial Health Authority";

  if (!registration) return null;

  return (
    <>
      {/* Accept Dialog */}
      <AlertDialog open={showAcceptDialog} onOpenChange={setShowAcceptDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirm Registration Acceptance</AlertDialogTitle>
            <AlertDialogDescription>
              By accepting this registration, you confirm that you have
              thoroughly validated all the fields and documents provided. This
              action will approve the registration and notify the applicant.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirmAccept}>
              Accept Registration
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Reject Dialog */}
      <AlertDialog open={showRejectDialog} onOpenChange={setShowRejectDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirm Registration Rejection</AlertDialogTitle>
            <AlertDialogDescription>
              By rejecting this registration, you will need to provide a clear
              reason for the rejection. This action will notify the applicant
              and they will need to address the issues before resubmitting.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="py-4">
            <Textarea
              placeholder="Enter reason for rejection..."
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
              className="min-h-[100px]"
            />
          </div>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setRejectionReason("")}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirmReject}
              disabled={!rejectionReason.trim()}
            >
              Reject Registration
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <Sheet open={open} onOpenChange={onOpenChange}>
        <SheetContent
          side="bottom"
          className="max-w-2xl mx-auto h-[90vh] min-h-[90vh] max-h-[90vh] rounded-t-2xl flex flex-col p-0"
        >
          {/* <div className="flex flex-col h-full"> */}
          <SheetHeader
            className={cn(
              "px-6 pt-6 pb-4 shrink-0 rounded-t-2xl",
              registration.status.toLowerCase() == "pending" && "bg-yellow-100",
              registration.status.toLowerCase() == "approved" && "bg-green-100",
              registration.status.toLowerCase() == "rejected" && "bg-red-100",
              registration.status.toLowerCase() == "acknowledged" &&
                "bg-blue-100"
            )}
          >
            <SheetTitle className="flex items-center gap-4 py-0 text-base">
              <div className="px-3 py-1.5 text-xs rounded-md bg-primary/10 text-primary border capitalize border-primary/20 flex items-center gap-1.5">
                {/* Different Icons for different statuses */}
                {registration.status.toLowerCase() == "pending" ? (
                  <CircleDashed className="h-3 w-3 animate-spin-slow" />
                ) : registration.status.toLowerCase() == "approved" ? (
                  <CheckCircle2 className="h-3 w-3" />
                ) : registration.status.toLowerCase() == "rejected" ? (
                  <XCircle className="h-3 w-3" />
                ) : registration.status.toLowerCase() == "acknowledged" ? (
                  <ThumbsUp className="h-3 w-3" />
                ) : (
                  <CircleDashed className="h-3 w-3 animate-spin-slow" />
                )}
                {registration.status}
              </div>
              <div className="w-1 h-1 bg-muted-foreground rounded-full animate-pulse" />
              <div className="px-3 py-1.5 text-xs rounded-md bg-transparent text-primary border capitalize border-primary/20 flex items-center gap-1">
                <p className="font-semibold">{registration.type}</p>
                <p className="font-normal">Registration</p>
                <ChevronsRight className="h-3 w-3" />
                <p>{registration.registrationId}</p>
              </div>
            </SheetTitle>
          </SheetHeader>

          {!registration.userId ? (
            <div className="flex items-start justify-center h-full px-4">
              <Alert variant="destructive" className="">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Missing User Information</AlertTitle>
                <AlertDescription>
                  This registration is missing user information. Please contact
                  the administrator for assistance.
                </AlertDescription>
              </Alert>
            </div>
          ) : !matchingRegistration ? (
            <div className="flex items-center justify-center h-full">
              <Alert variant="destructive" className="max-w-md">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Registration Not Found</AlertTitle>
                <AlertDescription>
                  No matching registration was found for this ID. Please contact
                  the administrator for assistance.
                </AlertDescription>
              </Alert>
            </div>
          ) : (
            <div className="flex flex-row h-full w-full overflow-hidden px-0 rounded-t-2xl">
              {/* Sidebar: Provider Icon + Nav + Action Buttons */}
              <Card className="flex flex-col items-center ml-6 gap-4 w-fit px-2 shrink-0 pb-4 h-fit rounded-xl">
                {/* Provider Type Icon */}

                <Tooltip defaultOpen={false}>
                  <TooltipTrigger asChild>
                    <Button
                      onClick={() =>
                        scrollToSection("registration-type-section")
                      }
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

                {matchingRegistration.status.toLowerCase() == "pending" && (
                  <>
                    <Separator className="w-full my-1 bg-primary/20" />

                    {/* Action Buttons */}
                    <div className="flex flex-col items-center gap-2">
                      <Tooltip defaultOpen={false}>
                        <TooltipTrigger asChild>
                          <Button
                            onClick={handleAccept}
                            className="bg-accepted border-accepted-foreground border hover:bg-accepted/10 hover:border-accepted transition-colors flex items-center justify-center group/accept-button"
                          >
                            <CheckCircle2 className="h-6 w-6 text-accepted-foreground group-hover/accept-button:text-accepted" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent side="right">
                          <p>Accept</p>
                        </TooltipContent>
                      </Tooltip>

                      <Tooltip defaultOpen={false}>
                        <TooltipTrigger asChild>
                          <Button
                            onClick={handleReject}
                            className="bg-rejected border-rejected-foreground border hover:bg-rejected/10 hover:border-rejected transition-colors flex items-center justify-center group/reject-button"
                          >
                            <XCircle className="h-6 w-6 text-rejected-foreground group-hover/reject-button:text-rejected" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent side="right">
                          <p>Reject</p>
                        </TooltipContent>
                      </Tooltip>
                    </div>
                  </>
                )}
              </Card>
              {/* Center: Main Area (scrollable) */}
              <div className="flex-1 flex flex-col min-w-0 h-full min-h-0">
                <ScrollArea
                  ref={scrollAreaRef}
                  className="flex-1 min-h-0 px-6 overflow-y-auto"
                >
                  <div className="pb-6">
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
                            value: matchingRegistration.luhnRegistrationNumber,
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
                            value:
                              matchingRegistration.public_officer_firstname,
                          },
                          {
                            label: "Last Name",
                            value: matchingRegistration.public_officer_lastname,
                          },
                          {
                            label: "Mobile Number",
                            value: matchingRegistration.mobile_Phone_Number,
                          },
                        ]}
                      />

                      <InfoCard
                        title="Medical Practitioner Details"
                        fields={[
                          {
                            label: "First Name",
                            value:
                              matchingRegistration.medical_Practitioner_firstname,
                          },
                          {
                            label: "Last Name",
                            value:
                              matchingRegistration.medical_Practitioner_lastname,
                          },
                          {
                            label: "Registration Number",
                            value: matchingRegistration.mb_Registration_Number,
                          },
                          {
                            label: "Registration Expiry",
                            value: new Date(
                              matchingRegistration.rn_Expiry
                            ).toLocaleDateString(),
                          },
                          {
                            label: "Terms in Practice",
                            value:
                              matchingRegistration.applicantsTermsInPractice,
                          },
                        ]}
                      />

                      <InfoCard
                        title="P.O Box Details"
                        fields={[
                          {
                            label: "Name",
                            value: matchingRegistration.pbox_Name,
                          },
                          {
                            label: "Number",
                            value: matchingRegistration.pbox_Number,
                          },
                          {
                            label: "Branch",
                            value: matchingRegistration.pbox_Branch,
                          },
                          {
                            label: "Province",
                            value: matchingRegistration.pbox_Province,
                          },
                        ]}
                      />
                    </div>

                    <Separator className="my-8 bg-primary/10" />

                    {/* Business Section */}
                    <div id="business-section" className="space-y-4">
                      <h2 className=" text-lg font-semibold flex items-center gap-2 pl-4">
                        <Building2 className="h-5 w-5" />
                        Business Details
                      </h2>
                      <InfoCard
                        title="Basic Information"
                        fields={[
                          {
                            label: "Practice Name",
                            value: matchingRegistration.practice_Name,
                          },
                          {
                            label: "Email",
                            value: matchingRegistration.email,
                          },
                          {
                            label: "Phone Number",
                            value: matchingRegistration.business_Phone_Number,
                          },
                          {
                            label: "Creation Date",
                            value: new Date(
                              matchingRegistration.location_Creation_Date
                            ).toLocaleDateString(),
                          },
                        ]}
                      />

                      <InfoCard
                        title="Practice Location"
                        fields={[
                          {
                            label: "Section",
                            value: matchingRegistration.practice_Section,
                          },
                          {
                            label: "Lot",
                            value: matchingRegistration.practice_Lot,
                          },
                          {
                            label: "Street",
                            value: matchingRegistration.practice_Street,
                          },
                          {
                            label: "Suburb",
                            value: matchingRegistration.practice_Suburb,
                          },
                          {
                            label: "Province",
                            value: matchingRegistration.practice_Province,
                          },
                        ]}
                      />

                      <InfoCard
                        title="Business Information"
                        fields={[
                          {
                            label: "Business Name",
                            value:
                              matchingRegistration.registered_Business_Name,
                          },
                          {
                            label: "Business Type",
                            value: matchingRegistration.business_Type,
                          },
                          {
                            label: "Premises Type",
                            value: matchingRegistration.premises,
                          },
                          {
                            label: "Employment Status",
                            value:
                              matchingRegistration.applicant_Employment_Status,
                          },
                          {
                            label: "IPA Registration",
                            value: matchingRegistration.ipa_Registration_Number,
                          },
                          {
                            label: "TIN Number",
                            value: matchingRegistration.ipa_Certified_Number,
                          },
                        ]}
                      />
                    </div>

                    <Separator className="my-8 bg-primary/10" />

                    {/* Bank Section */}
                    <div id="bank-section" className="space-y-4">
                      <h2 className=" text-lg font-semibold flex items-center gap-2 pl-4">
                        <Landmark className="h-5 w-5" />
                        Bank Details
                      </h2>
                      <InfoCard
                        title="Banking Information"
                        fields={[
                          {
                            label: "Bank Name",
                            value: matchingRegistration.bank,
                          },
                          {
                            label: "Branch Code",
                            value: matchingRegistration.branch_Number,
                          },
                          {
                            label: "Branch Name",
                            value: matchingRegistration.branch_Name,
                          },
                          {
                            label: "Account Number",
                            value: matchingRegistration.account_Number,
                          },
                          {
                            label: "Account Name",
                            value: matchingRegistration.account_Name,
                          },
                        ]}
                      />
                    </div>

                    <Separator className="my-8 bg-primary/10" />

                    {/* Documents Section */}
                    <div id="documents-section" className="space-y-4">
                      <h2 className=" text-lg font-semibold flex items-center gap-2 pl-4">
                        <FileText className="h-5 w-5" />
                        Required Documents
                      </h2>
                      <div className="grid grid-cols-2 gap-4">
                        {matchingRegistration.ipa_Certificate && (
                          <FileUpload
                            value={matchingRegistration.ipa_Certificate}
                            onChange={() => {}}
                            title="IPA Certificate"
                            viewOnly={true}
                            userBucket={matchingRegistration.bucket}
                          />
                        )}
                        {matchingRegistration.tin_Certificate && (
                          <FileUpload
                            value={matchingRegistration.tin_Certificate}
                            onChange={() => {}}
                            title="TIN Certificate"
                            viewOnly={true}
                            userBucket={matchingRegistration.bucket}
                          />
                        )}
                        {matchingRegistration.medical_Certificate && (
                          <FileUpload
                            value={matchingRegistration.medical_Certificate}
                            onChange={() => {}}
                            title="Medical Certificate"
                            viewOnly={true}
                            userBucket={matchingRegistration.bucket}
                          />
                        )}
                      </div>
                    </div>

                    <Separator className="my-8 bg-primary/10" />

                    {/* Signature Section */}
                    <div id="signature-section" className="space-y-4">
                      <h2 className=" text-lg font-semibold flex items-center gap-2 pl-4">
                        <FileSignature className="h-5 w-5" />
                        Signature Information
                      </h2>
                      <div className="grid grid-cols-2 gap-4">
                        <SignaturePreviewCard
                          filename={
                            matchingRegistration.medical_Practitioner_Signiture ||
                            ""
                          }
                          viewOnly={true}
                          userBucket={matchingRegistration.bucket}
                        />
                      </div>
                    </div>
                  </div>
                </ScrollArea>
              </div>
            </div>
          )}
          {/* </div> */}
        </SheetContent>
      </Sheet>
    </>
  );
};

/**
 * ViewRegistrationModal Component
 *
 * Modal dialog for viewing registration details, documents, and approving/rejecting registrations.
 *
 * @param {ViewRegistrationModalProps} props - Component props
 * @returns {JSX.Element} The rendered view registration modal
 *
 * @example
 * ```tsx
 * <ViewRegistrationModal registration={registration} open={open} onOpenChange={setOpen} />
 * ```
 */
export function ViewRegistrationModal({
  registration,
  open,
  onOpenChange,
}: ViewRegistrationModalProps) {
  return (
    <ViewRegistrationModalContent
      registration={registration}
      open={open}
      onOpenChange={onOpenChange}
    />
  );
}
