/**
 * File: app/(main)/claims/page.tsx
 * Description: Claims management page component with protected route and content wrapper
 * Author: Aaron J. Girton - https://github.com/aj0urdain
 * Created: 2025
 */

"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { ClaimsContent } from "@/components/organisms/claims-content";
import { ProtectedRouteProvider } from "@/providers/protected-route-provider";
import { FileHeart } from "lucide-react";

/**
 * ClaimsContentWrapper Component
 *
 * Wrapper component that provides the claims page layout and handles URL parameters.
 * Features:
 * - Animated page header
 * - Claims content with initial claim ID from URL
 * - Responsive layout
 *
 * @returns {JSX.Element} The claims page content with header and claims management interface
 */
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

/**
 * Claims Component
 *
 * Main claims page component that provides:
 * - Protected route access control
 * - Suspense boundary for loading states
 * - Claims content wrapper
 *
 * Required permissions:
 * - canApproveRegistration: true
 * - acknowledgedRegistration: true
 *
 * @returns {JSX.Element} The protected claims page with content wrapper
 */
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
