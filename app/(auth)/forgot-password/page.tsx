import { ForgotPasswordForm } from "@/components/organisms/forgot-password-form";
import { Suspense } from "react";

export default function ForgotPasswordPage() {
  return (
    <Suspense fallback={<></>}>
      <ForgotPasswordForm />
    </Suspense>
  );
}
