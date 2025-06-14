/**
 * File: app/not-found.tsx
 * Description: 404 Not Found page component for handling undefined routes
 * Author: Aaron J. Girton - https://github.com/aj0urdain
 * Created: 2025
 */

import Link from "next/link";

/**
 * NotFound Component
 *
 * Custom 404 page that provides:
 * - Clear error message
 * - User-friendly explanation
 * - Navigation back to dashboard
 *
 * Features:
 * - Responsive design
 * - Accessible navigation
 * - Consistent styling with main app
 *
 * @returns {JSX.Element} 404 Not Found page with navigation
 */
export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full space-y-8 p-8 text-center">
        <div>
          <h2 className="mt-6 text-3xl font-bold text-gray-900">
            404 - Page Not Found
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Sorry, we couldn&apos;t find the page you&apos;re looking for.
          </p>
        </div>
        <div className="mt-8">
          <Link
            href="/dashboard"
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Return to Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}
