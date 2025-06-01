/**
 * File: components/atoms/theme-provider.tsx
 * Description: Theme provider component for managing application theme state
 * Author: Aaron J. Girton - https://github.com/aj0urdain
 * Created: 2025
 *
 * This component provides theme management functionality using next-themes.
 * It enables system theme detection, theme persistence, and smooth theme transitions.
 */

"use client";

import * as React from "react";
import { ThemeProvider as NextThemesProvider } from "next-themes";

/**
 * ThemeProvider Component
 *
 * A wrapper component that provides theme management capabilities to the application.
 * Features:
 * - System theme detection
 * - Theme persistence
 * - Smooth theme transitions
 * - Dark/light mode support
 * - Theme synchronization across tabs
 *
 * Usage:
 * ```tsx
 * // In your app layout
 * function RootLayout({ children }) {
 *   return (
 *     <ThemeProvider
 *       attribute="class"
 *       defaultTheme="system"
 *       enableSystem
 *       disableTransitionOnChange
 *     >
 *       {children}
 *     </ThemeProvider>
 *   );
 * }
 *
 * // In your components
 * function MyComponent() {
 *   const { theme, setTheme } = useTheme();
 *
 *   return (
 *     <button onClick={() => setTheme('dark')}>
 *       Switch to dark mode
 *     </button>
 *   );
 * }
 * ```
 *
 * @param props - Component props extending NextThemesProvider props
 * @param props.children - Child components to be wrapped with theme context
 * @returns {JSX.Element} Theme provider wrapper component
 */
export function ThemeProvider({
  children,
  ...props
}: React.ComponentProps<typeof NextThemesProvider>) {
  return <NextThemesProvider {...props}>{children}</NextThemesProvider>;
}
