import { BadgeCheck } from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

interface RegistrationStatusCardProps {
  status: string;
  luhnRegistrationNumber?: string;
  reason?: string;
}

export function RegistrationStatusCard({
  status,
  luhnRegistrationNumber,
  reason,
}: RegistrationStatusCardProps) {
  return (
    <Card className="h-full max-h-96 sticky top-[4.5rem]">
      <CardHeader>
        <div className="flex items-center gap-2">
          <BadgeCheck className="w-5 h-5 text-primary" />
          <h3 className="text-lg font-semibold">Registration Status</h3>
        </div>
      </CardHeader>
      <CardContent>
        <div
          className={`rounded-lg p-4 ${
            status === "Pending"
              ? "bg-yellow-50 border border-yellow-200"
              : status === "Approved"
              ? "bg-green-50 border border-green-200"
              : "bg-red-50 border border-red-200"
          }`}
        >
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-2">
              <span
                className={`px-3 py-1 rounded-full text-sm font-medium ${
                  status === "Pending"
                    ? "bg-yellow-100 text-yellow-800"
                    : status === "Approved"
                    ? "bg-green-100 text-green-800"
                    : "bg-red-100 text-red-800"
                }`}
              >
                {status}
              </span>
            </div>
            <div className="text-sm text-muted-foreground">
              {status === "Pending" ? (
                <p className="text-xs">
                  Your registration is currently under review by our
                  administration team. This process typically takes 2-3 business
                  days. We&apos;ll notify you once your registration has been
                  reviewed.
                </p>
              ) : status === "Approved" ? (
                <p className="text-xs">
                  Congratulations! Your registration has been approved. You can
                  now start using Niucare services. Your registration number is{" "}
                  {luhnRegistrationNumber}.
                </p>
              ) : (
                <p className="text-xs">
                  Your registration has been rejected. If you believe this is an
                  error, please contact our support team for assistance. Reason:{" "}
                  {reason || "No reason provided"}
                </p>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
