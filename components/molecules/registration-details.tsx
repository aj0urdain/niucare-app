"use client";

import { Provider } from "@/components/atoms/admin-columns";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Building2, Hospital } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";

/**
 * RegistrationDetails Component
 *
 * Displays user registration information and status.
 *
 * Features:
 * - User information display
 * - Registration status
 * - Email verification status
 * - Bank details status
 * - Responsive design
 * - Accessibility features
 *
 * @returns {JSX.Element} Registration details component
 *
 * @example
 * ```tsx
 * <RegistrationDetails />
 * ```
 */
export function RegistrationDetails({
  provider,
}: {
  provider: Provider | null;
}) {
  if (!provider) {
    return (
      <Card className="h-full">
        <CardHeader className="p-6">
          <CardTitle>Select a registration to view details</CardTitle>
          <CardDescription>
            Click on any registration from the list to view its complete
            information
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <Card className="h-full">
      <CardHeader className="p-6 border-b">
        <div className="flex items-center gap-3">
          {provider.type === "private" ? (
            <Building2 className="h-8 w-8 text-muted-foreground" />
          ) : (
            <Hospital className="h-8 w-8 text-muted-foreground" />
          )}
          <div>
            <CardTitle>{provider.practiceName}</CardTitle>
            <CardDescription>{provider.registrationId}</CardDescription>
          </div>
        </div>
      </CardHeader>
      <ScrollArea className="h-[calc(100vh-16rem)]">
        <CardContent className="p-6">
          <div className="grid gap-6">
            {/* Public Officer Details */}
            <section>
              <h3 className="font-medium mb-3">Public Officer Details</h3>
              <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
                <div>
                  <span className="text-muted-foreground">Name:</span>
                  <p>{`${provider.firstName} ${provider.lastName}`}</p>
                </div>
                <div>
                  <span className="text-muted-foreground">Email:</span>
                  <p>{provider.email}</p>
                </div>
                <div>
                  <span className="text-muted-foreground">Phone:</span>
                  <p>{provider.phone || "Not provided"}</p>
                </div>
              </div>
            </section>

            {/* Medical Practitioner Details */}
            <section>
              <h3 className="font-medium mb-3">Medical Practitioner Details</h3>
              <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
                <div>
                  <span className="text-muted-foreground">
                    Registration Number:
                  </span>
                  <p>{provider.medicalBoardRegNumber || "Not provided"}</p>
                </div>
                <div>
                  <span className="text-muted-foreground">
                    Terms in Practice:
                  </span>
                  <p>
                    {provider.termsInPractice
                      ? `${provider.termsInPractice} years`
                      : "Not provided"}
                  </p>
                </div>
                <div>
                  <span className="text-muted-foreground">
                    Registration Expiry:
                  </span>
                  <p>{provider.regExpiryDate || "Not provided"}</p>
                </div>
              </div>
            </section>

            {/* Practice Details */}
            <section>
              <h3 className="font-medium mb-3">Practice Details</h3>
              <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
                <div>
                  <span className="text-muted-foreground">Practice Name:</span>
                  <p>{provider.practiceName}</p>
                </div>
                <div>
                  <span className="text-muted-foreground">Type:</span>
                  <p className="capitalize">{provider.type}</p>
                </div>
                <div>
                  <span className="text-muted-foreground">Province:</span>
                  <p>{provider.province}</p>
                </div>
                <div>
                  <span className="text-muted-foreground">Business Type:</span>
                  <p>{provider.businessType || "Not provided"}</p>
                </div>
                <div>
                  <span className="text-muted-foreground">TIN Number:</span>
                  <p>{provider.tinNumber || "Not provided"}</p>
                </div>
                <div>
                  <span className="text-muted-foreground">IPA Number:</span>
                  <p>{provider.ipaNumber || "Not provided"}</p>
                </div>
              </div>
            </section>

            {/* Bank Details */}
            <section>
              <h3 className="font-medium mb-3">Bank Details</h3>
              <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
                <div>
                  <span className="text-muted-foreground">Bank Name:</span>
                  <p>{provider.bankName || "Not provided"}</p>
                </div>
                <div>
                  <span className="text-muted-foreground">Account Number:</span>
                  <p>{provider.accountNumber || "Not provided"}</p>
                </div>
                <div>
                  <span className="text-muted-foreground">Account Name:</span>
                  <p>{provider.accountName || "Not provided"}</p>
                </div>
                <div>
                  <span className="text-muted-foreground">Branch:</span>
                  <p>{provider.branchName || "Not provided"}</p>
                </div>
              </div>
            </section>

            {/* Documents Status */}
            <section>
              <h3 className="font-medium mb-3">Documents</h3>
              <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
                <div>
                  <span className="text-muted-foreground">
                    IPA Certificate:
                  </span>
                  <p>{provider.ipaCertificate ? "Uploaded" : "Not uploaded"}</p>
                </div>
                <div>
                  <span className="text-muted-foreground">
                    TIN Certificate:
                  </span>
                  <p>{provider.tinCertificate ? "Uploaded" : "Not uploaded"}</p>
                </div>
                <div>
                  <span className="text-muted-foreground">
                    Medical Board Certificate:
                  </span>
                  <p>
                    {provider.medicalBoardCertificate
                      ? "Uploaded"
                      : "Not uploaded"}
                  </p>
                </div>
              </div>
            </section>
          </div>
        </CardContent>
      </ScrollArea>
    </Card>
  );
}
