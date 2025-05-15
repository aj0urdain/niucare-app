import { RegistrationStatusCard } from "@/components/molecules/registration-status-card";
import { RegistrationDetailsCard } from "@/components/molecules/registration-details-card";

interface SubmittedRegistrationProps {
  registration: {
    status: string;
    luhnRegistrationNumber: string;
    ptype: string;
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
    reason?: string;
  };
}

export function SubmittedRegistration({
  registration,
}: SubmittedRegistrationProps) {
  return (
    <div className="grid grid-cols-4 gap-4">
      <div className="col-span-1">
        <RegistrationStatusCard
          status={registration.status}
          luhnRegistrationNumber={registration.luhnRegistrationNumber}
          reason={registration.reason}
        />
      </div>
      <div className="col-span-3">
        <RegistrationDetailsCard registration={registration} />
      </div>
    </div>
  );
}
