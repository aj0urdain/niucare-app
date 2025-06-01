/**
 * File: app/(auth)/auth/page.tsx
 * Description: Authentication page component that renders the login form with suspense boundary
 * Author: Aaron J. Girton - https://github.com/aj0urdain
 * Created: 2025
 */

import LoginForm from "@/components/organisms/login-form";
import { Suspense } from "react";

/**
 * LoginPage Component
 *
 * Renders the main authentication page with a login form.
 * Uses React Suspense for loading state management.
 *
 * @returns {JSX.Element} The rendered login page with suspense boundary
 */
export default function LoginPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <LoginForm />
    </Suspense>
  );
}
