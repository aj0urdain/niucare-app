import { AlertTriangle, Component, File } from "lucide-react";
import { InputWithLabel } from "../atoms/input-with-label";
import { Button } from "../ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { ComboBoxResponsive } from "./combobox-responsive";
import { useEffect, useMemo, useState, type JSX } from "react";
import { useLazyQuery, useQuery, useMutation } from "@apollo/client";
import {
  GET_CATALOGS,
  GET_VERIFY_CLAIM,
  ADD_POLICYHOLDERCLAIM,
  GET_POLICYHOLDERCLAIMS,
  ADD_BANK,
} from "@/lib/graphql/queries";
import { CatalogOption } from "./data-table-filters";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

import { useUserProfileStore } from "@/stores/user-profile-store";
import Image from "next/image";
import { FileUploader } from "@/components/atoms/file-uploader";
import { toast } from "sonner";
import { useEmployeeStore } from "@/stores/employee-store";
import { useClaimFormStore } from "@/stores/new-claim-form-store";
import { useEmployeeData } from "@/lib/hooks/useEmployeeData";
import { Badge } from "@/components/ui/badge";

interface NewClaimEmbeddedFormProps {
  formState: string | null;
  setFormState: (formState: string | null) => void;
  setOpen: (open: boolean) => void;
}

interface ClaimTypeVerifyResponse {
  previousClaimAmount: number;
  previousClaimDateTime: string;
  previousClaimDescription: string;
  previousClaimId: number;
  claimLabel: string;
}

interface ClaimAddVerifyResponse {
  claimId: number;
  claimDateTime: string;
  claimDescription: string;
  claimLabel: string;
  amount: number;
  description: string;
}

interface FormState {
  type:
    | "initial"
    | "psna_bank"
    | "claim_type"
    | "warning"
    | "verification"
    | "main_form"
    | "loading";
  header: () => JSX.Element;
  content: () => JSX.Element;
  navigation: () => JSX.Element;
}

export function NewClaimEmbeddedForm({
  formState,
  setFormState,
  setOpen,
}: NewClaimEmbeddedFormProps) {
  const [claimType, setClaimType] = useState<string | null>(null);
  const [hasWarning, setHasWarning] = useState(false);
  const [warningAccepted, setWarningAccepted] = useState(false);

  const { employeeNumber, setEmployeeNumber, employeeData, setEmployeeData } =
    useEmployeeStore();

  const { formData, setFormData } = useClaimFormStore();

  const [claimTypeVerifyResponse, setClaimTypeVerifyResponse] =
    useState<ClaimTypeVerifyResponse | null>();

  const [claimAddVerifyResponse, setClaimAddVerifyResponse] =
    useState<ClaimAddVerifyResponse | null>();

  // get user id from user profile manager context
  const { user } = useUserProfileStore();

  const { data: catalogsData } = useQuery(GET_CATALOGS);

  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);

  const [bank, setBank] = useState<string | null>(null);

  const [addBank, { loading: bankLoading }] = useMutation(ADD_BANK);
  const [bankFormData, setBankFormData] = useState({
    name: "",
    branch_Number: "",
    branch_Name: "",
    account_Number: "",
    account_Name: "",
  });

  const [bankError, setBankError] = useState<string | null>(null);
  const [bankDetailsAdded, setBankDetailsAdded] = useState(false);

  const { refetchEmployeeData } = useEmployeeData();

  useEffect(() => {
    console.log(claimAddVerifyResponse);
  }, [claimAddVerifyResponse]);

  useEffect(() => {
    console.log("User");
    console.log(user?.registration);
  }, [user]);

  const handleBankSubmit = async () => {
    try {
      setBankError(null);
      const bankData = {
        id: 0,
        policyHolderId: employeeData?.id || 0,
        name: bank || "",
        branch_Number: bankFormData.branch_Number,
        branch_Name: bankFormData.branch_Name,
        account_Number: bankFormData.account_Number,
        account_Name: bankFormData.account_Name,
      };

      const response = await addBank({
        variables: { bank: bankData },
      });

      if (response.data?.addBank) {
        // Use the hook to refetch data
        await refetchEmployeeData();
        setBankDetailsAdded(true);
        toast.success("Bank details added successfully");
      }
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to add bank details";
      setBankError(errorMessage);
      toast.error("Failed to add bank details");
      console.error("Error adding bank:", err);
    }
  };

  const [addClaimQuery] = useMutation(ADD_POLICYHOLDERCLAIM);

  const [verifyClaimQuery, { loading: isVerifyingClaimType }] = useLazyQuery(
    GET_VERIFY_CLAIM,
    {
      fetchPolicy: "network-only",
      errorPolicy: "all",
      onCompleted: (data) => {
        if (data.verifyclaim) {
          if (
            data.verifyclaim.previousClaimAmount !== null &&
            data.verifyclaim.previousClaimId !== 0 &&
            data.verifyclaim.previousClaimId !== null &&
            !warningAccepted
          ) {
            setClaimTypeVerifyResponse(data.verifyclaim);
            setHasWarning(true);
          } else {
            setClaimAddVerifyResponse(data.verifyclaim);
            // Only set to verification if we're in the final verification step
            if (formState === "SUBMITTING_CLAIM_ADD_VERIFY") {
              setFormState("verification");
            }
          }
        }
      },
      onError: (error) => {
        console.error("Verify Claim Query failed:", error);
        console.error("Error details:", error.graphQLErrors);
        console.error("Network error:", error.networkError);
      },
    }
  );

  const claimTypeOptions = useMemo(() => {
    if (!catalogsData?.catalogs) return [];

    return catalogsData.catalogs.map((catalog: CatalogOption) => ({
      id: catalog.id,
      value: catalog.id,
      label: catalog.label,
    }));
  }, [catalogsData]);

  function renderBankDetails() {
    return (
      <CardContent className="flex flex-col p-0">
        <div className="h-fit flex flex-col gap-6">
          <ComboBoxResponsive
            placeholder="Select Bank"
            label="Bank Name"
            options={[
              { label: "BSP", value: "BSP", id: "bsp" },
              { label: "KINA BANK", value: "KINA BANK", id: "kina-bank" },
              { label: "WESTPAC", value: "WESTPAC", id: "westpac" },
              { label: "ANZ", value: "ANZ", id: "anz" },
            ]}
            value={bank || ""}
            onValueChange={(value) => {
              setBank(value);
              setBankFormData((prev) => ({
                ...prev,
                name: value || "",
              }));
            }}
            className="w-full"
            triggerClassName="w-full"
          />
          <div className="flex gap-3 w-full">
            <div className="max-w-fit">
              <InputWithLabel
                label="Bank Branch Code"
                value={bankFormData.branch_Number}
                onChange={(e) =>
                  setBankFormData((prev) => ({
                    ...prev,
                    branch_Number: e.target.value,
                  }))
                }
                required
              />
            </div>
            <div className="w-full">
              <InputWithLabel
                label="Bank Branch Name"
                value={bankFormData.branch_Name}
                onChange={(e) =>
                  setBankFormData((prev) => ({
                    ...prev,
                    branch_Name: e.target.value,
                  }))
                }
                required
              />
            </div>
          </div>

          <InputWithLabel
            label="Account Number"
            value={bankFormData.account_Number}
            onChange={(e) =>
              setBankFormData((prev) => ({
                ...prev,
                account_Number: e.target.value,
              }))
            }
            required
          />
          <InputWithLabel
            label="Account Name"
            value={bankFormData.account_Name}
            onChange={(e) =>
              setBankFormData((prev) => ({
                ...prev,
                account_Name: e.target.value,
              }))
            }
            required
          />

          {bankError && (
            <div className="p-3 text-sm text-red-500 bg-red-50 rounded-md border border-red-200">
              {bankError}
            </div>
          )}
        </div>
      </CardContent>
    );
  }

  function renderClaimType() {
    return (
      <>
        <ComboBoxResponsive
          placeholder="Select Claim Type"
          label="Claim Type"
          options={claimTypeOptions}
          value={claimType || ""}
          onValueChange={(value) => {
            setClaimType(value);
            setClaimTypeVerifyResponse(null);
            setClaimAddVerifyResponse(null);
            verifyClaimQuery({
              variables: {
                input: {
                  userId: user?.userId,
                  employeeNo: employeeNumber,
                  claimCode: value,
                },
              },
            });
          }}
          className="w-full animate-slide-down-fade-in"
          triggerClassName={`w-full ${
            !claimType
              ? "ring-2 ring-blue-700 focus-visible:ring-2 focus-visible:ring-blue-700"
              : ""
          }`}
        />
      </>
    );
  }

  function renderWarningStep() {
    return (
      <div className="min-h-fit h-full w-full flex flex-col gap-6 mt-6 animate-slide-down-fade-in">
        <Card className="bg-warning-foreground/75 border-warning border-2 flex flex-col">
          <CardTitle className="p-6 flex flex-col gap-2">
            <CardHeader className="flex flex-row items-center gap-2 h-fit p-0">
              <AlertTriangle className="w-6 h-6" />
              Existing Claim!
            </CardHeader>
            <CardDescription className="text-sm font-normal">
              This member has tried to claim the same benefit in the past 90
              days. Please check the previous claim submission and ensure you
              are not attempting to submit a duplicate.
            </CardDescription>
          </CardTitle>
          <Separator className="w-1/2 mx-auto mb-6" />
          <CardContent className="text-xs">
            <div className="flex flex-col gap-2">
              <div className="flex flex-row gap-2 justify-between w-full px-4">
                <p>
                  <span className="font-bold">Claim ID</span>{" "}
                  {claimTypeVerifyResponse?.previousClaimId}
                </p>

                {/* Date */}
                <p>
                  {/* Show date in readable format */}
                  <span className="font-bold">Record Date</span>{" "}
                  {new Date(
                    claimTypeVerifyResponse?.previousClaimDateTime || ""
                  ).toLocaleDateString()}
                </p>
              </div>

              <Card className="w-full h-fit min-h-fit">
                <CardContent className="flex flex-row gap-2 items-center justify-center p-4">
                  <div className="w-1/2">
                    <div className="flex flex-row gap-1 items-center">
                      {/* Claim Type */}
                      <Component className="w-3 h-3" />
                      <p className="font-medium">
                        {claimTypeVerifyResponse?.claimLabel}
                      </p>
                    </div>
                    <div className="w-1/2">
                      {/* Previous Amount */}
                      <p className="font-bold text-xl">
                        PGK {claimTypeVerifyResponse?.previousClaimAmount}
                      </p>
                    </div>
                  </div>
                  <Separator orientation="vertical" className="my-2" />
                  <div className="w-1/2">
                    {/* Previous Amount */}
                    <p className="">
                      {claimTypeVerifyResponse?.previousClaimDescription}
                    </p>
                    {/* Render 3 buttons with files from lucide as the icon */}
                    <div className="flex flex-row gap-1">
                      <Button variant="link">
                        <File className="w-4 h-4" />
                      </Button>
                      <Button variant="link">
                        <File className="w-4 h-4" />
                      </Button>
                      <Button variant="link">
                        <File className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  function renderMainForm() {
    return (
      <div className="animate-slide-down-fade-in">
        <div className="h-fit w-full flex flex-col gap-6 mt-6">
          <InputWithLabel
            label="Amount"
            value={formData.amount}
            onChange={(e) => {
              setFormData({ ...formData, amount: Number(e.target.value) });
            }}
          />

          <div className="flex flex-col gap-2">
            <Label className="text-xs font-semibold text-muted-foreground/75">
              Description
            </Label>
            <Textarea
              placeholder="Claim Description"
              value={formData.description}
              onChange={(e) => {
                setFormData({ ...formData, description: e.target.value });
              }}
            />
          </div>

          <div className="flex flex-col gap-2 w-full">
            <Label className="text-xs font-semibold text-muted-foreground/75">
              Upload Files
            </Label>
            <div className="gap-2 w-full max-w-fit grid grid-cols-5">
              {uploadedFiles.map((file, index) => (
                <Button
                  key={index}
                  variant="outline"
                  className="w-full text-ellipsis"
                >
                  <Image
                    src="/images/pdf_icon.png"
                    alt={file.name}
                    width={12}
                    height={12}
                  />
                  <p className="truncate text-xs">{file.name}</p>
                </Button>
              ))}
              <FileUploader
                onFileSelect={(file) => {
                  setUploadedFiles((prev) => [...prev, file]);
                  setFormData((prev) => ({
                    ...prev,
                    supporting_documents: [
                      ...(prev.supporting_documents || []),
                      file,
                    ],
                  }));
                }}
                accept=".pdf,.doc,.docx,.png,.jpg,.jpeg"
              />
            </div>
          </div>
        </div>
      </div>
    );
  }

  function renderFinalVerificationStep() {
    return (
      <div className="h-fit w-full flex flex-col gap-6 mt-6">
        <Card>
          <CardHeader>
            <CardTitle>Verify Claim Details</CardTitle>
            <CardDescription>
              Please verify the following claim details before submitting
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-xs font-semibold text-muted-foreground/75">
                  Claim Type
                </Label>
                <p className="text-sm font-medium">
                  {claimAddVerifyResponse?.claimLabel}
                </p>
              </div>
              <div>
                <Label className="text-xs font-semibold text-muted-foreground/75">
                  Amount
                </Label>
                <p className="text-sm font-medium">PGK {formData.amount}</p>
              </div>
              <div className="col-span-2">
                <Label className="text-xs font-semibold text-muted-foreground/75">
                  Description
                </Label>
                <p className="text-sm font-medium">{formData.description}</p>
              </div>
              {uploadedFiles.length > 0 && (
                <div className="col-span-2">
                  <Label>Supporting Documents</Label>
                  <div className="flex gap-2 mt-2">
                    {uploadedFiles.map((file, index) => (
                      <div
                        key={index}
                        className="text-sm text-muted-foreground"
                      >
                        {file.name}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const handleCancel = () => {
    // Reset all form state
    setClaimType(null);
    setHasWarning(false);
    setWarningAccepted(false);
    setClaimTypeVerifyResponse(null);
    setClaimAddVerifyResponse(null);
    setUploadedFiles([]);
    setFormState(null);
    setFormData({
      amount: 0,
      description: "",
      files: [],
      employeeNumber: "",
      claimType: "",
    });
    setEmployeeData(null);
    setEmployeeNumber("");
    setOpen(false);
  };

  const getFormState = (): FormState | null => {
    // Early return if no employee data
    if (!employeeData) {
      return null;
    }

    // Handle PSNA provider flow
    if (user?.registration?.isPsnaProvider) {
      if (!employeeData.hasBankDetails) {
        return {
          type: "psna_bank",
          header: () => <h1>Enter Bank Details</h1>,
          content: () => renderBankDetails(),
          navigation: () => (
            <>
              <Button variant="ghost" onClick={handleCancel}>
                Cancel
              </Button>
              <Button
                onClick={handleBankSubmit}
                disabled={bankLoading}
                className="bg-blue-700 hover:bg-blue-800 text-primary-foreground font-semibold"
              >
                Add Bank Details
              </Button>
            </>
          ),
        };
      }
    }

    // Handle claim type selection
    if (claimType === null || claimType === "all") {
      return {
        type: "claim_type",
        header: () => <h1>Select Claim Type</h1>,
        content: () => (
          <ComboBoxResponsive
            placeholder="Select Claim Type"
            label="Claim Type"
            options={claimTypeOptions}
            value={claimType || ""}
            onValueChange={(value) => {
              setClaimType(value);
              setClaimTypeVerifyResponse(null);
              setClaimAddVerifyResponse(null);
              verifyClaimQuery({
                variables: {
                  input: {
                    userId: user?.userId,
                    employeeNo: employeeNumber,
                    claimCode: value,
                  },
                },
              });
            }}
            className="w-full"
            triggerClassName={`w-full ${
              !claimType
                ? "ring-2 ring-blue-700 focus-visible:ring-2 focus-visible:ring-blue-700"
                : ""
            }`}
          />
        ),
        navigation: () => (
          <Button variant="ghost" onClick={handleCancel}>
            Cancel
          </Button>
        ),
      };
    }

    // Handle loading state
    if (isVerifyingClaimType) {
      return {
        type: "loading",
        header: () => <h1>Verifying Claim Type</h1>,
        content: () => (
          <div className="flex flex-col items-center justify-center h-48">
            {/* <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-700"></div> */}
            <p className="mt-4 text-muted-foreground">
              Please wait while we verify your claim type...
            </p>
          </div>
        ),
        navigation: () => (
          <Button variant="ghost" onClick={handleCancel} disabled>
            Cancel
          </Button>
        ),
      };
    }

    // Handle warning state
    if (hasWarning && !warningAccepted) {
      return {
        type: "warning",
        header: () => <h1 className="text-warning">Warning!</h1>,
        content: () => renderWarningStep(),
        navigation: () => (
          <>
            <Button variant="ghost" onClick={handleCancel}>
              Cancel
            </Button>
            <Button
              variant="default"
              className="bg-warning hover:bg-warning-foreground hover:text-primary-background text-primary-background font-semibold border border-warning-foreground hover:border-warning"
              onClick={() => setWarningAccepted(true)}
            >
              Proceed?
            </Button>
          </>
        ),
      };
    }

    // Handle verification state
    if (formState === "verification") {
      return {
        type: "verification",
        header: () => <h1>Final Verification</h1>,
        content: () => renderFinalVerificationStep(),
        navigation: () => (
          <>
            <Button variant="ghost" onClick={handleCancel}>
              Cancel
            </Button>
            <Button variant="outline" onClick={() => setFormState(null)}>
              Back
            </Button>
            <Button variant="default" onClick={handleAddClaim}>
              Add Claim
            </Button>
          </>
        ),
      };
    }

    // Handle final verification loading state
    if (formState === "SUBMITTING_CLAIM_ADD_VERIFY") {
      return {
        type: "loading",
        header: () => <h1>Final Verification</h1>,
        content: () => (
          <div className="flex flex-col items-center justify-center h-48">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-700"></div>
            <p className="mt-4 text-muted-foreground">
              Please wait while we verify your claim details...
            </p>
          </div>
        ),
        navigation: () => (
          <Button variant="ghost" onClick={handleCancel} disabled>
            Cancel
          </Button>
        ),
      };
    }

    // Default to main form
    return {
      type: "main_form",
      header: () => <h1>New Claim</h1>,
      content: () => (
        <>
          {renderClaimType()}
          {renderMainForm()}
        </>
      ),
      navigation: () => (
        <>
          <Button variant="ghost" onClick={handleCancel}>
            Cancel
          </Button>
          <Button variant="default" onClick={handleNext}>
            Next
          </Button>
        </>
      ),
    };
  };

  const handleAddClaim = () => {
    addClaimQuery({
      variables: {
        input: {
          userId: user?.userId,
          employeeNo: employeeNumber,
          claimCode: claimType,
          amount: formData.amount,
          description: formData.description,
          status: "Pending",
          documents: uploadedFiles.map((file) => file.name).join(";"),
        },
      },
      refetchQueries: [
        {
          query: GET_POLICYHOLDERCLAIMS,
          variables: {
            userId: user?.userId,
            providerRegNumber: "",
            claimId: "",
            employeeNo: "",
            claimCode: "",
            status: "",
          },
        },
      ],
    })
      .then((response) => {
        if (response.data) {
          // Reset all form state
          setClaimType(null);
          setHasWarning(false);
          setWarningAccepted(false);
          setClaimTypeVerifyResponse(null);
          setClaimAddVerifyResponse(null);
          setUploadedFiles([]);
          setFormState(null);
          setFormData({
            amount: 0,
            description: "",
            files: [],
            employeeNumber: "",
            claimType: "",
          });
          setEmployeeData(null);
          setEmployeeNumber("");

          // Close the modal and show success message
          setOpen(false);
          toast.success("Claim Added Successfully", {
            description: "Your claim has been submitted.",
          });
        }
      })
      .catch((error) => {
        toast.error("Failed to Add Claim", {
          description: error.message,
        });
      });
  };

  const handleNext = () => {
    setFormState("SUBMITTING_CLAIM_ADD_VERIFY");
    verifyClaimQuery({
      variables: {
        input: {
          userId: user?.userId,
          employeeNo: employeeNumber,
          claimCode: claimType,
          amount: formData.amount,
          description: formData.description,
        },
      },
    });
  };

  const currentState = getFormState();

  if (!currentState) {
    return null;
  }

  return (
    <Card className="w-full h-full border-dotted animate-slide-down-fade-in">
      <CardHeader className="border-b border-muted">
        <CardTitle className="flex items-center justify-between gap-1">
          {currentState.header()}
          <div className="flex gap-2">
            {bankDetailsAdded && (
              <Badge className="bg-blue-700 text-white hover:bg-blue-800">
                Bank Details Added
              </Badge>
            )}
            {warningAccepted && (
              <Badge
                variant="destructive"
                className="bg-warning text-warning-foreground cursor-pointer hover:bg-warning/90"
                onClick={() => setWarningAccepted(false)}
              >
                Warning Accepted
              </Badge>
            )}
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="mt-6">{currentState.content()}</CardContent>
      <CardFooter className="justify-end items-end gap-2">
        {currentState.navigation()}
      </CardFooter>
    </Card>
  );
}
