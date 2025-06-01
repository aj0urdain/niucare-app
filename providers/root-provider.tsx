/**
 * @file root-provider.tsx
 * @description Root provider component with React Query configuration and dev tools
 * @author Aaron J. Girton - https://github.com/aj0urdain
 * @created 2025
 */

"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { useState } from "react";

/**
 * Provider component that wraps the application with React Query functionality and dev tools
 * Configures query client with default options for stale time and retry behavior
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Child components to be wrapped
 * @returns {JSX.Element} Root Provider component with dev tools
 *
 * @example
 * ```tsx
 * function App() {
 *   return (
 *     <RootProvider>
 *       <YourApp />
 *     </RootProvider>
 *   );
 * }
 * ```
 */
export function RootProvider({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 1000 * 60 * 5, // 5 minutes
            retry: 2,
          },
        },
      })
  );

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}
