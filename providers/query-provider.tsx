/**
 * @file query-provider.tsx
 * @description React Query provider for managing server state and caching
 * @author Aaron J. Girton - https://github.com/aj0urdain
 * @created 2025
 */

"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

/**
 * Provider component that wraps the application with React Query functionality
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Child components to be wrapped
 * @returns {JSX.Element} Query Provider component
 *
 * @example
 * ```tsx
 * function App() {
 *   return (
 *     <QueryProvider>
 *       <YourApp />
 *     </QueryProvider>
 *   );
 * }
 * ```
 */
export function QueryProvider({ children }: { children: React.ReactNode }) {
  const queryClient = new QueryClient();

  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
}
