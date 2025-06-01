/**
 * File: app/(main)/layout.tsx
 * Description: Main application layout component that provides the core structure for authenticated pages
 * Author: Aaron J. Girton - https://github.com/aj0urdain
 * Created: 2025
 */

import { AppHeader } from "@/components/molecules/app-header";
import { AppSidebar } from "@/components/organisms/app-sidebar";
import { SidebarProvider } from "@/components/ui/sidebar";

/**
 * MainLayout Component
 *
 * Provides the core layout structure for authenticated pages in the application.
 * Features:
 * - Responsive sidebar navigation
 * - Application header
 * - Centered content area with max width
 * - Sidebar state management through SidebarProvider
 *
 * @param props - Component props
 * @param props.children - Child components to be rendered within the layout
 * @returns {JSX.Element} The main application layout with navigation and content structure
 */
export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <AppSidebar />
      <main className="mx-auto px-6 flex flex-col h-full w-full items-center justify-center pt-4 2xl:mx-auto">
        <AppHeader />
        <div className="h-full w-full max-w-6xl py-4">{children}</div>
      </main>
    </SidebarProvider>
  );
}
