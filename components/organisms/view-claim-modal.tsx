import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
  ClipboardCopy,
  Info,
  ClipboardList,
  ChevronDown,
} from "lucide-react";
import { Claim } from "@/components/atoms/columns-data";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
} from "@/components/ui/tooltip";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import { useSearchParams, useRouter } from "next/navigation";
import { useEffect, useState, Suspense } from "react";
import { useQuery } from "@apollo/client";
import { GET_POLICY_HOLDER_BY_EMPLOYEE_NO } from "@/lib/graphql/queries";

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
    if (open && claim) {
      const params = new URLSearchParams();
      params.set("id", claim.id);
      if (activeTab !== "overview") {
        params.set("sheetTab", activeTab);
      }
      router.push(`?${params.toString()}`);
    } else {
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

  // Update URL when tab changes
  const handleTabChange = (tab: "overview" | "details" | "files") => {
    setActiveTab(tab);
  };

  // Update URL when modal state changes
  const handleOpenChange = (open: boolean) => {
    onOpenChange(open);
  };

  if (!claim) return null;

  // For demo purposes - you can replace this with actual files data
  const files = ["medical_report.pdf", "prescription.pdf", "receipt.pdf"];

  function formatEmployeeDetails(claim: Claim) {
    return `Employee Number: ${claim.employeeNumber}
Employee Name: ${policyHolder?.name || "N/A"}
Gender: ${policyHolder?.gender === "M" ? "Male" : "Female"}
Date of Birth: ${policyHolder?.dateOfBirth || "N/A"}`;
  }

  function formatClaimDetails(claim: Claim) {
    return `Claim ID: ${claim.claimId}
Claim Type: ${claim.claimType}
Amount: ${new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "PGK",
    }).format(claim.amount)}
Description: ${claim.description}`;
  }

  return (
    <Sheet open={open} onOpenChange={handleOpenChange}>
      <SheetContent
        side="bottom"
        className="max-w-xl mx-auto h-full min-h-[90vh] max-h-[90vh] rounded-t-[1rem]"
      >
        <SheetHeader>
          <SheetTitle className="flex items-center gap-4 pb-4">
            <div
              className={cn(
                "px-3 py-1.5 text-xs font-semibold rounded-md",
                claim.status === "approved" &&
                  "bg-green-900/25 text-green-800 dark:text-green-400 border border-green-700/50",
                claim.status === "rejected" &&
                  "bg-red-900/25 text-red-800 dark:text-red-400 border border-red-700/50",
                claim.status === "pending" &&
                  "bg-yellow-900/25 text-yellow-800 dark:text-yellow-400 border border-yellow-700/50"
              )}
            >
              {claim.status.charAt(0).toUpperCase() + claim.status.slice(1)}
            </div>
            <div className="w-1 h-1 bg-muted-foreground rounded-full" />
            Claim ID: {claim.claimId}
          </SheetTitle>
        </SheetHeader>

        <Tabs
          value={activeTab}
          onValueChange={(value) =>
            handleTabChange(value as "overview" | "details" | "files")
          }
        >
          <TabsList className="grid grid-cols-3 w-fit">
            <TabsTrigger value="overview" className="flex items-center gap-1">
              <Info className="h-3.5 w-3.5" />
              <span className="text-xs">Overview</span>
            </TabsTrigger>
            <TabsTrigger value="details" className="flex items-center gap-1">
              <ClipboardList className="h-3.5 w-3.5" />
              <span className="text-xs">Details</span>
            </TabsTrigger>
            <TabsTrigger value="files" className="flex items-center gap-1">
              <FileDown className="h-3.5 w-3.5" />
              <span className="text-xs">Files</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="mt-4">
            <div className="flex flex-col gap-4 h-full items-center justify-center">
              {/* Employee Information Card */}
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
                      <TooltipContent side="right">Employee ID</TooltipContent>
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

              {/* Arrow Column */}
              <div className="animate-slide-up-fade-in">
                <div className="flex justify-center gap-2 w-fit animate-pulse">
                  <ChevronDown className="h-6 w-6 text-muted-foreground opacity-20" />
                  <ChevronDown className="h-6 w-6 text-muted-foreground opacity-40" />
                  <ChevronDown className="h-6 w-6 text-muted-foreground opacity-60" />
                  <ChevronDown className="h-6 w-6 text-muted-foreground opacity-80" />
                  <ChevronDown className="h-6 w-6 text-muted-foreground" />
                </div>
              </div>

              {/* Claim Details Card */}
              <Card
                className={cn(
                  "relative w-full flex flex-col border-2 border-muted-foreground animate-slide-right-fade-in",
                  claim.status === "approved" &&
                    "bg-green-500/30 border-green-500",
                  claim.status === "rejected" && "bg-red-500/30 border-red-500",
                  claim.status === "pending" &&
                    "bg-yellow-500/30 border-yellow-500"
                )}
              >
                {/* Status Icon Background */}
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
                        <TooltipContent side="bottom">{file}</TooltipContent>
                      </Tooltip>
                    ))}
                  </div>
                  {/* make the separator the same colour as the border for the respective card */}
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
          </TabsContent>

          <TabsContent value="details" className="mt-4">
            <div className="flex flex-col gap-4">
              {/* Employee Details - Left Column */}
              <Card className="bg-muted animate-slide-left-fade-in">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
                  <CardTitle className="font-semibold text-muted-foreground">
                    Employee Information
                  </CardTitle>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => {
                          navigator.clipboard.writeText(
                            formatEmployeeDetails(claim)
                          );
                          toast.success(
                            "Employee information copied to clipboard"
                          );
                        }}
                      >
                        <ClipboardCopy className="h-4 w-4" />
                        <span className="sr-only">Copy employee details</span>
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent side="left">Copy details</TooltipContent>
                  </Tooltip>
                </CardHeader>
                <CardContent className="grid gap-4">
                  <div className="flex flex-col gap-0">
                    <Label
                      htmlFor="employeeName"
                      className="text-muted-foreground text-xs pl-1.5"
                    >
                      Employee Name
                    </Label>
                    <Input
                      id="employeeName"
                      value={policyHolder?.name || "N/A"}
                      disabled
                      className="mt-1.5 text-black opacity-100 disabled:opacity-100 disabled:cursor-default disabled:bg-white"
                    />
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                    <div className="flex flex-col gap-0">
                      <Label
                        htmlFor="employeeNumber"
                        className="text-muted-foreground text-xs pl-1.5"
                      >
                        Employee Number
                      </Label>
                      <Input
                        id="employeeNumber"
                        value={claim.employeeNumber}
                        disabled
                        className="mt-1.5 text-black opacity-100 disabled:opacity-100 disabled:cursor-default disabled:bg-white"
                      />
                    </div>
                    <div className="flex flex-col gap-0">
                      <Label
                        htmlFor="employeeGender"
                        className="text-muted-foreground text-xs pl-1.5"
                      >
                        Gender
                      </Label>
                      <Input
                        id="employeeGender"
                        value={policyHolder?.gender === "M" ? "Male" : "Female"}
                        disabled
                        className="mt-1.5 text-black opacity-100 disabled:opacity-100 disabled:cursor-default disabled:bg-white"
                      />
                    </div>
                    <div className="flex flex-col gap-0">
                      <Label
                        htmlFor="employeeDob"
                        className="text-muted-foreground text-xs pl-1.5"
                      >
                        Date of Birth
                      </Label>
                      <Input
                        id="employeeDob"
                        value={
                          policyHolder?.dateOfBirth
                            ? new Date(
                                policyHolder.dateOfBirth
                              ).toLocaleDateString()
                            : "N/A"
                        }
                        disabled
                        className="mt-1.5 text-black opacity-100 disabled:opacity-100 disabled:cursor-default disabled:bg-white"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Claim Details - Right Column */}
              <Card className="bg-muted animate-slide-right-fade-in">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
                  <CardTitle className="font-semibold text-muted-foreground">
                    Claim Information
                  </CardTitle>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => {
                          navigator.clipboard.writeText(
                            formatClaimDetails(claim)
                          );
                          toast.success(
                            "Claim information copied to clipboard"
                          );
                        }}
                      >
                        <ClipboardCopy className="h-4 w-4" />
                        <span className="sr-only">Copy claim details</span>
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent side="left">Copy details</TooltipContent>
                  </Tooltip>
                </CardHeader>
                <CardContent className="grid gap-4">
                  <div className="grid grid-cols-3 gap-4">
                    <div className="flex flex-col gap-0">
                      <Label
                        htmlFor="claimId"
                        className="text-muted-foreground text-xs pl-1.5"
                      >
                        Claim ID
                      </Label>
                      <Input
                        id="claimId"
                        value={claim.claimId}
                        disabled
                        className="mt-1.5 text-black opacity-100 disabled:opacity-100 disabled:cursor-default disabled:bg-white"
                      />
                    </div>
                    <div className="flex flex-col gap-0">
                      <Label
                        htmlFor="claimStatus"
                        className="text-muted-foreground text-xs pl-1.5"
                      >
                        Status
                      </Label>
                      <Input
                        id="claimStatus"
                        value={
                          claim.status.charAt(0).toUpperCase() +
                          claim.status.slice(1)
                        }
                        disabled
                        className="mt-1.5 text-black opacity-100 disabled:opacity-100 disabled:cursor-default disabled:bg-white"
                      />
                    </div>
                    <div className="flex flex-col gap-0">
                      <Label
                        htmlFor="claimAmount"
                        className="text-muted-foreground text-xs pl-1.5"
                      >
                        Amount
                      </Label>
                      <Input
                        id="claimAmount"
                        value={new Intl.NumberFormat("en-US", {
                          style: "currency",
                          currency: "PGK",
                        }).format(claim.amount)}
                        disabled
                        className="mt-1.5 text-black opacity-100 disabled:opacity-100 disabled:cursor-default disabled:bg-white"
                      />
                    </div>
                  </div>
                  <div className="flex flex-col gap-0">
                    <Label
                      htmlFor="claimType"
                      className="text-muted-foreground text-xs pl-1.5"
                    >
                      Claim Type
                    </Label>
                    <Input
                      id="claimType"
                      value={claim.claimType}
                      disabled
                      className="mt-1.5 text-black opacity-100 disabled:opacity-100 disabled:cursor-default disabled:bg-white"
                    />
                  </div>

                  <div className="flex flex-col gap-0">
                    <Label
                      htmlFor="description"
                      className="text-muted-foreground text-xs pl-1.5"
                    >
                      Description
                    </Label>
                    <Textarea
                      id="description"
                      value={claim.description}
                      disabled
                      className="mt-1.5 h-24 resize-none text-black opacity-100 disabled:opacity-100 disabled:cursor-default disabled:bg-white"
                    />
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="files" className="mt-4">
            <div className="grid gap-4">
              {files.length > 0 ? (
                files.map((file, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between gap-4 rounded-lg border p-4 animate-slide-down-fade-in"
                  >
                    <div className="flex items-center gap-2">
                      <FileDown className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">File {index + 1}</span>
                    </div>
                    <Button size="sm" variant="outline">
                      Download
                    </Button>
                  </div>
                ))
              ) : (
                <div className="text-center text-sm text-muted-foreground">
                  No files available for this claim.
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </SheetContent>
    </Sheet>
  );
};

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
