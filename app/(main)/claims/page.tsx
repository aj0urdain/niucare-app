"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { ClaimsContent } from "@/components/organisms/claims-content";

const ClaimsContentWrapper = () => {
  const searchParams = useSearchParams();
  const claimId = searchParams.get("id");

  return <ClaimsContent initialClaimId={claimId} />;
};

const Claims = () => {
  return (
    <Suspense fallback={<></>}>
      <ClaimsContentWrapper />
    </Suspense>
  );
};

export default Claims;
