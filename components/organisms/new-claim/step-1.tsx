"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { useQuery } from "@apollo/client";
import { GET_CATALOGS } from "@/lib/graphql/queries";
import React, { useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Landmark, UserRoundSearch } from "lucide-react";
import { IdCard } from "lucide-react";
import { Mars, Venus, Cake } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface CatalogOption {
  id: string;
  group: number;
  label: string;
  __typename: string;
}

interface Step1Props {
  formData: {
    employeeNumber: string;
    claimType: string;
    amount: string;
  };
  onUpdateFormData: (fieldName: keyof FormData, value: string) => void;
}

export function Step1({ formData, onUpdateFormData }: Step1Props) {
  const { data: catalogsData } = useQuery(GET_CATALOGS);

  const [showBankForm, setShowBankForm] = useState(false);
  const [showClaimForm, setShowClaimForm] = useState(true);

  const claimTypeOptions = React.useMemo(() => {
    const options: { id: string; value: string; label: string }[] = [];

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

  const bankOptions = [
    {
      id: "1",
      value: "1",
      label: "BSP",
    },
    {
      id: "2",
      value: "2",
      label: "KINA BANK",
    },
    {
      id: "3",
      value: "3",
      label: "WESTPAC",
    },
    {
      id: "4",
      value: "4",
      label: "ANZ",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Policy Holder Card */}
      <div className="flex gap-2 w-full">
        <Card className="relative bg-muted w-1/2 flex flex-col animate-slide-left-fade-in">
          <UserRoundSearch className="absolute right-4 top-4 h-32 w-32 rotate-12 opacity-5" />
          <CardHeader>
            <CardTitle className="text-lg font-semibold w-fit">
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="grid gap-2">
                    <div className="flex items-center gap-1 text-muted-foreground font-semibold text-sm">
                      <IdCard className="h-5 w-5" />
                      <span className="">12321313</span>
                    </div>
                  </div>
                </TooltipTrigger>
                <TooltipContent side="right">Employee ID</TooltipContent>
              </Tooltip>
            </CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-4 flex-1">
            <div className="grid gap-2">
              <div className="font-bold text-3xl">Name</div>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1 text-muted-foreground font-semibold text-sm">
                {"M" === "M" ? (
                  <>
                    <Mars className="h-4 w-4" />
                    <span className="font-medium text-sm uppercase">Male</span>
                  </>
                ) : (
                  <>
                    <Venus className="h-4 w-4" />
                    <span className="">Female</span>
                  </>
                )}
              </div>
              <div className="w-1 h-1 bg-muted-foreground rounded-full" />
              <div className="flex items-center gap-1 text-muted-foreground font-semibold text-sm">
                <Cake className="h-4 w-4 text-muted-foreground" />
                <span className="">{"N/A"}</span>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="relative bg-muted w-1/2 flex flex-col animate-slide-left-fade-in">
          <Landmark className="absolute right-4 top-4 h-32 w-32 rotate-12 opacity-5" />
          <CardHeader>
            <CardTitle>Bank</CardTitle>
          </CardHeader>
          <CardContent>
            <div></div>
          </CardContent>
        </Card>
      </div>

      {/* Employee Number */}
      <div className="grid w-full items-center gap-1.5">
        <Label htmlFor="employeeNumber">Employee Number</Label>
        <Input
          type="text"
          id="employeeNumber"
          placeholder="Enter employee number"
          value={""}
        />
      </div>

      {/* Bank */}
      {showBankForm && (
        <div className="grid w-full items-center gap-1.5">
          {/* Bank Name */}

          <div>
            <Label htmlFor="bankName">Bank Name</Label>
            <Select
              value={formData.bankName || ""}
              onValueChange={(value) => onUpdateFormData("bankName", value)}
            >
              <SelectTrigger id="bankName">
                <SelectValue placeholder="Select bank" />
              </SelectTrigger>

              <SelectContent>
                {bankOptions.map((option) => (
                  <SelectItem key={option.id} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Bank Branch Code */}

          <div className="grid w-full items-center gap-1.5">
            <Label htmlFor="bankBranchCode">Bank Branch Code</Label>
            <Input
              type="text"
              id="bankBranchCode"
              placeholder="Enter bank branch code"
              value={""}
            />
          </div>

          <div className="grid w-full items-center gap-1.5">
            <Label htmlFor="bankBranchCode">Bank Branch Name</Label>
            <Input
              type="text"
              id="bankBranchName"
              placeholder="Enter bank branch name"
              value={""}
            />
          </div>

          <div className="grid w-full items-center gap-1.5">
            <Label htmlFor="bankBranchCode">Account Number</Label>
            <Input
              type="text"
              id="accountNumber"
              placeholder="Enter account number"
              value={""}
            />
          </div>

          <div className="grid w-full items-center gap-1.5">
            <Label htmlFor="bankBranchCode">Account Name</Label>
            <Input
              type="text"
              id="accountName"
              placeholder="Enter account name"
              value={""}
            />
          </div>
        </div>
      )}

      {showClaimForm && (
        <Card className="w-full bg-muted rounded-md p-4">
          {/* Claim Type */}
          <div className="grid w-full items-center gap-1.5">
            <Label htmlFor="claimType">Claim Type</Label>
            <Select
              value={formData.claimType || ""}
              onValueChange={(value) => onUpdateFormData("claimType", value)}
            >
              <SelectTrigger id="claimType">
                <SelectValue placeholder="Select claim type" />
              </SelectTrigger>

              <SelectContent>
                {claimTypeOptions.map((option) => (
                  <SelectItem key={option.id} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Amount */}
          <div className="grid w-full items-center gap-1.5">
            <Label htmlFor="amount">Amount (PGK)</Label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                K
              </span>
              <Input
                type="number"
                id="amount"
                placeholder="0.00"
                className="pl-7"
                value={formData.amount}
                onChange={(e) => onUpdateFormData("amount", e.target.value)}
              />
            </div>
          </div>

          <div className="grid w-full items-center gap-1.5">
            <Label htmlFor="bankBranchCode">Description</Label>
            <Textarea
              id="description"
              placeholder="Enter description"
              value={""}
            />
          </div>

          {/* Attachment */}
          <div className="grid w-full items-center gap-1.5">
            <Label htmlFor="attachment">Attachment</Label>
            <Input
              type="file"
              id="attachment"
              placeholder="Upload attachment"
            />
          </div>
        </Card>
      )}
    </div>
  );
}
