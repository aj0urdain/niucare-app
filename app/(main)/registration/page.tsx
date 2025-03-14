import Link from "next/link";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import {
  Hospital,
  Building2,
  FileText,
  Landmark,
  FileSignature,
  UserCheck,
  Badge,
  Clock,
} from "lucide-react";
import { Separator } from "@/components/ui/separator";

export default function RegistrationPage() {
  return (
    <div className="flex flex-col gap-6 pt-6">
      <div className="flex flex-col gap-2">
        <h2 className="text-3xl font-bold">Registration</h2>
        <p className="text-muted-foreground">
          Select your service provider category
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Link href="/registration/private">
          <Card className="hover:bg-muted/50 transition-colors cursor-pointer animate-slide-left-fade-in">
            <CardHeader className="flex flex-row items-center justify-between gap-4">
              <div className="flex flex-row items-center gap-4">
                <Building2 className="h-8 w-8" />
                <div className="flex flex-col gap-1">
                  <CardTitle>Private Service Providers</CardTitle>
                  <CardDescription>
                    Non-government Health Care Providers
                  </CardDescription>
                </div>
              </div>
              <div className="flex flex-row items-center gap-2 border border-muted-foreground/20 px-3 py-1.5 rounded-md">
                {/* Badge showing estimated time to complete the form */}

                <Clock className="w-4 h-4 text-muted-foreground" />
                <p className="text-muted-foreground text-xs font-semibold">
                  10 minutes
                </p>
              </div>
            </CardHeader>
            <Separator className="" />
            <CardContent className="mt-4">
              <p className="text-muted-foreground text-xs mb-2 w-1/2">
                To complete this form, please make sure you have the following
                information available:
              </p>
              {/* <h4 className="text-sm font-medium mb-2">
                Required Information:
              </h4> */}

              <div className="space-y-4 text-sm pt-4">
                <div className="flex items-start gap-2">
                  <UserCheck className="w-4 h-4 text-muted-foreground mt-0.5" />
                  <div>
                    <p className="font-medium">Officer Details</p>
                    <p className="text-muted-foreground text-xs">
                      Public officer and medical practitioner information
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <Building2 className="w-4 h-4 text-muted-foreground mt-0.5" />
                  <div>
                    <p className="font-medium">Business Details</p>
                    <p className="text-muted-foreground text-xs">
                      Service provider and practice information
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <Landmark className="w-4 h-4 text-muted-foreground mt-0.5" />
                  <div>
                    <p className="font-medium">Bank Details</p>
                    <p className="text-muted-foreground text-xs">
                      Banking and payment information
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <FileText className="w-4 h-4 text-muted-foreground mt-0.5" />
                  <div>
                    <p className="font-medium">Documents</p>
                    <p className="text-muted-foreground text-xs">
                      IPA, TIN, and medical board certificates
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <FileSignature className="w-4 h-4 text-muted-foreground mt-0.5" />
                  <div>
                    <p className="font-medium">Signature</p>
                    <p className="text-muted-foreground text-xs">
                      Draw on screen or upload signature file
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </Link>

        <Link href="/registration/public">
          <Card className="hover:bg-muted/50 transition-colors cursor-pointer animate-slide-right-fade-in">
            <CardHeader className="flex flex-row items-center justify-between gap-4">
              <div className="flex flex-row items-center gap-4">
                <Hospital className="h-8 w-8" />
                <div className="flex flex-col gap-1">
                  <CardTitle>Provincial Health Authorities</CardTitle>
                  <CardDescription>
                    Government Hospitals, Clinics and Medical Centers
                  </CardDescription>
                </div>
              </div>
              <div className="flex flex-row items-center gap-2 border border-muted-foreground/20 px-3 py-1.5 rounded-md">
                <Clock className="w-4 h-4 text-muted-foreground" />
                <p className="text-muted-foreground text-xs font-semibold">
                  10 minutes
                </p>
              </div>
            </CardHeader>
            <Separator className="" />
            <CardContent className="mt-4">
              <p className="text-muted-foreground text-xs mb-2 w-1/2">
                To complete this form, please make sure you have the following
                information available:
              </p>
              <div className="space-y-4 text-sm pt-4">
                <div className="flex items-start gap-2">
                  <UserCheck className="w-4 h-4 text-muted-foreground mt-0.5" />
                  <div>
                    <p className="font-medium">Public Officer Details</p>
                    <p className="text-muted-foreground text-xs">
                      Officer information and P.O Box details
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <Hospital className="w-4 h-4 text-muted-foreground mt-0.5" />
                  <div>
                    <p className="font-medium">Provincial Health Authority</p>
                    <p className="text-muted-foreground text-xs">
                      PHA details, location, and practice information
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <Landmark className="w-4 h-4 text-muted-foreground mt-0.5" />
                  <div>
                    <p className="font-medium">Bank Details</p>
                    <p className="text-muted-foreground text-xs">
                      Banking and payment information
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <FileText className="w-4 h-4 text-muted-foreground mt-0.5" />
                  <div>
                    <p className="font-medium">Documents</p>
                    <p className="text-muted-foreground text-xs">
                      TIN certificate and authorization
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <FileSignature className="w-4 h-4 text-muted-foreground mt-0.5" />
                  <div>
                    <p className="font-medium">Signature</p>
                    <p className="text-muted-foreground text-xs">
                      Draw on screen or upload signature file
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </Link>
      </div>
    </div>
  );
}
