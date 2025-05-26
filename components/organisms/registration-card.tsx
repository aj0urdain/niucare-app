import Link from "next/link";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import {
  LucideIcon,
  UserCheck,
  Building2,
  Landmark,
  FileText,
  FileSignature,
  Hospital,
  Clock,
  Ban,
  CornerDownLeft,
  FilePen,
  Trash2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetFooter,
} from "@/components/ui/sheet";
import { toast } from "sonner";
import { useMutation } from "@apollo/client";
import { ADD_OR_UPDATE_DRAFT } from "@/lib/graphql/mutations";
import { DRAFTS_BY_USER_ID } from "@/lib/graphql/queries";
import { useUserProfileStore } from "@/stores/user-profile-store";

interface DraftStateProps {
  isDisabled: boolean;
  hasDraft: boolean;
  draftType?: string;
  isHovering?: boolean;
  ptype: "private" | "public";
}

interface RegistrationCardProps {
  title: string;
  description: string;
  icon: LucideIcon;
  href: string;
  registrationType: "private" | "public";
  latestDraft?: {
    id?: string;
    ptype: "private" | "public";
    updated_Date: string | number | Date;
    reason?: string;
  } | null;
}

const privateRequirements = [
  {
    icon: UserCheck,
    title: "Officer Details",
    description: "Public officer and medical practitioner information",
  },
  {
    icon: Building2,
    title: "Business Details",
    description: "Service provider and practice information",
  },
  {
    icon: Landmark,
    title: "Bank Details",
    description: "Banking and payment information",
  },
  {
    icon: FileText,
    title: "Documents",
    description: "IPA, TIN, and medical board certificates",
  },
  {
    icon: FileSignature,
    title: "Signature",
    description: "Draw on screen or upload signature file",
  },
];

const publicRequirements = [
  {
    icon: UserCheck,
    title: "Public Officer Details",
    description: "Officer information and P.O Box details",
  },
  {
    icon: Hospital,
    title: "Provincial Health Authority",
    description: "PHA details, location, and practice information",
  },
  {
    icon: Landmark,
    title: "Bank Details",
    description: "Banking and payment information",
  },
  {
    icon: FileText,
    title: "Documents",
    description: "TIN certificate and authorization",
  },
  {
    icon: FileSignature,
    title: "Signature",
    description: "Draw on screen or upload signature file",
  },
];

export function RegistrationCard({
  title,
  description,
  icon: Icon,
  href,
  latestDraft,
  registrationType,
}: RegistrationCardProps) {
  const [headerColor, setHeaderColor] = useState("bg-blue-700");
  const [isTrashButtonHovered, setIsTrashButtonHovered] = useState(false);
  const [isDeleteSheetOpen, setIsDeleteSheetOpen] = useState(false);
  const { user } = useUserProfileStore();
  const [addOrUpdateDraft] = useMutation(ADD_OR_UPDATE_DRAFT, {
    refetchQueries: [
      {
        query: DRAFTS_BY_USER_ID,
        variables: {
          userId: user?.userId || "",
        },
      },
    ],
  });

  useEffect(() => {
    console.log("latestDraft", latestDraft);
  }, [latestDraft]);

  const isDisabled = latestDraft?.ptype !== registrationType && !!latestDraft;
  const isRejected = !!latestDraft?.reason;

  const draftState: DraftStateProps = {
    isDisabled,
    hasDraft: !!latestDraft,
    draftType: latestDraft?.ptype,
    ptype: registrationType,
  };

  const onClearDraft = () => {
    setIsDeleteSheetOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!user?.userId) {
      toast.error("User ID not found");
      return;
    }

    try {
      await addOrUpdateDraft({
        variables: {
          draft: {
            ptype: null,
            isPsnaProvider: false,
            // Set all other fields to null/empty
            public_officer_firstname: null,
            public_officer_lastname: null,
            ipa_Certified_Number: null,
            mb_Registration_Number: null,
            rn_Expiry: null,
            applicantsTermsInPractice: null,
            postal_Section: null,
            postal_Lot: null,
            postal_Street: null,
            postal_Suburb: null,
            postal_Province: null,
            business_Phone_Number: null,
            mobile_Phone_Number: null,
            email: null,
            location_Creation_Date: null,
            practice_Name: null,
            practice_Section: null,
            practice_Lot: null,
            practice_Street: null,
            practice_Suburb: null,
            practice_Province: null,
            location_Phone_Number: null,
            location_Email: null,
            applicant_Employment_Status: null,
            registered_Business_Name: null,
            ipa_Registration_Number: null,
            business_Type: null,
            premises: null,
            bank: null,
            branch_Number: null,
            branch_Name: null,
            account_Number: null,
            account_Name: null,
            medical_Practitioner_firstname: null,
            medical_Practitioner_lastname: null,
            medical_Practitioner_Signiture: null,
            ipa_Certificate: null,
            tin_Certificate: null,
            medical_Certificate: null,
            luhnRegistrationNumber: null,
            pbox_Name: null,
            pbox_Number: null,
            pbox_Branch: null,
            pbox_Province: null,
            bucket: null,
            reason: null,
          },
        },
      });
      toast.success("Draft deleted successfully");
      setIsDeleteSheetOpen(false);
    } catch (error) {
      console.error("Error deleting draft:", error);
      toast.error("Failed to delete draft");
    }
  };

  const renderDraftState = (props: DraftStateProps) => {
    const { isDisabled, hasDraft, isHovering } = props;

    if (!hasDraft) {
      return (
        <p className="text-muted-foreground text-xs font-semibold flex items-center gap-1 border border-muted-foreground/20 rounded-md px-2 py-1">
          <Clock className="w-4 h-4" />
          <span>~10 minutes</span>
        </p>
      );
    }

    if (isDisabled) {
      return (
        <p
          className={cn(
            "text-destructive text-sm flex items-center gap-1 font-semibold px-2 py-1 rounded transition-all border border-transparent duration-300"
          )}
        >
          <Ban className="w-4 h-4" />
          Disabled
        </p>
      );
    }

    return (
      <>
        <p
          className={cn(
            "text-white text-sm flex items-center gap-1 font-semibold px-2 py-1 rounded transition-all border border-transparent duration-300",
            isHovering
              ? "group-hover:bg-destructive/20 group-hover:border-destructive text-destructive animate-pulse"
              : "bg-blue-700 group-hover:bg-transparent group-hover:border-blue-700 group-hover:animate-pulse group-hover:text-blue-700"
          )}
        >
          {isHovering ? (
            <Trash2 className="w-3.5 h-3.5 pr-0.5 animate-slide-left-fade-in text-destructive" />
          ) : (
            <>
              <CornerDownLeft className="hidden group-hover:inline w-3.5 h-3.5 animate-slide-left-fade-in text-blue-700" />
              <FilePen className="inline group-hover:hidden w-3.5 h-3.5 animate-slide-left-fade-in" />
            </>
          )}

          <span className="inline group-hover:hidden animate-slide-right-fade-in">
            Active
          </span>
          <span
            className={cn(
              "hidden group-hover:inline",
              isHovering ? "text-destructive" : "group-hover:text-blue-700"
            )}
          >
            {isHovering ? "Delete" : "Resume"}
          </span>
          <span>Draft</span>
        </p>
      </>
    );
  };

  return (
    <div
      className={cn(
        "flex flex-col -space-y-16 gap-0 group transition-all duration-300 hover:gap-8 w-full",
        isDisabled && "cursor-not-allowed opacity-20 hover:opacity-30"
      )}
    >
      {draftState.hasDraft && draftState.draftType === draftState.ptype && (
        <div
          className={cn(
            "w-full h-24 rounded-xl flex items-center justify-between px-6 transition-colors duration-300 animate-slide-up-fade-in",
            isRejected ? "bg-red-900" : headerColor
          )}
        >
          <p
            key={isTrashButtonHovered ? "delete-draft" : "active-draft"}
            className="text-background animate-slide-left-fade-in text-lg font-bold group-hover:-mt-8 transition-all duration-300"
          >
            {isTrashButtonHovered
              ? "Delete Draft?"
              : isRejected
              ? "Rejected Registration"
              : "Active Draft"}
          </p>
          <Button
            variant="ghost"
            size="icon"
            className="gap-2 group/trash-button group-hover:-mt-8 transition-all cursor-pointer duration-300 bg-white border-2 border-destructive/20 hover:bg-destructive/10 h-7 w-7 p-1 hover:border-background"
            onMouseEnter={() => {
              setHeaderColor("bg-red-900");
              setIsTrashButtonHovered(true);
            }}
            onMouseLeave={() => {
              setHeaderColor(isRejected ? "bg-red-900" : "bg-blue-700");
              setIsTrashButtonHovered(false);
            }}
            onClick={onClearDraft}
          >
            <Trash2 className="w-3 h-3 text-destructive group-hover/trash-button:animate-shake-twice group-hover/trash-button:text-background" />
          </Button>
        </div>
      )}
      <Link href={href} className={cn(isDisabled && "pointer-events-none")}>
        <Card
          className={cn(
            "transition-colors cursor-pointer animate-slide-left-fade-in hover:bg-muted"
          )}
        >
          <CardHeader className="flex items-center flex-row justify-between">
            <div className="flex flex-row items-center gap-4">
              <Icon className="h-8 w-8" />
              <div className="flex flex-col gap-1">
                <CardTitle>{title}</CardTitle>
                <CardDescription>{description}</CardDescription>
              </div>
            </div>
            <div className="flex flex-col gap-1 rounded-md items-end justify-start">
              {renderDraftState({
                ...draftState,
                isHovering: isTrashButtonHovered,
              })}
              {latestDraft &&
                latestDraft.updated_Date &&
                registrationType == latestDraft.ptype && (
                  <p className="text-muted-foreground text-xs pr-2">
                    {new Date(latestDraft.updated_Date).toLocaleDateString(
                      "en-US",
                      {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      }
                    )}
                  </p>
                )}
            </div>
          </CardHeader>
          <Separator className="" />
          <CardContent className="mt-4">
            <p className="text-muted-foreground text-xs mb-2 w-1/2">
              To complete this form, please make sure you have the following
              information available:
            </p>
            <div className="space-y-4 text-sm pt-4">
              {registrationType === "private"
                ? privateRequirements.map((req, index) => (
                    <div key={index} className="flex items-start gap-2">
                      <req.icon className="w-4 h-4 text-muted-foreground mt-0.5" />
                      <div>
                        <p className="font-medium">{req.title}</p>
                        <p className="text-muted-foreground text-xs">
                          {req.description}
                        </p>
                      </div>
                    </div>
                  ))
                : publicRequirements.map((req, index) => (
                    <div key={index} className="flex items-start gap-2">
                      <req.icon className="w-4 h-4 text-muted-foreground mt-0.5" />
                      <div>
                        <p className="font-medium">{req.title}</p>
                        <p className="text-muted-foreground text-xs">
                          {req.description}
                        </p>
                      </div>
                    </div>
                  ))}
            </div>
          </CardContent>
        </Card>
      </Link>

      <Sheet open={isDeleteSheetOpen} onOpenChange={setIsDeleteSheetOpen}>
        <SheetContent
          side="top"
          className="max-w-xl mx-auto min-h-fit max-h-[90vh] rounded-b-xl animate-in slide-in-from-top duration-500"
        >
          <SheetHeader>
            <SheetTitle>You are about to delete your current draft</SheetTitle>
            <SheetDescription>
              Are you sure you want to delete this draft? This action cannot be
              undone.
            </SheetDescription>
          </SheetHeader>
          <SheetFooter className="flex flex-row gap-2 justify-end mt-6">
            <Button variant="ghost" onClick={() => setIsDeleteSheetOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDeleteConfirm}>
              Delete
            </Button>
          </SheetFooter>
        </SheetContent>
      </Sheet>
    </div>
  );
}
