"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { InputWithLabel } from "@/components/atoms/input-with-label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { FilePlus, AlertTriangle } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { toast } from "sonner";

interface FormData {
  employeeNumber: string;
  claimType: string;
  amount: string;
  description: string;
  bankName: string;
  accountNumber: string;
  accountName: string;
  files: File[];
}

export function NewClaimModal() {
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<FormData>({
    employeeNumber: "",
    claimType: "",
    amount: "",
    description: "",
    bankName: "",
    accountNumber: "",
    accountName: "",
    files: [],
  });

  const handleNext = () => {
    setStep((prev) => prev + 1);
  };

  const handleBack = () => {
    setStep((prev) => prev - 1);
  };

  const handleSubmit = () => {
    // Handle form submission
    toast.success("Claim submitted successfully", {
      description: `Claim for ${formData.claimType} - K${formData.amount}`,
    });
    setOpen(false);
    setStep(1);
  };

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const WarningStep = () => (
    <div className="grid gap-6 py-4">
      <div className="rounded-md border-l-4 border-yellow-500 bg-yellow-500/15 p-4">
        <div className="flex items-center gap-2">
          <AlertTriangle className="h-4 w-4 text-yellow-500" />
          <h4 className="text-sm font-semibold text-yellow-500">Warning</h4>
        </div>
        <p className="mt-2 text-sm">
          This Member has tried to claim the same benefit in the past 90 days.
          Please check that this claim is not a duplicate and is a valid claim.
        </p>

        <Table className="mt-4">
          <TableHeader>
            <TableRow>
              <TableHead className="w-[150px]">Field</TableHead>
              <TableHead>Previous Claim</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableCell className="font-medium">Claim ID</TableCell>
              <TableCell>80</TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="font-medium">Amount</TableCell>
              <TableCell>K150</TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="font-medium">Record Date</TableCell>
              <TableCell>2025-01-24T03:25:45</TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="font-medium">Description</TableCell>
              <TableCell>eye test</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </div>
    </div>
  );

  const renderVerificationStep = () => (
    <div className="grid gap-6 py-4">
      <Table>
        {/* <TableHeader>
          <TableRow>
            <TableHead className="w-[150px]"></TableHead>
            <TableHead></TableHead>
          </TableRow>
        </TableHeader> */}
        <TableBody>
          <TableRow>
            <TableCell className="font-medium text-muted-foreground">
              Employee Number
            </TableCell>
            <TableCell>{formData.employeeNumber}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell className="font-medium text-muted-foreground">
              Claim Type
            </TableCell>
            <TableCell>{formData.claimType}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell className="font-medium text-muted-foreground">
              Amount
            </TableCell>
            <TableCell>K{formData.amount}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell className="font-medium text-muted-foreground">
              Description
            </TableCell>
            <TableCell>{formData.description}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell className="font-medium text-muted-foreground">
              Bank Name
            </TableCell>
            <TableCell>{formData.bankName}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell className="font-medium text-muted-foreground">
              Account Number
            </TableCell>
            <TableCell>{formData.accountNumber}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell className="font-medium text-muted-foreground">
              Account Name
            </TableCell>
            <TableCell>{formData.accountName}</TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </div>
  );

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="font-semibold" variant="default">
          <FilePlus className="w-4 h-4" />
          New Claim
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FilePlus className="w-4 h-4" />
            New Claim
          </DialogTitle>
          <DialogDescription>
            {step === 1
              ? "Enter claim details"
              : step === 2
              ? "Enter bank details"
              : step === 3
              ? "Review Warning"
              : "Verify claim information"}
          </DialogDescription>
        </DialogHeader>

        {step === 4 ? (
          renderVerificationStep()
        ) : step === 3 ? (
          <WarningStep />
        ) : step === 1 ? (
          <div className="grid gap-4 py-4">
            <InputWithLabel
              id="employeeNumber"
              label="Employee Number"
              value={formData.employeeNumber}
              onChange={(e) =>
                handleInputChange("employeeNumber", e.target.value)
              }
              containerClassName="w-full"
            />
            <div className="grid gap-1.5">
              <label className="text-xs font-semibold text-muted-foreground/75">
                Claim Type
              </label>
              <Select
                onValueChange={(value) => handleInputChange("claimType", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select Claim Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="in-patient">
                    In-Patient Treatment
                  </SelectItem>
                  <SelectItem value="pre-hospitalization">
                    Pre-Hospitalization
                  </SelectItem>
                  <SelectItem value="post-hospitalization">
                    Post-Hospitalization
                  </SelectItem>
                  <SelectItem value="dental">Dental Services</SelectItem>
                  <SelectItem value="optical">Optical</SelectItem>
                  <SelectItem value="gp-consultation">
                    General Practitioner Consultation
                  </SelectItem>
                  <SelectItem value="specialist-consultation">
                    Specialist Consultation on Referral
                  </SelectItem>
                  <SelectItem value="prenatal">Pregnancy Pre-natal</SelectItem>
                  <SelectItem value="childbirth">
                    Pregnancy Childbirth
                  </SelectItem>
                  <SelectItem value="postnatal">
                    Pregnancy Post Natal
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
            <InputWithLabel
              id="amount"
              label="Amount (PGK)"
              type="number"
              value={formData.amount}
              onChange={(e) => handleInputChange("amount", e.target.value)}
              containerClassName="w-full"
            />
            <div className="grid gap-1.5">
              <label className="text-xs font-semibold text-muted-foreground/75">
                Description
              </label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) =>
                  handleInputChange("description", e.target.value)
                }
              />
            </div>
          </div>
        ) : (
          <div className="grid gap-4 py-4">
            <InputWithLabel
              id="bankName"
              label="Bank Name"
              value={formData.bankName}
              onChange={(e) => handleInputChange("bankName", e.target.value)}
              containerClassName="w-full"
            />
            <InputWithLabel
              id="accountNumber"
              label="Account Number"
              value={formData.accountNumber}
              onChange={(e) =>
                handleInputChange("accountNumber", e.target.value)
              }
              containerClassName="w-full"
            />
            <InputWithLabel
              id="accountName"
              label="Account Name"
              value={formData.accountName}
              onChange={(e) => handleInputChange("accountName", e.target.value)}
              containerClassName="w-full"
            />
          </div>
        )}
        <DialogFooter>
          {step > 1 && (
            <Button type="button" variant="outline" onClick={handleBack}>
              Back
            </Button>
          )}
          {step < 4 ? (
            <Button type="button" onClick={handleNext}>
              {step === 3 ? "Proceed" : "Next"}
            </Button>
          ) : (
            <Button type="button" onClick={handleSubmit}>
              Submit
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
