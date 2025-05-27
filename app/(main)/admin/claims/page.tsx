"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { ClaimsContent } from "@/components/organisms/claims-content";

const ClaimsPageContent = () => {
  const searchParams = useSearchParams();
  const claimId = searchParams.get("id");

  return <ClaimsContent initialClaimId={claimId} />;
};

const AdminClaims = () => {
  return (
    <Suspense fallback={<></>}>
      <ClaimsPageContent />
    </Suspense>
  );
};

export default AdminClaims;
