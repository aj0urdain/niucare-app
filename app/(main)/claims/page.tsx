"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { ClaimsContent } from "@/components/organisms/claims-content";
import { ProtectedRouteProvider } from "@/providers/protected-route-provider";
import { FileHeart } from "lucide-react";

const ClaimsContentWrapper = () => {
  const searchParams = useSearchParams();
  const claimId = searchParams.get("id");

  return (
    <div className="animate-slide-up-fade-in">
      <div className="flex items-center gap-2 mt-4">
        <FileHeart className="h-8 w-8 animate-slide-down-fade-in" />
        <h1 className="text-4xl font-bold animate-slide-up-fade-in">Claims</h1>
      </div>
      {/* <Separator className="my-8" /> */}
      <ClaimsContent initialClaimId={claimId} />
    </div>
  );
};

const Claims = () => {
  return (
    <ProtectedRouteProvider
      requiredPermissions={{
        canApproveRegistration: true,
        acknowledgedRegistration: true,
      }}
    >
      <Suspense fallback={<></>}>
        <ClaimsContentWrapper />
      </Suspense>
    </ProtectedRouteProvider>
  );
};

export default Claims;
