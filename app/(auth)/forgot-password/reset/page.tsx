import { ResetPasswordForm } from "@/components/organisms/reset-password-form";
import { Suspense } from "react";

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<></>}>
      <ResetPasswordForm />
    </Suspense>
  );
}
