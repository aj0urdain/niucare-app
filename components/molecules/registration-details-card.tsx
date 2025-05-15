import { Building2, UserCheck, MapPin, Landmark, FileText } from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

interface RegistrationDetailsCardProps {
  registration: {
    ptype: string;
    luhnRegistrationNumber: string;
    public_officer_firstname: string;
    public_officer_lastname: string;
    email: string;
    business_Phone_Number: string;
    mobile_Phone_Number: string;
    practice_Name: string;
    business_Type: string;
    premises: string;
    registered_Business_Name: string;
    practice_Section: string;
    practice_Lot: string;
    practice_Street: string;
    practice_Suburb: string;
    practice_Province: string;
    bank: string;
    branch_Name: string;
    branch_Number: string;
    account_Number: string;
    account_Name: string;
    medical_Practitioner_firstname: string;
    medical_Practitioner_lastname: string;
    ipa_Certificate: string;
    tin_Certificate: string;
    medical_Certificate: string;
    medical_Practitioner_Signiture: string;
  };
}

export function RegistrationDetailsCard({
  registration,
}: RegistrationDetailsCardProps) {
  return (
    <Card className="flex flex-col gap-6">
      <CardHeader className="flex flex-row justify-between">
        <div className="flex items-center gap-2">
          <Building2 className="w-5 h-5 text-primary" />
          <h2 className="text-3xl font-bold">
            {registration.ptype === "private"
              ? "Private Service Provider"
              : "Provincial Health Authority"}{" "}
            Registration
          </h2>
        </div>
        <p className="text-muted-foreground">
          {registration.luhnRegistrationNumber}
        </p>
      </CardHeader>

      <CardContent>
        <div className="grid gap-6">
          {/* Public Officer Details */}
          <div className="rounded-lg border p-4">
            <div className="flex items-center gap-2 mb-4">
              <UserCheck className="w-5 h-5 text-primary" />
              <h3 className="text-lg font-semibold">Public Officer Details</h3>
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <p className="text-sm text-muted-foreground">First Name</p>
                <p>{registration.public_officer_firstname}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Last Name</p>
                <p>{registration.public_officer_lastname}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Email</p>
                <p>{registration.email}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Phone</p>
                <p>{registration.business_Phone_Number}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Mobile</p>
                <p>{registration.mobile_Phone_Number}</p>
              </div>
            </div>
          </div>

          {/* Practice Details */}
          <div className="rounded-lg border p-4">
            <div className="flex items-center gap-2 mb-4">
              <Building2 className="w-5 h-5 text-primary" />
              <h3 className="text-lg font-semibold">Practice Details</h3>
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <p className="text-sm text-muted-foreground">Practice Name</p>
                <p>{registration.practice_Name}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Business Type</p>
                <p>{registration.business_Type}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Premises</p>
                <p>{registration.premises}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">
                  Registered Business Name
                </p>
                <p>{registration.registered_Business_Name}</p>
              </div>
            </div>
          </div>

          {/* Address Details */}
          <div className="rounded-lg border p-4">
            <div className="flex items-center gap-2 mb-4">
              <MapPin className="w-5 h-5 text-primary" />
              <h3 className="text-lg font-semibold">Address Details</h3>
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <p className="text-sm text-muted-foreground">Section</p>
                <p>{registration.practice_Section}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Lot</p>
                <p>{registration.practice_Lot}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Street</p>
                <p>{registration.practice_Street}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Suburb</p>
                <p>{registration.practice_Suburb}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Province</p>
                <p>{registration.practice_Province}</p>
              </div>
            </div>
          </div>

          {/* Bank Details */}
          <div className="rounded-lg border p-4">
            <div className="flex items-center gap-2 mb-4">
              <Landmark className="w-5 h-5 text-primary" />
              <h3 className="text-lg font-semibold">Bank Details</h3>
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <p className="text-sm text-muted-foreground">Bank</p>
                <p>{registration.bank}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Branch Name</p>
                <p>{registration.branch_Name}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Branch Number</p>
                <p>{registration.branch_Number}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Account Number</p>
                <p>{registration.account_Number}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Account Name</p>
                <p>{registration.account_Name}</p>
              </div>
            </div>
          </div>

          {/* Medical Practitioner Details */}
          <div className="rounded-lg border p-4">
            <div className="flex items-center gap-2 mb-4">
              <UserCheck className="w-5 h-5 text-primary" />
              <h3 className="text-lg font-semibold">
                Medical Practitioner Details
              </h3>
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <p className="text-sm text-muted-foreground">First Name</p>
                <p>{registration.medical_Practitioner_firstname}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Last Name</p>
                <p>{registration.medical_Practitioner_lastname}</p>
              </div>
            </div>
          </div>

          {/* Documents */}
          <div className="rounded-lg border p-4">
            <div className="flex items-center gap-2 mb-4">
              <FileText className="w-5 h-5 text-primary" />
              <h3 className="text-lg font-semibold">Documents</h3>
            </div>
            <div className="grid gap-4">
              <div>
                <p className="text-sm text-muted-foreground">IPA Certificate</p>
                <a
                  href={registration.ipa_Certificate}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline"
                >
                  View IPA Certificate
                </a>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">TIN Certificate</p>
                <a
                  href={registration.tin_Certificate}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline"
                >
                  View TIN Certificate
                </a>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">
                  Medical Certificate
                </p>
                <a
                  href={registration.medical_Certificate}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline"
                >
                  View Medical Certificate
                </a>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">
                  Medical Practitioner Signature
                </p>
                <a
                  href={registration.medical_Practitioner_Signiture}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline"
                >
                  View Signature
                </a>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
