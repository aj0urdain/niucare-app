"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { ClaimsContent } from "@/components/organisms/claims-content";

const Claims = () => {
  const searchParams = useSearchParams();
  const claimId = searchParams.get("id");

  return (
    <Suspense fallback={<></>}>
      <ClaimsContent initialClaimId={claimId} />
    </Suspense>
  );
};

export default Claims;
