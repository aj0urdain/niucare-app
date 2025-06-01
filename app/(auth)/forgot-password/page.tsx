/**
 * File: app/(auth)/forgot-password/page.tsx
 * Description: Page component for initiating the password reset process
 * Author: Aaron J. Girton - https://github.com/aj0urdain
 * Created: 2025
 */

import { ForgotPasswordForm } from "@/components/organisms/forgot-password-form";
import { Suspense } from "react";

/**
 * ForgotPasswordPage Component
 *
 * Renders the forgot password form within a suspense boundary.
 * This page allows users to request a password reset by providing their email address.
 *
 * @returns {JSX.Element} The forgot password page with suspense boundary
 */
export default function ForgotPasswordPage() {
  return (
    <Suspense fallback={<></>}>
      <ForgotPasswordForm />
    </Suspense>
  );
}
