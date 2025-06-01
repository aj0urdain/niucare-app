/**
 * File: components/organisms/view-claim-modal.tsx
 * Description: Modal component for viewing claim details, files, and approving/rejecting claims
 * Author: Aaron J. Girton - https://github.com/aj0urdain
 * Created: 2025
 */

import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  FileDown,
  UserRoundSearch,
  IdCard,
  Venus,
  Mars,
  Cake,
  CircleCheckBig,
  XCircle,
  CircleDashed,
  Component,
  Info,
  ClipboardList,
  ChevronDown,
  ChevronsRight,
} from "lucide-react";
import { Claim } from "@/components/atoms/columns-data";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
  TooltipProvider,
} from "@/components/ui/tooltip";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import { useSearchParams, useRouter } from "next/navigation";
import { useEffect, useState, Suspense, useRef, useMemo } from "react";
import { useQuery, useMutation } from "@apollo/client";
import {
  GET_POLICY_HOLDER_BY_EMPLOYEE_NO,
  GET_POLICYHOLDERCLAIMS,
} from "@/lib/graphql/queries";
import { UPDATE_CLAIM_STATUS } from "@/lib/graphql/mutations";
import { useUserProfileStore } from "@/stores/user-profile-store";
import { ScrollArea } from "@/components/ui/scroll-area";
import { InfoCard } from "@/components/molecules/info-card";
import { FileUpload } from "@/components/molecules/file-upload";

/**
 * Props for the ViewClaimModal component
 * @property claim - Claim data to display
 * @property open - Whether the modal is open
 * @property onOpenChange - Callback for modal open state change
 */
interface ViewClaimModalProps {
  claim: Claim | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const ViewClaimModalContent = ({
  claim,
  open,
  onOpenChange,
}: ViewClaimModalProps) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [activeTab, setActiveTab] = useState<"overview" | "details" | "files">(
    "overview"
  );
  const [rejectionDialogOpen, setRejectionDialogOpen] = useState(false);
  const [approvalDialogOpen, setApprovalDialogOpen] = useState(false);
  const [rejectionReason, setRejectionReason] = useState("");
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  const { user } = useUserProfileStore();

  const canApproveClaim = user?.permissions?.canApproveRegistration;

  const [updateClaimStatus] = useMutation(UPDATE_CLAIM_STATUS, {
    onCompleted: (data) => {
      if (data.updateClaimStatus.status === "Approved") {
        toast.success("Claim approved successfully");
      } else {
        toast.success("Claim rejected successfully");
      }
    },
    onError: (error) => {
      toast.error(error.message || "Failed to update claim status");
    },
    refetchQueries: [GET_POLICYHOLDERCLAIMS],
  });

  // Parse the viewFiles string into an array with error handling
  const files = useMemo(() => {
    if (!claim?.viewFiles) return [];
    try {
      // First try parsing as JSON
      const parsed = JSON.parse(claim.viewFiles);
      return Array.isArray(parsed) ? parsed : [parsed];
    } catch {
      // If JSON parsing fails, treat the string as a single file path
      // Split by comma if multiple files are present
      const fileList = claim.viewFiles.split(",").map((file) => file.trim());
      return fileList.filter((file) => file.length > 0);
    }
  }, [claim?.viewFiles]);

  // Log the raw claim data
  useEffect(() => {
    console.log("Raw claim data:", claim);
  }, [claim]);

  const { data: policyHolderData, loading: policyHolderLoading } = useQuery(
    GET_POLICY_HOLDER_BY_EMPLOYEE_NO,
    {
      variables: { employeeNo: claim?.employeeNumber },
      skip: !claim?.employeeNumber,
    }
  );

  const policyHolder = policyHolderData?.policyHolderByEmployeeNo?.[0];

  // Sync URL with modal state
  useEffect(() => {
    const currentParams = new URLSearchParams(window.location.search);
    const currentId = currentParams.get("id");
    const currentTab = currentParams.get("sheetTab");

    if (open && claim) {
      // Only update if values are different
      if (
        currentId !== claim.id ||
        (activeTab !== "overview" && currentTab !== activeTab)
      ) {
        const params = new URLSearchParams();
        params.set("id", claim.id);
        if (activeTab !== "overview") {
          params.set("sheetTab", activeTab);
        }
        router.push(`?${params.toString()}`);
      }
    } else if (!open && currentId) {
      // Only clear if there's actually something to clear
      router.push("?");
    }
  }, [open, claim, activeTab, router]);

  // Sync tab state with URL on mount
  useEffect(() => {
    const tab = searchParams.get("sheetTab") as
      | "overview"
      | "details"
      | "files"
      | null;
    if (tab && ["overview", "details", "files"].includes(tab)) {
      setActiveTab(tab);
    }
  }, [searchParams]);

  // Update URL when modal state changes
  const handleOpenChange = (open: boolean) => {
    onOpenChange(open);
  };

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element && scrollAreaRef.current) {
      const scrollContainer = scrollAreaRef.current.querySelector(
        "[data-radix-scroll-area-viewport]"
      );
      if (scrollContainer) {
        const offset = element.offsetTop - 20;
        scrollContainer.scrollTo({
          top: offset,
          behavior: "smooth",
        });
      }
    }
  };

  const handleApproveClaim = async () => {
    try {
      await updateClaimStatus({
        variables: {
          id: parseInt(claim?.id || "0"),
          status: "Approved",
          reason: "",
        },
      });
      setApprovalDialogOpen(false);
      onOpenChange(false);
    } catch (error) {
      console.error("Error approving claim:", error);
    }
  };

  const handleRejectClaim = async () => {
    try {
      if (!rejectionReason.trim()) {
        toast.error("Please provide a reason for rejection");
        return;
      }
      await updateClaimStatus({
        variables: {
          id: parseInt(claim?.id || "0"),
          status: "Rejected",
          reason: rejectionReason.trim(),
        },
      });
      setRejectionDialogOpen(false);
      setRejectionReason("");
      onOpenChange(false);
    } catch (error) {
      console.error("Error rejecting claim:", error);
    }
  };

  if (!claim) return null;

  return (
    <Sheet open={open} onOpenChange={handleOpenChange}>
      <SheetContent
        side="bottom"
        className="max-w-xl mx-auto h-[90vh] min-h-[90vh] max-h-[90vh] rounded-t-2xl flex flex-col p-0"
      >
        <SheetHeader
          className={cn(
            "px-6 pt-6 pb-4 shrink-0 rounded-t-2xl",
            claim.status === "pending" && "bg-yellow-100",
            claim.status === "approved" && "bg-green-100",
            claim.status === "rejected" && "bg-red-100"
          )}
        >
          <SheetTitle className="flex items-center gap-4 py-0 text-base">
            <div
              className={cn(
                "px-3 py-1.5 text-xs rounded-md bg-primary/10 text-primary border capitalize border-primary/20 flex items-center gap-1.5",
                claim.status === "approved" &&
                  "bg-green-900/25 text-green-800 dark:text-green-400 border-green-700/50",
                claim.status === "rejected" &&
                  "bg-red-900/25 text-red-800 dark:text-red-400 border-red-700/50",
                claim.status === "pending" &&
                  "bg-yellow-900/25 text-yellow-800 dark:text-yellow-400 border-yellow-700/50"
              )}
            >
              {claim.status === "pending" ? (
                <CircleDashed className="h-3 w-3 animate-spin-slow" />
              ) : claim.status === "approved" ? (
                <CircleCheckBig className="h-3 w-3" />
              ) : claim.status === "rejected" ? (
                <XCircle className="h-3 w-3" />
              ) : (
                <CircleDashed className="h-3 w-3 animate-spin-slow" />
              )}
              {claim.status}
            </div>
            <div className="w-1 h-1 bg-muted-foreground rounded-full animate-pulse" />
            <div className="px-3 py-1.5 text-xs rounded-md bg-transparent text-primary border capitalize border-primary/20 flex items-center gap-1">
              <p className="font-semibold">{claim.claimType}</p>
              <p className="font-normal">Claim</p>
              <ChevronsRight className="h-3 w-3" />
              <p>{claim.claimId}</p>
            </div>
          </SheetTitle>
        </SheetHeader>

        <div className="flex flex-row h-full w-full overflow-hidden px-0 rounded-t-2xl">
          {/* Sidebar: Navigation Icons */}
          <Card className="flex flex-col items-center ml-6 gap-4 w-fit px-2 shrink-0 pb-4 h-fit rounded-xl">
            <div className="flex flex-col items-center gap-2 mt-2">
              <TooltipProvider>
                <Tooltip defaultOpen={false}>
                  <TooltipTrigger asChild>
                    <Button
                      onClick={() => scrollToSection("overview-section")}
                      variant="ghost"
                    >
                      <Info className="h-5 w-5" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent side="right">
                    <p>Overview</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
              <TooltipProvider>
                <Tooltip defaultOpen={false}>
                  <TooltipTrigger asChild>
                    <Button
                      onClick={() => scrollToSection("details-section")}
                      variant="ghost"
                    >
                      <ClipboardList className="h-5 w-5" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent side="right">
                    <p>Details</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
              <TooltipProvider>
                <Tooltip defaultOpen={false}>
                  <TooltipTrigger asChild>
                    <Button
                      onClick={() => scrollToSection("files-section")}
                      variant="ghost"
                    >
                      <FileDown className="h-5 w-5" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent side="right">
                    <p>Files</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>

            {canApproveClaim && claim.status === "pending" && (
              <>
                <Separator className="w-full my-1 bg-primary/20" />
                <div className="flex flex-col items-center gap-2">
                  <TooltipProvider>
                    <Tooltip defaultOpen={false}>
                      <TooltipTrigger asChild>
                        <Button
                          onClick={() => setApprovalDialogOpen(true)}
                          className="bg-green-600/50 border-green-800 border hover:bg-green-700 transition-colors flex items-center justify-center group/accept-button"
                        >
                          <CircleCheckBig className="h-6 w-6 text-green-900 group-hover/accept-button:text-green-100" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent side="right">
                        <p>Approve</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                  <TooltipProvider>
                    <Tooltip defaultOpen={false}>
                      <TooltipTrigger asChild>
                        <Button
                          onClick={() => setRejectionDialogOpen(true)}
                          className="bg-red-600/50 border-red-800 border hover:bg-red-700 transition-colors flex items-center justify-center group/reject-button"
                        >
                          <XCircle className="h-6 w-6 text-red-900 group-hover/reject-button:text-red-100" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent side="right">
                        <p>Reject</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
              </>
            )}
          </Card>

          {/* Main Content Area */}
          <div className="flex-1 flex flex-col min-w-0 h-full min-h-0">
            <ScrollArea
              ref={scrollAreaRef}
              className="flex-1 min-h-0 px-6 overflow-y-auto"
            >
              <div className="pb-6">
                {/* Overview Section */}
                <div id="overview-section" className="space-y-4">
                  <h2 className="text-lg font-semibold flex items-center gap-2 pl-4">
                    <Info className="h-5 w-5" />
                    Overview
                  </h2>
                  <Card className="relative bg-muted w-full flex flex-col animate-slide-left-fade-in">
                    <UserRoundSearch className="absolute right-4 top-4 h-32 w-32 rotate-12 opacity-5" />
                    <CardHeader>
                      <CardTitle className="text-lg font-semibold w-fit">
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <div className="grid gap-2">
                              <div className="flex items-center gap-1 text-muted-foreground font-semibold text-sm">
                                <IdCard className="h-5 w-5" />
                                <span className="">{claim.employeeNumber}</span>
                              </div>
                            </div>
                          </TooltipTrigger>
                          <TooltipContent side="right">
                            Employee ID
                          </TooltipContent>
                        </Tooltip>
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="flex flex-col gap-2 flex-1">
                      <div className="grid gap-2">
                        <div className="font-bold text-3xl">
                          {policyHolderLoading ? (
                            <div className="animate-pulse bg-muted-foreground/20 h-8 w-48 rounded" />
                          ) : (
                            policyHolder?.name || "N/A"
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="flex items-center gap-0.5 text-muted-foreground font-medium text-xs">
                          {policyHolder?.gender === "M" ? (
                            <>
                              <Mars className="h-4 w-4" />
                              <span className="font-medium text-sm uppercase">
                                Male
                              </span>
                            </>
                          ) : (
                            <>
                              <Venus className="h-4 w-4" />
                              <span className="">Female</span>
                            </>
                          )}
                        </div>
                        <div className="w-0.5 h-0.5 bg-muted-foreground rounded-full" />
                        <div className="flex items-center gap-1 text-muted-foreground font-medium text-xs">
                          <Cake className="h-4 w-4 text-muted-foreground" />
                          <span className="">
                            {policyHolder?.dateOfBirth
                              ? new Date(
                                  policyHolder.dateOfBirth
                                ).toLocaleDateString()
                              : "N/A"}
                          </span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <div className="animate-slide-up-fade-in w-full">
                    <div className="flex justify-center gap-2 w-full animate-pulse">
                      <ChevronDown className="h-6 w-6 text-muted-foreground" />
                      <ChevronDown className="h-6 w-6 text-muted-foreground opacity-90" />
                      <ChevronDown className="h-6 w-6 text-muted-foreground opacity-80" />
                      <ChevronDown className="h-6 w-6 text-muted-foreground opacity-70" />
                      <ChevronDown className="h-6 w-6 text-muted-foreground opacity-60" />
                      <ChevronDown className="h-6 w-6 text-muted-foreground opacity-50" />
                      <ChevronDown className="h-6 w-6 text-muted-foreground opacity-60" />
                      <ChevronDown className="h-6 w-6 text-muted-foreground opacity-70" />
                      <ChevronDown className="h-6 w-6 text-muted-foreground opacity-80" />
                      <ChevronDown className="h-6 w-6 text-muted-foreground opacity-90" />
                      <ChevronDown className="h-6 w-6 text-muted-foreground" />
                    </div>
                  </div>

                  <Card
                    className={cn(
                      "relative w-full flex flex-col border-2 border-muted-foreground animate-slide-right-fade-in",
                      claim.status === "approved" &&
                        "bg-green-500/30 border-green-500",
                      claim.status === "rejected" &&
                        "bg-red-500/30 border-red-500",
                      claim.status === "pending" &&
                        "bg-yellow-500/30 border-yellow-500"
                    )}
                  >
                    {claim.status === "approved" && (
                      <CircleCheckBig className="absolute right-4 top-4 h-32 w-32 rotate-12 opacity-5" />
                    )}
                    {claim.status === "rejected" && (
                      <XCircle className="absolute right-4 top-4 h-32 w-32 rotate-12 opacity-5" />
                    )}
                    {claim.status === "pending" && (
                      <CircleDashed className="absolute right-4 top-4 h-32 w-32 opacity-5 animate-spin [animation-duration:8s]" />
                    )}

                    <CardHeader>
                      <CardTitle
                        className={cn(
                          "text-lg font-semibold w-fit flex items-center gap-1",
                          claim.status === "approved" &&
                            "text-green-800 dark:text-green-400",
                          claim.status === "rejected" &&
                            "text-red-800 dark:text-red-400",
                          claim.status === "pending" &&
                            "text-yellow-800 dark:text-yellow-400"
                        )}
                      >
                        <Component className="h-4 w-4" />
                        <span className="text-ellipsis line-clamp-1">
                          {claim.claimType}
                        </span>
                      </CardTitle>
                      <CardDescription
                        className={cn(
                          "text-sm",
                          claim.status === "approved" &&
                            "text-green-800/60 dark:text-green-400/60",
                          claim.status === "rejected" &&
                            "text-red-800/60 dark:text-red-400/60",
                          claim.status === "pending" &&
                            "text-yellow-800/60 dark:text-yellow-400/60"
                        )}
                      >
                        {claim.description || "No description provided."}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="flex flex-col gap-4 flex-1">
                      <div className="flex gap-2">
                        {files.map((file, index) => (
                          <Tooltip key={index}>
                            <TooltipTrigger asChild>
                              <Button
                                variant="outline"
                                size="icon"
                                className="h-8 w-8"
                              >
                                <FileDown className="h-4 w-4" />
                                <span className="sr-only">Download {file}</span>
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent side="bottom">
                              {file}
                            </TooltipContent>
                          </Tooltip>
                        ))}
                      </div>
                      <Separator
                        className={cn(
                          "my-2",
                          claim.status === "approved" && "bg-green-500",
                          claim.status === "rejected" && "bg-red-500",
                          claim.status === "pending" && "bg-yellow-500"
                        )}
                      />

                      <div
                        className={cn(
                          "font-bold text-3xl",
                          claim.status === "approved" &&
                            "text-green-800 dark:text-green-400",
                          claim.status === "rejected" &&
                            "text-red-800 dark:text-red-400",
                          claim.status === "pending" &&
                            "text-yellow-800 dark:text-yellow-400 animate-pulse"
                        )}
                      >
                        {new Intl.NumberFormat("en-US", {
                          style: "currency",
                          currency: "PGK",
                        }).format(claim.amount)}
                      </div>
                    </CardContent>
                  </Card>
                </div>

                <Separator className="my-8 bg-primary/10" />

                {/* Details Section */}
                <div id="details-section" className="space-y-4">
                  <h2 className="text-lg font-semibold flex items-center gap-2 pl-4">
                    <ClipboardList className="h-5 w-5" />
                    Details
                  </h2>
                  <InfoCard
                    title="Employee Information"
                    fields={[
                      {
                        label: "Employee Name",
                        value: policyHolder?.name || "N/A",
                      },
                      {
                        label: "Employee Number",
                        value: claim.employeeNumber,
                      },
                      {
                        label: "Gender",
                        value: policyHolder?.gender === "M" ? "Male" : "Female",
                      },
                      {
                        label: "Date of Birth",
                        value: policyHolder?.dateOfBirth
                          ? new Date(
                              policyHolder.dateOfBirth
                            ).toLocaleDateString()
                          : "N/A",
                      },
                    ]}
                  />

                  <InfoCard
                    title="Claim Information"
                    fields={[
                      {
                        label: "Claim ID",
                        value: claim.claimId,
                      },
                      {
                        label: "Claim Type",
                        value: claim.claimType,
                      },
                      {
                        label: "Status",
                        value:
                          claim.status.charAt(0).toUpperCase() +
                          claim.status.slice(1),
                      },
                      {
                        label: "Amount",
                        value: new Intl.NumberFormat("en-US", {
                          style: "currency",
                          currency: "PGK",
                        }).format(claim.amount),
                      },
                      {
                        label: "Description",
                        value: claim.description || "No description provided.",
                      },
                    ]}
                  />
                </div>

                <Separator className="my-8 bg-primary/10" />

                {/* Files Section */}
                <div id="files-section" className="space-y-4">
                  <h2 className="text-lg font-semibold flex items-center gap-2 pl-4">
                    <FileDown className="h-5 w-5" />
                    Files
                  </h2>
                  <div className="grid grid-cols-2 gap-4">
                    {files.length > 0 ? (
                      files.map((file: string, index: number) => (
                        <FileUpload
                          key={index}
                          value={file}
                          onChange={() => {}}
                          title={`File ${index + 1}`}
                          viewOnly={true}
                          userBucket={claim.userBucket}
                        />
                      ))
                    ) : (
                      <div className="col-span-2 text-center text-sm text-muted-foreground">
                        No files available for this claim.
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </ScrollArea>
          </div>
        </div>

        <Dialog
          open={rejectionDialogOpen}
          onOpenChange={setRejectionDialogOpen}
        >
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Reject Claim</DialogTitle>
              <DialogDescription>
                Please provide a reason for rejecting this claim. This
                information will be visible to the employee.
              </DialogDescription>
            </DialogHeader>
            <div className="py-4">
              <Textarea
                placeholder="Enter rejection reason..."
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                className="min-h-[100px]"
              />
            </div>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => {
                  setRejectionDialogOpen(false);
                  setRejectionReason("");
                }}
              >
                Cancel
              </Button>
              <Button variant="destructive" onClick={handleRejectClaim}>
                Reject Claim
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        <Dialog open={approvalDialogOpen} onOpenChange={setApprovalDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Approve Claim</DialogTitle>
              <DialogDescription>
                Are you sure you want to approve this claim?
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setApprovalDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button
                variant="default"
                className="bg-green-600 hover:bg-green-700"
                onClick={handleApproveClaim}
              >
                Approve Claim
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </SheetContent>
    </Sheet>
  );
};

/**
 * ViewClaimModal Component
 *
 * Modal dialog for viewing claim details, files, and approving/rejecting claims.
 *
 * @param {ViewClaimModalProps} props - Component props
 * @returns {JSX.Element} The rendered view claim modal
 *
 * @example
 * ```tsx
 * <ViewClaimModal claim={claim} open={open} onOpenChange={setOpen} />
 * ```
 */
export function ViewClaimModal({
  claim,
  open,
  onOpenChange,
}: ViewClaimModalProps) {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ViewClaimModalContent
        claim={claim}
        open={open}
        onOpenChange={onOpenChange}
      />
    </Suspense>
  );
}
