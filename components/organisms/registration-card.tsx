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
import { useState } from "react";

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
    ptype: "private" | "public";
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
  const [isHovering, setIsHovering] = useState(false);

  const isDisabled = latestDraft?.ptype !== registrationType && !!latestDraft;

  const draftState: DraftStateProps = {
    isDisabled,
    hasDraft: !!latestDraft,
    draftType: latestDraft?.ptype,
    ptype: registrationType,
  };

  const onClearDraft = () => {
    // TODO: Implement clear draft functionality
    console.log("Clear draft clicked");
  };

  const renderDraftState = (props: DraftStateProps) => {
    const { isDisabled, hasDraft, draftType, ptype } = props;

    if (isDisabled) {
      return (
        <>
          <Ban className="w-4 h-4 text-destructive" />
          <p className="text-destructive text-xs font-semibold">Disabled</p>
        </>
      );
    }

    if (hasDraft && draftType === ptype) {
      return (
        <>
          <CornerDownLeft className="w-4 h-4 text-white" />
          <p className="text-white text-xs flex items-center gap-1 font-semibold bg-blue-700 px-2 py-1 rounded transition-all duration-300 group-hover:bg-transparent group-hover:text-muted-foreground">
            <FilePen className="w-3.5 h-3.5" />
            <span className="group-hover:hidden">Active Draft</span>
            <span className="hidden group-hover:inline">
              {isHovering ? "Delete Draft" : "Resume Draft"}
            </span>
          </p>
        </>
      );
    }

    return (
      <>
        <Clock className="w-4 h-4 text-muted-foreground" />
        <p className="text-muted-foreground text-xs font-semibold">
          ~10 minutes
        </p>
      </>
    );
  };

  return (
    <div className="flex flex-col -space-y-16 gap-0 group transition-all duration-300 hover:gap-8 w-full">
      {draftState.hasDraft && draftState.draftType === draftState.ptype && (
        <div
          className={cn(
            "w-full h-24 rounded-xl flex items-center justify-between px-6 transition-colors duration-300",
            headerColor
          )}
        >
          <p
            key={isHovering ? "delete-draft" : "active-draft"}
            className="text-background animate-slide-left-fade-in text-lg font-bold group-hover:-mt-8 transition-all duration-300"
          >
            {isHovering ? "Delete Draft?" : "Active Draft"}
          </p>
          <Button
            variant="ghost"
            size="icon"
            className="gap-2 group-hover:-mt-8 transition-all duration-300 bg-white border-2 border-destructive/20 hover:bg-destructive/10 h-7 w-7 p-1"
            onMouseEnter={() => {
              setHeaderColor("bg-red-900");
              setIsHovering(true);
            }}
            onMouseLeave={() => {
              setHeaderColor("bg-blue-700");
              setIsHovering(false);
            }}
            onClick={onClearDraft}
          >
            <Trash2 className="w-3 h-3 text-destructive group-hover:animate-shake-once" />
          </Button>
        </div>
      )}
      <Link href={href} className={cn(isDisabled && "pointer-events-none")}>
        <Card
          className={cn(
            "transition-colors cursor-pointer animate-slide-left-fade-in",
            isDisabled && "opacity-40"
          )}
        >
          <CardHeader className="flex flex-row items-center justify-between gap-4">
            <div className="flex flex-row items-center gap-4">
              <Icon className="h-8 w-8" />
              <div className="flex flex-col gap-1">
                <CardTitle>{title}</CardTitle>
                <CardDescription>{description}</CardDescription>
              </div>
            </div>
            <div className="flex flex-row items-center gap-2 px-3 py-1.5 rounded-md">
              {renderDraftState({ ...draftState, isHovering })}
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
    </div>
  );
}
