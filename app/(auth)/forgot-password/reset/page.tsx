/**
 * File: app/(auth)/forgot-password/reset/page.tsx
 * Description: Page component for resetting user password after verification
 * Author: Aaron J. Girton - https://github.com/aj0urdain
 * Created: 2025
 */

import { ResetPasswordForm } from "@/components/organisms/reset-password-form";
import { Suspense } from "react";

/**
 * ResetPasswordPage Component
 *
 * Renders the password reset form within a suspense boundary.
 * This page allows users to set a new password after verifying their identity
 * through the forgot password flow.
 *
 * @returns {JSX.Element} The reset password page with suspense boundary
 */
export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<></>}>
      <ResetPasswordForm />
    </Suspense>
  );
}
