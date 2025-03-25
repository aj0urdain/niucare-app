import { AlertTriangle, CircleHelp, Component, File } from "lucide-react";
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
import { useEffect, useMemo, useState } from "react";
import { useQuery } from "@apollo/client";
import { GET_CATALOGS } from "@/lib/graphql/queries";
import { CatalogOption } from "./data-table-filters";
import { TooltipContent } from "@/components/ui/tooltip";
import { Separator } from "@/components/ui/separator";
import { Tooltip } from "@/components/ui/tooltip";
import { TooltipTrigger } from "@/components/ui/tooltip";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { PolicyHolder } from "@/lib/hooks/usePolicyHolder";
import { FormData } from "@/components/organisms/new-claim-modal";

interface NewClaimEmbeddedFormProps {
  formData: FormData;
  setFormData: (formData: FormData) => void;
  employeeData: PolicyHolder | null;
  employeeNumber: string;
  hasBankDetails: boolean;
}

export function NewClaimEmbeddedForm({
  formData,
  setFormData,
  employeeData,
  employeeNumber,
  hasBankDetails,
}: NewClaimEmbeddedFormProps) {
  const [bank, setBank] = useState("");
  const [claimType, setClaimType] = useState<string | null>(null);
  const [hasWarning, setHasWarning] = useState(false);

  const { data: catalogsData } = useQuery(GET_CATALOGS);

  // verify claim: step 1: choosing claim type
  // verify claim 2: actual form verification

  useEffect(() => {
    console.log(`claimType: ${claimType}`);
  }, [claimType]);

  const claimTypeOptions = useMemo(() => {
    const options = [{ id: "all", value: "all", label: "All" }];

    if (catalogsData?.catalogs) {
      catalogsData.catalogs.forEach((catalog: CatalogOption) => {
        options.push({
          id: catalog.id,
          value: catalog.id,
          label: catalog.label,
        });
      });
    }

    return options;
  }, [catalogsData]);

  function renderBankDetails() {
    return (
      <>
        <CardContent className="flex flex-col w-full h-full items-start">
          <div className="h-fit w-full flex flex-col gap-6">
            <ComboBoxResponsive
              placeholder="Select Claim Type"
              label="Claim Type"
              options={[
                { label: "BSP", value: "bsp", id: "bsp" },
                { label: "KINA BANK", value: "kina-bank", id: "kina-bank" },
                { label: "WESTPAC", value: "westpac", id: "westpac" },
                { label: "ANZ", value: "anz", id: "anz" },
              ]}
              value={bank}
              onValueChange={(value) => {
                setBank(value);
              }}
              className="w-full"
              triggerClassName="w-full"
            />

            <div className="flex gap-3 w-full">
              <div className="w-1/3">
                <InputWithLabel label="Bank Branch Code" />
              </div>
              <div className="w-2/3">
                <InputWithLabel label="Bank Branch Name" />
              </div>
            </div>

            <InputWithLabel label="Account Number" />
            <InputWithLabel label="Account Name" />
          </div>
        </CardContent>
      </>
    );
  }

  function renderClaimType() {
    return (
      <>
        <ComboBoxResponsive
          placeholder="Select Claim Type"
          label="Claim Type"
          options={claimTypeOptions}
          value={claimType}
          onValueChange={(value) => {
            setClaimType(value);
          }}
          className="w-full"
          triggerClassName="w-full"
        />
      </>
    );
  }

  function renderWarningStep() {
    return (
      <div className="h-fit w-full flex flex-col gap-6 mt-6 animate-slide-down-fade-in">
        <Card className="bg-warning-foreground/75 border-warning border-2 flex flex-col">
          <CardTitle className="p-6 flex flex-col gap-2">
            <CardHeader className="flex flex-row items-center gap-2 h-fit p-0">
              <AlertTriangle className="w-6 h-6" />
              Existing Claim!
            </CardHeader>
            <CardDescription className="text-xs font-normal">
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
                  <span className="font-bold">Claim ID</span> 123
                </p>

                {/* Date */}
                <p>
                  {/* Show date in readable format */}
                  <span className="font-bold">Record Date</span>{" "}
                  {new Date().toLocaleDateString()}
                </p>
              </div>

              <Card className="w-full h-fit min-h-fit">
                <CardContent className="flex flex-row gap-2 items-center justify-center p-4">
                  <div className="w-1/2">
                    <div className="flex flex-row gap-1 items-center">
                      {/* Claim Type */}
                      <Component className="w-3 h-3" />
                      <p className="font-medium">Dental Services</p>
                    </div>
                    <div className="w-1/2">
                      {/* Previous Amount */}
                      <p className="font-bold text-xl">PGK 123</p>
                    </div>
                  </div>
                  <Separator orientation="vertical" className="my-2" />
                  <div className="w-1/2">
                    {/* Previous Amount */}
                    <p className="">Regular checkup and oral hygiene</p>
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
      <>
        <div className="h-fit w-full flex flex-col gap-6 mt-6">
          <InputWithLabel label="Amount" />

          <div className="flex flex-col gap-2">
            <Label className="text-xs font-semibold text-muted-foreground/75">
              Description
            </Label>
            <Textarea placeholder="Claim Description" />
          </div>

          <div className="flex flex-row gap-2">
            {/* File uploading area */}
            <div className="flex flex-row gap-2">
              <Button variant="outline">
                <File className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </>
    );
  }

  function renderFormHeader() {
    if (!employeeData && !hasBankDetails) {
      return "Waiting for Employee Data";
    }

    if (employeeData && hasBankDetails) {
      return "Select Claim Type";
    }

    if (employeeData && !hasBankDetails) {
      return "Enter Bank Details";
    }

    if (claimType !== "all" && claimType !== null) {
      return "New Claim";
    }

    if (claimType === "all" || claimType === null) {
      return "Select Claim Type";
    }
  }

  function renderFormContent() {
    if (!employeeData) {
      return "Waiting for Employee Data";
    }

    if (
      employeeData &&
      hasBankDetails &&
      (claimType === null || claimType === "all")
    ) {
      return renderClaimType();
    }

    if (
      employeeData &&
      hasBankDetails &&
      (claimType !== null || claimType !== "all")
    ) {
      return (
        <>
          {renderClaimType()}
          {hasWarning ? renderWarningStep() : renderMainForm()}
        </>
      );
    }
  }

  const renderNavigationButtons = () => {
    if (employeeData && !hasBankDetails) {
      return (
        <>
          <Button variant="ghost">Cancel</Button>
          <Button className="bg-blue-700 hover:bg-blue-800 text-primary-foreground font-semibold">
            Add Bank Details
          </Button>
        </>
      );
    }

    if (employeeData && hasBankDetails) {
      return (
        <>
          <Button variant="ghost">Cancel</Button>
        </>
      );
    }
  };

  return (
    <Card className="w-full h-full border-dotted">
      <CardHeader className="">
        <CardTitle className="flex items-center gap-1">
          {renderFormHeader()}
        </CardTitle>
      </CardHeader>
      <CardContent className="">{renderFormContent()}</CardContent>
      <CardFooter className="justify-end items-end">
        {renderNavigationButtons()}
      </CardFooter>
    </Card>
  );
}
